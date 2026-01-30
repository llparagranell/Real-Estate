import express from "express";
import authRoutes from "./user.auth"
const router = express.Router();

router.use('/auth',authRoutes);

export default router;