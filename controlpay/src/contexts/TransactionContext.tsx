"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

export type TransactionType = "receita" | "despesa";
export type TransactionFrequency = "fixo" | "variavel" | "parcelado";

export interface Transaction {
  id: string;
  tipo: TransactionType;
  frequencia: TransactionFrequency;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  parcelas?: number;
  parcelaAtual?: number;
  valorParcela?: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  addTransactions: (transactions: Transaction[]) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  calculateTotalBalance: () => number;
  calculateMonthlyIncome: () => number;
  calculateMonthlyExpenses: () => number;
  calculatePendingInstallments: () => { total: number; count: number };
  isLoading: boolean;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: async () => {},
  addTransactions: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  calculateTotalBalance: () => 0,
  calculateMonthlyIncome: () => 0,
  calculateMonthlyExpenses: () => 0,
  calculatePendingInstallments: () => ({ total: 0, count: 0 }),
  isLoading: false,
});

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar transações ao iniciar
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      console.log("Iniciando carregamento de transações...");
      setIsLoading(true);
      const response = await api.get<Transaction[]>("/transactions");
      console.log("Transações carregadas:", response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      console.log("Adicionando nova transação:", transaction);
      setIsLoading(true);
      const response = await api.post<Transaction>(
        "/transactions",
        transaction,
      );
      console.log("Transação adicionada:", response.data);
      setTransactions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addTransactions = async (newTransactions: Transaction[]) => {
    try {
      setIsLoading(true);
      // Evita duplicação verificando se a transação já existe
      const transacoesUnicas = newTransactions.filter(
        (newTrans) => !transactions.some((t) => t.id === newTrans.id),
      );

      if (transacoesUnicas.length > 0) {
        await Promise.all(
          transacoesUnicas.map((transaction) =>
            api.post<Transaction>("/transactions", transaction),
          ),
        );
        await loadTransactions(); // Recarrega todas as transações
      }
    } catch (error) {
      console.error("Erro ao adicionar transações:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      setIsLoading(true);
      await api.put(`/transactions/${transaction.id}`, transaction);
      // Atualiza localmente sem recarregar tudo
      setTransactions((prev) =>
        prev.map((t) => (t.id === transaction.id ? transaction : t)),
      );
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/transactions/${transactionId}`);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalBalance = () => {
    const hoje = new Date();
    return transactions.reduce((total, transaction) => {
      const dataTransacao = new Date(transaction.data);
      if (dataTransacao > hoje) {
        return total;
      }

      const valor = transaction.valorParcela || transaction.valor;
      return total + (transaction.tipo === "receita" ? valor : -valor);
    }, 0);
  };

  const calculateMonthlyIncome = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transactions
      .filter((t) => {
        const dataTransacao = new Date(t.data);
        return (
          t.tipo === "receita" &&
          dataTransacao.getMonth() === mesAtual &&
          dataTransacao.getFullYear() === anoAtual
        );
      })
      .reduce((total, t) => total + (t.valorParcela || t.valor), 0);
  };

  const calculateMonthlyExpenses = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transactions
      .filter((t) => {
        const dataTransacao = new Date(t.data);
        return (
          t.tipo === "despesa" &&
          dataTransacao.getMonth() === mesAtual &&
          dataTransacao.getFullYear() === anoAtual
        );
      })
      .reduce((total, t) => total + (t.valorParcela || t.valor), 0);
  };

  const calculatePendingInstallments = () => {
    const hoje = new Date();
    const parceladas = transactions.filter((t) => {
      if (t.frequencia !== "parcelado") return false;
      const dataTransacao = new Date(t.data);
      return dataTransacao > hoje;
    });

    const total = parceladas.reduce(
      (sum, t) => sum + (t.valorParcela || t.valor),
      0,
    );
    const count = parceladas.length;
    return { total, count };
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        addTransactions,
        updateTransaction,
        deleteTransaction,
        calculateTotalBalance,
        calculateMonthlyIncome,
        calculateMonthlyExpenses,
        calculatePendingInstallments,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }
  return context;
}
