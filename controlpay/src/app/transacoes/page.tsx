"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTransactions } from "@/contexts/TransactionContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type TransactionType = "receita" | "despesa";
type TransactionFrequency = "fixo" | "variavel" | "parcelado";

interface Transaction {
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

interface FormData {
  tipo: "receita" | "despesa";
  frequencia: TransactionFrequency;
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
  parcelas?: string;
}

const categoriasDespesas = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Outros",
];

const categoriasReceitas = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Vendas",
  "Outros",
];

// Dados simulados
const transacoesSimuladas: Transaction[] = [
  {
    id: "1",
    tipo: "despesa",
    frequencia: "fixo",
    descricao: "Aluguel",
    valor: 1500,
    categoria: "Moradia",
    data: "2024-02-05",
  },
  {
    id: "2",
    tipo: "despesa",
    frequencia: "fixo",
    descricao: "Internet",
    valor: 100,
    categoria: "Moradia",
    data: "2024-02-10",
  },
  {
    id: "3",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Supermercado",
    valor: 350,
    categoria: "Alimentação",
    data: "2024-02-15",
  },
  {
    id: "4",
    tipo: "receita",
    frequencia: "fixo",
    descricao: "Salário",
    valor: 5000,
    categoria: "Salário",
    data: "2024-02-05",
  },
];

export default function TransacoesPage() {
  const {
    transactions,
    addTransaction,
    addTransactions,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<
    "receitas" | "despesas" | "parceladas"
  >("despesas");
  const [formData, setFormData] = useState<FormData>({
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "",
    valor: "",
    categoria: "",
    data: new Date().toISOString().slice(0, 10),
    parcelas: "1",
  });

  // Removendo o useEffect problemático que estava causando o loop
  // e substituindo por uma função que será chamada apenas quando necessário
  const limparTransacoesAntigas = useCallback(() => {
    const hoje = new Date();
    return transactions.filter((transaction) => {
      if (transaction.frequencia === "variavel") {
        const dataTransacao = new Date(transaction.data);
        const diffDias = Math.floor(
          (hoje.getTime() - dataTransacao.getTime()) / (1000 * 60 * 60 * 24),
        );
        return diffDias <= 30;
      }
      return true;
    });
  }, []);

  // Efeito simplificado apenas para carregar dados iniciais
  useEffect(() => {
    const transacoesAtuais = limparTransacoesAntigas();
    if (transacoesAtuais.length < transactions.length) {
      addTransactions(transacoesAtuais);
    }
  }, []); // Executado apenas uma vez na montagem do componente

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "valor") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = (Number(numericValue) / 100).toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      );
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "tipo") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        categoria:
          value === "despesa" ? categoriasDespesas[0] : categoriasReceitas[0],
      }));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      tipo: transaction.tipo,
      frequencia: transaction.frequencia,
      descricao: transaction.descricao.split(" (")[0],
      valor: transaction.valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      categoria: transaction.categoria,
      data: transaction.data,
      parcelas: transaction.parcelas?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction(transactionId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valor = parseFloat(
      formData.valor.replace(/[^\d,]/g, "").replace(",", "."),
    );
    const parcelas = parseInt(formData.parcelas || "1");

    const novaTransacao: Transaction = {
      id: editingTransaction?.id || crypto.randomUUID(),
      tipo: formData.tipo,
      frequencia: formData.frequencia,
      descricao: formData.descricao,
      valor: valor,
      categoria: formData.categoria,
      data: formData.data,
    };

    try {
      if (formData.frequencia === "parcelado" && !editingTransaction) {
        novaTransacao.parcelas = parcelas;
        novaTransacao.parcelaAtual = 1;
        novaTransacao.valorParcela = valor / parcelas;

        const todasParcelas: Transaction[] = Array.from(
          { length: parcelas },
          (_, i) => {
            const dataTransacao = new Date(formData.data);
            dataTransacao.setMonth(dataTransacao.getMonth() + i);

            return {
              ...novaTransacao,
              id: crypto.randomUUID(),
              parcelaAtual: i + 1,
              data: dataTransacao.toISOString().slice(0, 10),
              descricao: `${formData.descricao} (${i + 1}/${parcelas})`,
            };
          },
        );

        await addTransactions(todasParcelas);
      } else {
        await addTransactions([novaTransacao]);
      }

      setIsModalOpen(false);
      setEditingTransaction(null);
      setFormData({
        tipo: "despesa",
        frequencia: "variavel",
        descricao: "",
        valor: "",
        categoria: "Outros",
        data: new Date().toISOString().slice(0, 10),
        parcelas: "1",
      });
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const TransactionCard = ({
    transaction,
  }: {
    transaction: Transaction & { id: string };
  }) => {
    const agruparParcelas = (t: Transaction) => {
      if (t.frequencia !== "parcelado") return null;

      const descricaoBase = t.descricao.split(" (")[0];
      const todasParcelas = transactions.filter(
        (p) =>
          p.frequencia === "parcelado" &&
          p.descricao.split(" (")[0] === descricaoBase,
      );

      const parcelaPaga = todasParcelas.filter(
        (p) => new Date(p.data) <= new Date(),
      ).length;

      const totalParcelas = todasParcelas.length;
      const valorParcela = Number(t.valorParcela) || t.valor / totalParcelas;
      const valorTotal = t.valor;

      return {
        parcelaPaga,
        totalParcelas,
        valorParcela,
        valorTotal,
      };
    };

    const parcelasInfo =
      transaction.frequencia === "parcelado"
        ? agruparParcelas(transaction)
        : null;
    const descricaoBase = transaction.descricao.split(" (")[0];

    const valorExibicao = parcelasInfo
      ? parcelasInfo.valorParcela
      : Number(transaction.valor);

    return (
      <div className="rounded-lg bg-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">{descricaoBase}</h3>
            <div className="mt-1 flex items-center space-x-2 text-sm">
              <span className="rounded-full bg-slate-600 px-2 py-0.5 text-xs text-white">
                {transaction.categoria}
              </span>
              <span className="text-slate-400">
                {formatarData(transaction.data)}
              </span>
              <span className="text-slate-400">
                {transaction.frequencia === "fixo"
                  ? "Fixo"
                  : transaction.frequencia === "variavel"
                    ? "Variável"
                    : parcelasInfo
                      ? `${parcelasInfo.parcelaPaga}/${parcelasInfo.totalParcelas} parcelas pagas`
                      : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-lg font-medium ${
                transaction.tipo === "receita"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {transaction.tipo === "receita" ? "+" : "-"}
              {formatarValor(valorExibicao)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(transaction)}
                className="rounded p-1 text-slate-400 hover:bg-slate-600 hover:text-white"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(transaction.id)}
                className="rounded p-1 text-slate-400 hover:bg-slate-600 hover:text-red-400"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
        {parcelasInfo && (
          <div className="mt-2 text-sm text-slate-400">
            <span>
              Valor total: {formatarValor(parcelasInfo.valorTotal)} em{" "}
              {parcelasInfo.totalParcelas}x de{" "}
              {formatarValor(parcelasInfo.valorParcela)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const TransactionSection = ({
    title,
    transactions,
  }: {
    title: string;
    transactions: Transaction[];
  }) => {
    const filteredTransactions = transactions.filter((t) => {
      if (t.frequencia !== "parcelado") return true;

      const descricaoBase = t.descricao.split(" (")[0];
      const todasParcelas = transactions.filter(
        (p) => p.descricao.split(" (")[0] === descricaoBase,
      );
      return t.id === todasParcelas[0].id;
    });

    return (
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          {filteredTransactions.length === 0 && (
            <p className="text-slate-400">Nenhuma transação encontrada</p>
          )}
        </div>
      </div>
    );
  };

  const filteredTransactions = {
    receitas: transactions.filter(
      (t) => t.tipo === "receita" && t.frequencia !== "parcelado",
    ),
    despesas: transactions.filter(
      (t) => t.tipo === "despesa" && t.frequencia !== "parcelado",
    ),
    parceladas: transactions.filter((t) => t.frequencia === "parcelado"),
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/home"
              className="flex items-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              <span className="mr-2">←</span>
              Voltar
            </Link>
            <h1 className="text-2xl font-bold text-white">Transações</h1>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setFormData({
                tipo: activeTab === "receitas" ? "receita" : "despesa",
                frequencia:
                  activeTab === "parceladas" ? "parcelado" : "variavel",
                descricao: "",
                valor: "",
                categoria: "",
                data: new Date().toISOString().slice(0, 10),
                parcelas: "1",
              });
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Nova Transação
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab("despesas")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === "despesas"
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => setActiveTab("receitas")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === "receitas"
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setActiveTab("parceladas")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === "parceladas"
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Compras Parceladas
          </button>
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-slate-800 p-6">
          {activeTab === "despesas" && (
            <>
              <TransactionSection
                title="Despesas Fixas"
                transactions={filteredTransactions.despesas.filter(
                  (t) => t.frequencia === "fixo",
                )}
              />
              <TransactionSection
                title="Despesas Variáveis"
                transactions={filteredTransactions.despesas.filter(
                  (t) => t.frequencia === "variavel",
                )}
              />
            </>
          )}
          {activeTab === "receitas" && (
            <>
              <TransactionSection
                title="Receitas Fixas"
                transactions={filteredTransactions.receitas.filter(
                  (t) => t.frequencia === "fixo",
                )}
              />
              <TransactionSection
                title="Receitas Variáveis"
                transactions={filteredTransactions.receitas.filter(
                  (t) => t.frequencia === "variavel",
                )}
              />
            </>
          )}
          {activeTab === "parceladas" && (
            <TransactionSection
              title="Compras Parceladas"
              transactions={filteredTransactions.parceladas}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-slate-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingTransaction ? "Editar Transação" : "Nova Transação"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTransaction(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200">
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  >
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200">
                    Frequência
                  </label>
                  <select
                    name="frequencia"
                    value={formData.frequencia}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  >
                    <option value="variavel">Variável</option>
                    <option value="fixo">Fixo</option>
                    <option value="parcelado">Parcelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Descrição
                </label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Valor
                </label>
                <input
                  type="text"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  {formData.tipo === "despesa"
                    ? categoriasDespesas.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    : categoriasReceitas.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  required
                />
              </div>

              {formData.frequencia === "parcelado" && (
                <div>
                  <label className="block text-sm font-medium text-slate-200">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    name="parcelas"
                    value={formData.parcelas}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                    min="2"
                    required={formData.frequencia === "parcelado"}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                  }}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  {editingTransaction ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
