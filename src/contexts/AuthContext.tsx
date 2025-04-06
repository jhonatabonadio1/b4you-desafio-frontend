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
  destroyCookie(undefined, "b4you.token");

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

      const { accessToken, user } = response.data;

      setCookie(undefined, "b4you.token", accessToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });

      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      setUser({ ...user, token: accessToken });

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
  }: SignUpCredentials): Promise<string | null> {
    try {
      await api.post("/auth/register", userData);

      Router.push("/login");

      return null;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Erro ao criar conta. Tente novamente.";
      return errorMessage;
    } finally {
      if (actionOnFinally) {
        actionOnFinally();
      }
    }
  }

  useEffect(() => {
    const cookies = parseCookies();
    const { "b4you.token": token } = cookies;

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
