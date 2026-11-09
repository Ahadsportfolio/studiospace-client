"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export type AuthUser = {
  name: string;
  email: string;
  image?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    image?: string,
  ) => Promise<void>;
  googleLogin: (callbackURL?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [exchangedToken, setExchangedToken] = useState<string | null>(null);
  const [failedToken, setFailedToken] = useState<string | null>(null);
  const pendingExchange = useRef<{
    token: string;
    promise: Promise<void>;
  } | null>(null);

  const exchangeSession = useCallback((sessionToken: string) => {
    if (exchangedToken === sessionToken) {
      return Promise.resolve();
    }

    if (pendingExchange.current?.token === sessionToken) {
      return pendingExchange.current.promise;
    }

    const promise = apiFetch<{ success: boolean; token?: string }>("api/auth/jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    })
      .then((data) => {
        if (data?.token && typeof window !== "undefined") {
          localStorage.setItem("studiospace_token", data.token);
        }
        setExchangedToken(sessionToken);
        setFailedToken(null);
      })
      .catch((error: unknown) => {
        if (pendingExchange.current?.token === sessionToken) {
          pendingExchange.current = null;
        }
        throw error;
      })
      .finally(() => {
        if (pendingExchange.current?.token === sessionToken) {
          pendingExchange.current = null;
        }
      });

    pendingExchange.current = { token: sessionToken, promise };
    return promise;
  }, [exchangedToken]);

  const sessionToken = session?.session.token;

  useEffect(() => {
    if (!sessionToken) {
      return;
    }

    void exchangeSession(sessionToken).catch((error: unknown) => {
      setFailedToken(sessionToken);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not connect your account to StudioSpace.",
      );
    });
  }, [exchangeSession, sessionToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        throw new Error(result.error.message || "Unable to sign in.");
      }

      await exchangeSession(result.data.token);
      await refetch();
    },
    [exchangeSession, refetch],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      image?: string,
    ) => {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });
      if (result.error) {
        throw new Error(result.error.message || "Unable to create your account.");
      }
    },
    [],
  );

  const googleLogin = useCallback(async (callbackURL?: string) => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL || "/",
    });
    if (result.error) {
      throw new Error(result.error.message || "Unable to sign in with Google.");
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("studiospace_token");
    }

    const results = await Promise.allSettled([
      apiFetch("api/auth/logout", { method: "POST" }),
      authClient.signOut().then((result) => {
        if (result.error) {
          throw new Error(result.error.message || "Unable to sign out.");
        }
      }),
    ]);

    setExchangedToken(null);
    setFailedToken(null);
    await refetch();

    const failures = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      )
      .map((result) =>
        result.reason instanceof Error
          ? result.reason.message
          : "Unable to sign out.",
      );
    if (failures.length > 0) {
      throw new Error(failures.join(" "));
    }
  }, [refetch]);

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading:
          isPending ||
          Boolean(
            sessionToken &&
              exchangedToken !== sessionToken &&
              failedToken !== sessionToken,
          ),
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
