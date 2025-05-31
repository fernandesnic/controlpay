import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  // Limpando o banco de dados
  await prisma.transaction.deleteMany();

  // Função para gerar data do mês atual
  const getDataAtual = (dia: number) => {
    const data = new Date();
    data.setDate(dia);
    return data.toISOString();
  };

  // Receitas Fixas
  const receitasFixas = [
    {
      id: randomUUID(),
      tipo: "receita",
      frequencia: "fixo",
      descricao: "Salário",
      valor: 5000,
      categoria: "Salário",
      data: getDataAtual(5),
    },
    {
      id: randomUUID(),
      tipo: "receita",
      frequencia: "fixo",
      descricao: "Aluguel Recebido",
      valor: 1200,
      categoria: "Investimentos",
      data: getDataAtual(10),
    },
  ];

  // Receitas Variáveis
  const receitasVariaveis = [
    {
      id: randomUUID(),
      tipo: "receita",
      frequencia: "variavel",
      descricao: "Freelance Design",
      valor: 2500,
      categoria: "Freelance",
      data: getDataAtual(15),
    },
    {
      id: randomUUID(),
      tipo: "receita",
      frequencia: "variavel",
      descricao: "Venda de Produtos Usados",
      valor: 500,
      categoria: "Vendas",
      data: getDataAtual(20),
    },
  ];

  // Despesas Fixas
  const despesasFixas = [
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "fixo",
      descricao: "Aluguel",
      valor: 1500,
      categoria: "Moradia",
      data: getDataAtual(5),
    },
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "fixo",
      descricao: "Internet",
      valor: 120,
      categoria: "Moradia",
      data: getDataAtual(10),
    },
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "fixo",
      descricao: "Academia",
      valor: 100,
      categoria: "Saúde",
      data: getDataAtual(15),
    },
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "fixo",
      descricao: "Plano de Saúde",
      valor: 350,
      categoria: "Saúde",
      data: getDataAtual(5),
    },
  ];

  // Despesas Variáveis
  const despesasVariaveis = [
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "variavel",
      descricao: "Supermercado",
      valor: 850,
      categoria: "Alimentação",
      data: getDataAtual(15),
    },
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "variavel",
      descricao: "Uber",
      valor: 150,
      categoria: "Transporte",
      data: getDataAtual(18),
    },
    {
      id: randomUUID(),
      tipo: "despesa",
      frequencia: "variavel",
      descricao: "Cinema",
      valor: 80,
      categoria: "Lazer",
      data: getDataAtual(20),
    },
  ];

  // Função para criar parcelas
  const criarParcelas = (transacao: any) => {
    const parcelas = [];
    for (let i = 0; i < transacao.parcelas; i++) {
      const data = new Date();
      data.setMonth(data.getMonth() + i);

      parcelas.push({
        id: randomUUID(),
        tipo: "despesa",
        frequencia: "parcelado",
        descricao: `${transacao.descricao} (${i + 1}/${transacao.parcelas})`,
        valor: transacao.valor,
        valorParcela: transacao.valorParcela,
        categoria: transacao.categoria,
        data: data.toISOString(),
        parcelas: transacao.parcelas,
        parcelaAtual: i + 1,
      });
    }
    return parcelas;
  };

  // Despesas Parceladas
  const despesasParceladasBase = [
    {
      descricao: "Notebook",
      valor: 4800,
      valorParcela: 400,
      categoria: "Outros",
      parcelas: 12,
    },
    {
      descricao: "Geladeira",
      valor: 3600,
      valorParcela: 300,
      categoria: "Moradia",
      parcelas: 12,
    },
  ];

  // Criar todas as parcelas
  const despesasParceladas = despesasParceladasBase.flatMap(criarParcelas);

  // Inserindo todas as transações em lote
  const todasTransacoes = [
    ...receitasFixas,
    ...receitasVariaveis,
    ...despesasFixas,
    ...despesasVariaveis,
    ...despesasParceladas,
  ];

  console.log("Iniciando inserção de dados...");
  console.log(
    `Total de transações a serem inseridas: ${todasTransacoes.length}`
  );

  // Inserir em lotes menores para evitar sobrecarga
  const tamanhoDoBatch = 10;
  for (let i = 0; i < todasTransacoes.length; i += tamanhoDoBatch) {
    const batch = todasTransacoes.slice(i, i + tamanhoDoBatch);
    await Promise.all(
      batch.map((transacao) =>
        prisma.transaction.create({
          data: transacao,
        })
      )
    );
    console.log(`Inserido lote ${i / tamanhoDoBatch + 1}`);
  }

  const total = await prisma.transaction.count();
  console.log(
    `Dados de exemplo inseridos com sucesso! Total: ${total} transações`
  );
}

main()
  .catch((e) => {
    console.error("Erro ao inserir dados:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
