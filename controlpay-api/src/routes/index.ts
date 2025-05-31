import { Router } from "express";
import { transactionRoutes } from "./transaction.routes";

const router = Router();

router.use("/transactions", transactionRoutes);

export { router };
