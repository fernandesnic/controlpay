"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginResponse {
  error?: string;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (response.ok) {
        router.push("/home");
        router.refresh();
      } else {
        setError(data.error ?? "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800 p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-emerald-400">Control</span>
            <span className="text-emerald-600">Pay</span>
          </h2>
          <p className="mt-2 text-slate-400">
            Gerencie suas finanças com simplicidade
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/20"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-slate-200"
              >
                Lembrar-me
              </label>
            </div>
            <a
              href="#"
              className="text-sm text-emerald-500 hover:text-emerald-400"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-2 text-center text-sm text-slate-400">
            Não tem uma conta?{" "}
            <a
              href="#"
              className="font-medium text-emerald-500 hover:text-emerald-400"
            >
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
