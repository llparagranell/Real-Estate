import express from "express";
import { closeSupportTicket, getSupportTickets } from "../../controllers/staff/supportTicket.staff.controller";
import { authMiddleware } from "../../middleware/auth";
import { requireSupportOrAbove } from "../../middleware/staff";

const router = express.Router();

router.get("/",authMiddleware, requireSupportOrAbove, getSupportTickets);
router.put("/:id", authMiddleware, requireSupportOrAbove, closeSupportTicket);

export default router;

