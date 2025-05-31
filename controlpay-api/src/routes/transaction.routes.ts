import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";

const transactionRoutes = Router();
const transactionController = new TransactionController();

transactionRoutes.get("/", transactionController.list);
transactionRoutes.get("/:id", transactionController.find);
transactionRoutes.post("/", transactionController.create);
transactionRoutes.put("/:id", transactionController.update);
transactionRoutes.delete("/:id", transactionController.delete);

export { transactionRoutes };
