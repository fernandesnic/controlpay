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

      const transaction = await prisma.transaction.create({
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

      return res.status(201).json(transaction);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return res.status(500).json({ error: "Erro ao criar transação" });
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

      console.log("Dados recebidos para atualização:", {
        id,
        tipo,
        frequencia,
        descricao,
        valor,
        categoria,
        data,
        parcelas,
        parcelaAtual,
        valorParcela,
      });

      // Validações
      if (!id) {
        return res.status(400).json({ error: "ID não fornecido" });
      }

      // Verifica se a transação existe
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

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

      console.log("Transação atualizada:", transaction);
      return res.json(transaction);
    } catch (error) {
      console.error("Erro detalhado ao atualizar transação:", error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }
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
