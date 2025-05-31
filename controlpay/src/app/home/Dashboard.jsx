"use client";

import Charts from "./Charts";
import { useTransactions } from "../../contexts/TransactionContext";

export default function Dashboard() {
  const {
    calculateTotalBalance,
    calculateMonthlyIncome,
    calculateMonthlyExpenses,
    transactions,
  } = useTransactions();

  const formatarValor = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular total de faturas do mês atual
  const calcularFaturasMes = () => {
    const mesAtual = new Date().getMonth();
    return transactions
      .filter(
        (t) =>
          t.frequencia === "parcelado" &&
          new Date(t.data).getMonth() === mesAtual,
      )
      .reduce((total, t) => total + (t.valorParcela || t.valor), 0);
  };

  const totalFaturasMes = calcularFaturasMes();
  const despesasTotaisMes = calculateMonthlyExpenses() + totalFaturasMes;

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-700 p-6">
          <h3 className="text-lg font-medium text-white">Saldo Total</h3>
          <p className="text-2xl font-bold text-emerald-400">
            {formatarValor(calculateTotalBalance())}
          </p>
        </div>
        <div className="rounded-lg bg-slate-700 p-6">
          <h3 className="text-lg font-medium text-white">Receitas do Mês</h3>
          <p className="text-2xl font-bold text-green-400">
            {formatarValor(calculateMonthlyIncome())}
          </p>
        </div>
        <div className="rounded-lg bg-slate-700 p-6">
          <h3 className="text-lg font-medium text-white">Despesas do Mês</h3>
          <p className="text-2xl font-bold text-red-400">
            {formatarValor(despesasTotaisMes)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Inclui {formatarValor(totalFaturasMes)} em faturas
          </p>
        </div>
      </div>
      <Charts />
    </>
  );
}
