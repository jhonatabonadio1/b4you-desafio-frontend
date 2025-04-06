/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface APIError {
  code?: string;
  message?: string;
}

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx);
  const { "b4you.token": token } = cookies;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const apiError = error.response?.data as APIError;

      if (
        error.response?.status === 401 &&
        apiError?.code === "token.expired"
      ) {
        const originalConfig = error.config as any;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await api.post("/auth/token/refresh");

            const newToken = response.data.accessToken;

            setCookie(ctx, "b4you.token", newToken, {
              maxAge: 60 * 60 * 1, // 1 hora
              path: "/",
            });

            api.defaults.headers.Authorization = `Bearer ${newToken}`;

            failedRequestsQueue.forEach((req) => {
              req.resolve(newToken);
            });
            failedRequestsQueue = [];

            return api(originalConfig);
          } catch (err) {
            failedRequestsQueue.forEach((req) => {
              req.reject(err);
            });
            failedRequestsQueue = [];

            if (typeof window !== "undefined") {
              destroyCookie(undefined, "b4you.token");
              window.location.href = "/login";
            }

            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
}
