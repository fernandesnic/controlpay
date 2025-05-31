import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const MAX_VALOR = 999999999.99; // Valor máximo permitido
const MAX_DESCRICAO_LENGTH = 100; // Tamanho máximo da descrição

export class TransactionController {
  async list(req: Request, res: Response) {
    try {
      const transactions = await prisma.transaction.findMany();
      return res.json(transactions);
    } catch (error) {
      console.error("Erro ao listar transações:", error);
      return res.status(500).json({ error: "Erro ao listar transações" });
    }
  }

  async find(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      return res.json(transaction);
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      return res.status(500).json({ error: "Erro ao buscar transação" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log("Dados recebidos:", req.body);

      const {
        tipo,
        frequencia,
        descricao,
        valor,
        categoria,
        data,
        parcelas,
        parcelaAtual,
        valorParcela,
      } = req.body;

      // Validação dos campos obrigatórios
      if (!tipo || !frequencia || !descricao || !valor || !categoria || !data) {
        return res.status(400).json({
          error: "Campos obrigatórios faltando",
          required: [
            "tipo",
            "frequencia",
            "descricao",
            "valor",
            "categoria",
            "data",
          ],
          received: req.body,
        });
      }

      // Validação do tipo
      if (!["receita", "despesa"].includes(tipo)) {
        return res.status(400).json({
          error: "Tipo inválido",
          message: "O tipo deve ser 'receita' ou 'despesa'",
        });
      }

      // Validação da frequência
      if (!["fixo", "variavel", "parcelado"].includes(frequencia)) {
        return res.status(400).json({
          error: "Frequência inválida",
          message: "A frequência deve ser 'fixo', 'variavel' ou 'parcelado'",
        });
      }

      // Validação do valor
      const valorNumerico = Number(valor);
      if (
        isNaN(valorNumerico) ||
        valorNumerico <= 0 ||
        valorNumerico > MAX_VALOR
      ) {
        return res.status(400).json({
          error: "Valor inválido",
          message: `O valor deve ser um número positivo e menor que ${MAX_VALOR}`,
        });
      }

      // Validação da descrição
      if (descricao.length > MAX_DESCRICAO_LENGTH) {
        return res.status(400).json({
          error: "Descrição muito longa",
          message: `A descrição deve ter no máximo ${MAX_DESCRICAO_LENGTH} caracteres`,
        });
      }

      // Validação da data
      const parsedData = new Date(data);
      if (isNaN(parsedData.getTime())) {
        return res.status(400).json({
          error: "Data inválida",
          message: "A data deve estar em um formato válido (YYYY-MM-DD)",
        });
      }

      // Validações específicas para transações parceladas
      if (frequencia === "parcelado") {
        if (!parcelas || !parcelaAtual || !valorParcela) {
          return res.status(400).json({
            error: "Campos de parcelamento faltando",
            message:
              "Para transações parceladas, informe parcelas, parcelaAtual e valorParcela",
          });
        }

        if (
          Number(parcelas) <= 0 ||
          Number(parcelaAtual) <= 0 ||
          Number(valorParcela) <= 0
        ) {
          return res.status(400).json({
            error: "Valores de parcelamento inválidos",
            message:
              "Parcelas, parcelaAtual e valorParcela devem ser números positivos",
          });
        }

        if (Number(parcelaAtual) > Number(parcelas)) {
          return res.status(400).json({
            error: "Parcela atual inválida",
            message:
              "A parcela atual não pode ser maior que o total de parcelas",
          });
        }
      }

      const transaction = await prisma.transaction.create({
        data: {
          tipo,
          frequencia,
          descricao,
          valor: valorNumerico,
          categoria,
          data: parsedData,
          parcelas: parcelas ? Number(parcelas) : null,
          parcelaAtual: parcelaAtual ? Number(parcelaAtual) : null,
          valorParcela: valorParcela ? Number(valorParcela) : null,
        },
      });

      console.log("Transação criada:", transaction);
      return res.status(201).json(transaction);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return res.status(500).json({
        error: "Erro ao criar transação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        tipo,
        frequencia,
        descricao,
        valor,
        categoria,
        data,
        parcelas,
        parcelaAtual,
        valorParcela,
      } = req.body;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          tipo,
          frequencia,
          descricao,
          valor: Number(valor),
          categoria,
          data: new Date(data),
          parcelas: parcelas ? Number(parcelas) : null,
          parcelaAtual: parcelaAtual ? Number(parcelaAtual) : null,
          valorParcela: valorParcela ? Number(valorParcela) : null,
        },
      });

      return res.json(transaction);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      return res.status(500).json({ error: "Erro ao atualizar transação" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.transaction.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      return res.status(500).json({ error: "Erro ao deletar transação" });
    }
  }
}
