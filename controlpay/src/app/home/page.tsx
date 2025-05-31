"use client";

import { useRouter } from "next/navigation";
import Dashboard from "./Dashboard";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">
            <span className="text-emerald-400">Control</span>
            <span className="text-emerald-600">Pay</span>
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/historico")}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              Histórico
            </button>
            <button
              onClick={() => router.push("/transacoes")}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              Nova Transação
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Bem-vindo ao ControlPay!
          </h2>
          <p className="text-slate-400">
            Gerencie suas finanças de forma simples e eficiente.
          </p>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
