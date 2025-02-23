/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode, createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import Router, { useRouter } from "next/router";
import { api } from "@/services/apiClient";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  empresa?: string;
  subscriptionPriceId: string;
};

type SignInCredentials = {
  userData: {
    email: string;
    password: string;
  };
  actionOnFinally?: () => void;
  redirectToCheckoutAction?: () => void;
};

type SignUpCredentials = {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    empresa?: string;
    password: string;

  };
  actionOnFinally?: () => void;
  selectedPrice?: string;
  redirectCheckout?: boolean;
};

type AuthContextData = {
  actionAfterLogin?: () => void;
  signIn({
    userData,
    actionOnFinally,
  }: SignInCredentials): Promise<string | null>;
  signOut: () => void;
  signUp({
    userData,
    actionOnFinally,
    selectedPrice,
    redirectCheckout,
  }: SignUpCredentials): Promise<string | null>;
  user: User;
  isAuthenticated: boolean;
  isLoadingPage: boolean;
  updateUser: (user: User) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "incorporae.token");

  api.defaults.headers.Authorization = `Bearer`;

  authChannel.postMessage("signOut");

  Router.reload();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const isAuthenticated = !!user.id;

  const router = useRouter();

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          setUser({} as User);
          api.defaults.headers.Authorization = `Bearer`;
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await api.get("/csrf");

        api.interceptors.request.use(async (config) => {
          if (["post", "put", "delete"].includes(config.method || "")) {
            const csrfToken = await response.data.csrfToken; // Busca do armazenamento
            if (csrfToken) {
              config.headers["X-CSRF-Token"] = csrfToken; // Enviar no header
            }
          }
          return config;
        });
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  function updateUser(user: User) {
    setUser(user);
  }

  async function signIn({
    userData,
    actionOnFinally,
    redirectToCheckoutAction,
  }: SignInCredentials): Promise<string | null> {
    try {
      const response = await api.post("/auth/login", userData);

      const { token, user } = response.data;
     
      setCookie(undefined, "incorporae.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser({ ...user, token });

      if (redirectToCheckoutAction) {
        redirectToCheckoutAction();
      } else {
        router.push("/login");
      }

      return null; // Nenhum erro ocorreu
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Erro ao fazer login. Tente novamente.";

      return errorMessage; // Retorna o erro para ser tratado no formulário
    } finally {
      if (actionOnFinally) {
        actionOnFinally();
      }
    }
  }

  async function signUp({
    userData,
    actionOnFinally,
    redirectCheckout,
    selectedPrice,
  }: SignUpCredentials): Promise<string | null> {
    try {
      await api.post("/auth/register", userData);

      if (redirectCheckout && selectedPrice) {
        Router.push(
          "/login?redirectCheckout=" +
            redirectCheckout +
            "&selectedPrice=" +
            selectedPrice
        );
      } else {
        Router.push("/login");
      }
      return null;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Erro ao criar conta. Tente novamente.";
      return errorMessage; // Retorna o erro para ser exibido no formulário
    } finally {
      if (actionOnFinally) {
        actionOnFinally();
      }
    }
  }

  useEffect(() => {
    const cookies = parseCookies();
    const { "incorporae.token": token } = cookies;

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const data = response.data;

          setUser(data);
        })
        .catch(() => {
          signOut();
          setIsLoadingPage(false);
        });
    } else {
      setIsLoadingPage(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        updateUser,
        signOut,
        user,
        signUp,
        isAuthenticated,
        isLoadingPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
