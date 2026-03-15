import express from "express";
import { getUserTransactionHistory } from "../../controllers/user/transaction.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getUserTransactionHistory);

export default router;