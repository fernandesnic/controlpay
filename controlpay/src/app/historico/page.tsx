"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiFilter, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { useTransactions } from "../../contexts/TransactionContext";

type TransactionType = "receita" | "despesa" | "todas";
type TransactionFrequency = "fixo" | "variavel" | "parcelado" | "todas";

interface Transaction {
  id: string;
  tipo: "receita" | "despesa";
  frequencia: "fixo" | "variavel" | "parcelado";
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  parcelas?: number;
  parcelaAtual?: number;
  valorParcela?: number;
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

// Dados simulados (exemplos para cada categoria)
const transacoesSimuladas: Transaction[] = [
  // Despesas Fixas
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
    valor: 120,
    categoria: "Moradia",
    data: "2024-02-10",
  },
  {
    id: "3",
    tipo: "despesa",
    frequencia: "fixo",
    descricao: "Academia",
    valor: 100,
    categoria: "Saúde",
    data: "2024-02-15",
  },
  {
    id: "4",
    tipo: "despesa",
    frequencia: "fixo",
    descricao: "Plano de Saúde",
    valor: 350,
    categoria: "Saúde",
    data: "2024-02-05",
  },
  {
    id: "5",
    tipo: "despesa",
    frequencia: "fixo",
    descricao: "Curso de Inglês",
    valor: 250,
    categoria: "Educação",
    data: "2024-02-10",
  },

  // Despesas Variáveis
  {
    id: "6",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Supermercado",
    valor: 850,
    categoria: "Alimentação",
    data: "2024-02-15",
  },
  {
    id: "7",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Uber",
    valor: 150,
    categoria: "Transporte",
    data: "2024-02-18",
  },
  {
    id: "8",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Cinema",
    valor: 80,
    categoria: "Lazer",
    data: "2024-02-20",
  },
  {
    id: "9",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Farmácia",
    valor: 120,
    categoria: "Saúde",
    data: "2024-02-22",
  },
  {
    id: "10",
    tipo: "despesa",
    frequencia: "variavel",
    descricao: "Livros",
    valor: 150,
    categoria: "Educação",
    data: "2024-02-25",
  },

  // Despesas Parceladas
  {
    id: "11",
    tipo: "despesa",
    frequencia: "parcelado",
    descricao: "Notebook",
    valor: 4800,
    valorParcela: 400,
    categoria: "Outros",
    data: "2024-02-05",
    parcelas: 12,
    parcelaAtual: 1,
  },
  {
    id: "12",
    tipo: "despesa",
    frequencia: "parcelado",
    descricao: "Geladeira",
    valor: 3600,
    valorParcela: 300,
    categoria: "Moradia",
    data: "2024-02-10",
    parcelas: 12,
    parcelaAtual: 1,
  },

  // Receitas Fixas
  {
    id: "13",
    tipo: "receita",
    frequencia: "fixo",
    descricao: "Salário",
    valor: 5000,
    categoria: "Salário",
    data: "2024-02-05",
  },
  {
    id: "14",
    tipo: "receita",
    frequencia: "fixo",
    descricao: "Aluguel de Imóvel",
    valor: 1200,
    categoria: "Investimentos",
    data: "2024-02-10",
  },

  // Receitas Variáveis
  {
    id: "15",
    tipo: "receita",
    frequencia: "variavel",
    descricao: "Projeto Freelance",
    valor: 2500,
    categoria: "Freelance",
    data: "2024-02-15",
  },
  {
    id: "16",
    tipo: "receita",
    frequencia: "variavel",
    descricao: "Venda de Produtos Usados",
    valor: 500,
    categoria: "Vendas",
    data: "2024-02-20",
  },
  {
    id: "17",
    tipo: "receita",
    frequencia: "variavel",
    descricao: "Dividendos",
    valor: 300,
    categoria: "Investimentos",
    data: "2024-02-25",
  },
];

export default function HistoricoPage() {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState({
    tipo: "todas" as TransactionType,
    frequencia: "todas" as TransactionFrequency,
    categoria: "todas",
    dataInicio: "",
    dataFim: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const filtrarTransacoes = () => {
    const hoje = new Date();

    return transactions.filter((transaction) => {
      const dataTransacao = new Date(transaction.data || "");

      // Para transações parceladas, mostrar apenas as que já venceram
      if (transaction.frequencia === "parcelado" && dataTransacao > hoje) {
        return false;
      }

      // Filtro de pesquisa
      if (
        searchTerm &&
        !transaction.descricao
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !transaction.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtro de tipo
      if (filtros.tipo !== "todas" && transaction.tipo !== filtros.tipo) {
        return false;
      }

      // Filtro de frequência
      if (
        filtros.frequencia !== "todas" &&
        transaction.frequencia !== filtros.frequencia
      ) {
        return false;
      }

      // Filtro de categoria
      if (
        filtros.categoria !== "todas" &&
        transaction.categoria !== filtros.categoria
      ) {
        return false;
      }

      // Filtro de data
      if (filtros.dataInicio && dataTransacao < new Date(filtros.dataInicio)) {
        return false;
      }
      if (filtros.dataFim && dataTransacao > new Date(filtros.dataFim)) {
        return false;
      }

      return true;
    });
  };

  const transacoesFiltradas = filtrarTransacoes();

  // Agrupar transações parceladas
  const agruparTransacoes = (transacoes: Transaction[]) => {
    const grupos = new Map<string, Transaction[]>();

    transacoes.forEach((t) => {
      if (t.frequencia === "parcelado") {
        const descricaoBase = t.descricao.split(" (")[0];
        if (!grupos.has(descricaoBase)) {
          grupos.set(descricaoBase, []);
        }
        grupos.get(descricaoBase)?.push(t);
      }
    });

    return transacoes.map((t) => {
      if (t.frequencia === "parcelado") {
        const descricaoBase = t.descricao.split(" (")[0];
        const grupo = grupos.get(descricaoBase) || [];
        const parcelaPaga = Number(
          t.descricao.match(/\((\d+)\/\d+\)/)?.[1] || 1,
        );
        const totalParcelas = grupo.length;

        return {
          ...t,
          descricao: `${descricaoBase} (Parcela ${parcelaPaga} de ${totalParcelas})`,
        };
      }
      return t;
    });
  };

  const transacoesProcessadas = agruparTransacoes(transacoesFiltradas);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/home"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 flex items-center"
            >
              <span className="mr-2">
                <FiArrowLeft size={16} color="white" />
              </span>
              Voltar
            </Link>
            <h1 className="text-2xl font-bold text-white">Histórico</h1>
          </div>
        </div>
      </header>

      {/* Barra de Pesquisa e Filtros */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <FiSearch size={16} color="#94a3b8" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-slate-700 pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
          >
            <span className="mr-2">
              <FiFilter size={16} color="white" />
            </span>
            Filtros
          </button>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <div className="mt-4 rounded-lg bg-slate-800 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Tipo
                </label>
                <select
                  value={filtros.tipo}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      tipo: e.target.value as TransactionType,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="todas">Todas</option>
                  <option value="receita">Receitas</option>
                  <option value="despesa">Despesas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Frequência
                </label>
                <select
                  value={filtros.frequencia}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      frequencia: e.target.value as TransactionFrequency,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="todas">Todas</option>
                  <option value="fixo">Fixas</option>
                  <option value="variavel">Variáveis</option>
                  <option value="parcelado">Parceladas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Categoria
                </label>
                <select
                  value={filtros.categoria}
                  onChange={(e) =>
                    setFiltros({ ...filtros, categoria: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                >
                  <option value="todas">Todas</option>
                  {[...categoriasDespesas, ...categoriasReceitas].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Data Início
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FiCalendar size={16} color="#94a3b8" />
                  </span>
                  <input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataInicio: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 pl-10 pr-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Data Fim
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FiCalendar size={16} color="#94a3b8" />
                  </span>
                  <input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataFim: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 pl-10 pr-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFiltros({
                      tipo: "todas",
                      frequencia: "todas",
                      categoria: "todas",
                      dataInicio: "",
                      dataFim: "",
                    })
                  }
                  className="w-full rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Transações */}
      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="rounded-lg bg-slate-800 p-4">
          <div className="mb-4 flex justify-between text-sm text-slate-400">
            <span>Total de transações: {transacoesProcessadas.length}</span>
          </div>

          <div className="space-y-4">
            {transacoesProcessadas.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg bg-slate-700 p-4 transition-all hover:bg-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      {transaction.descricao}
                    </h3>
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
                            : "Parcelado"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.tipo === "receita"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatarValor(
                        transaction.valorParcela || transaction.valor,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {transacoesProcessadas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
