"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("@ControlPay:token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // TODO: Implementar validação do token com o backend
      setUser({
        id: "1",
        name: "Usuário",
        email: "usuario@example.com",
      });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Implementar autenticação com o backend
      const token = "token-simulado";
      localStorage.setItem("@ControlPay:token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id: "1",
        name: "Usuário",
        email: email,
      });

      router.push("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("@ControlPay:token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
