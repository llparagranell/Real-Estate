import express from "express";
import { getAllUsers } from "../../controllers/staff/user.staff.controller";
import { authMiddleware } from "../../middleware/auth";
import { requireAdminOrSuperAdmin } from "../../middleware/staff";
const router = express.Router();

router.get("/", authMiddleware, requireAdminOrSuperAdmin, getAllUsers);

export default router;