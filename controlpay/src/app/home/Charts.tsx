"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { useTransactions } from "../../contexts/TransactionContext";

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgb(226, 232, 240)", // slate-200
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: "rgba(226, 232, 240, 0.1)", // slate-200 with opacity
      },
      ticks: {
        color: "rgb(226, 232, 240)", // slate-200
      },
    },
    x: {
      grid: {
        color: "rgba(226, 232, 240, 0.1)", // slate-200 with opacity
      },
      ticks: {
        color: "rgb(226, 232, 240)", // slate-200
      },
    },
  },
};

export default function Charts() {
  const { transactions } = useTransactions();

  // Preparar dados para o gráfico de categorias
  const categorias = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Outros",
  ];

  const gastosPorCategoria = categorias.map((categoria) => {
    return transactions
      .filter((t) => {
        const dataTransacao = new Date(t.data);
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        return (
          t.tipo === "despesa" &&
          t.categoria === categoria &&
          dataTransacao.getMonth() === mesAtual &&
          dataTransacao.getFullYear() === anoAtual
        );
      })
      .reduce((total, t) => {
        // Para transações parceladas, usar o valor da parcela
        const valor =
          t.frequencia === "parcelado"
            ? t.valorParcela || t.valor / (t.parcelas || 1)
            : t.valor;
        return total + valor;
      }, 0);
  });

  const categoryData = {
    labels: categorias,
    datasets: [
      {
        label: "Gastos por Categoria",
        data: gastosPorCategoria,
        backgroundColor: [
          "rgba(52, 211, 153, 0.8)", // emerald-400 (Alimentação)
          "rgba(59, 130, 246, 0.8)", // blue-500 (Transporte)
          "rgba(239, 68, 68, 0.8)", // red-500 (Moradia)
          "rgba(245, 158, 11, 0.8)", // amber-500 (Saúde)
          "rgba(168, 85, 247, 0.8)", // purple-500 (Educação)
          "rgba(75, 85, 99, 0.8)", // gray-600 (Lazer)
          "rgba(107, 114, 128, 0.8)", // gray-500 (Outros)
        ],
      },
    ],
  };

  // Preparar dados para o gráfico mensal
  const ultimosSeisMeses = Array.from({ length: 6 }, (_, i) => {
    const data = new Date();
    data.setMonth(data.getMonth() - i);
    return data;
  }).reverse();

  const gastosMensais = ultimosSeisMeses.map((data) => {
    return transactions
      .filter((t) => {
        const dataTransacao = new Date(t.data);
        return (
          t.tipo === "despesa" &&
          dataTransacao.getMonth() === data.getMonth() &&
          dataTransacao.getFullYear() === data.getFullYear()
        );
      })
      .reduce((total, t) => {
        // Para transações parceladas, usar o valor da parcela
        const valor =
          t.frequencia === "parcelado"
            ? t.valorParcela || t.valor / (t.parcelas || 1)
            : t.valor;
        return total + valor;
      }, 0);
  });

  const monthlyData = {
    labels: ultimosSeisMeses.map((data) =>
      data.toLocaleDateString("pt-BR", { month: "short" }),
    ),
    datasets: [
      {
        label: "Gastos Mensais",
        data: gastosMensais,
        borderColor: "rgb(52, 211, 153)", // emerald-400
        backgroundColor: "rgba(52, 211, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Obter faturas do mês atual
  const mesAtual = new Date().getMonth();
  const faturasMesAtual = transactions
    .filter((t) => {
      const dataTransacao = new Date(t.data);
      return (
        t.frequencia === "parcelado" &&
        dataTransacao.getMonth() === mesAtual &&
        dataTransacao.getFullYear() === new Date().getFullYear()
      );
    })
    .map((t) => ({
      descricao: t.descricao,
      valor: t.valorParcela || t.valor / (t.parcelas || 1),
      parcelaAtual: t.parcelaAtual || 1,
      parcelas: t.parcelas || 1,
    }))
    .sort((a, b) => b.valor - a.valor);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg bg-slate-700 p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Gastos por Categoria (Mês Atual)
        </h3>
        <div className="h-80">
          <Bar data={categoryData} options={options} />
        </div>
      </div>
      <div className="rounded-lg bg-slate-700 p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Evolução Mensal de Gastos
        </h3>
        <div className="h-80">
          <Line data={monthlyData} options={options} />
        </div>
      </div>
      <div className="col-span-full rounded-lg bg-slate-700 p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Faturas do Mês Atual
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faturasMesAtual.map((fatura, index) => (
            <div key={index} className="rounded-lg bg-slate-800 p-4">
              <h4 className="font-medium text-white">{fatura.descricao}</h4>
              <p className="mt-2 text-lg font-bold text-amber-400">
                {formatarValor(fatura.valor)}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Parcela {fatura.parcelaAtual} de {fatura.parcelas}
              </p>
            </div>
          ))}
          {faturasMesAtual.length === 0 && (
            <div className="col-span-full text-center py-4 text-slate-400">
              Nenhuma fatura para este mês
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
