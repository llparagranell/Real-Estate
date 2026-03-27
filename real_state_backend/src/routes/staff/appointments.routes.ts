import express from "express";
import { getAllAppointments, acceptAppointment, rejectAppointment, completeAppointment } from "../../controllers/staff/appointments.staff.controller";
import { authMiddleware } from "../../middleware/auth";
import { requireAdminOrSuperAdmin } from "../../middleware/staff";

const router = express.Router();

router.get("/", authMiddleware, requireAdminOrSuperAdmin, getAllAppointments);
router.put("/:id/accept", authMiddleware, requireAdminOrSuperAdmin, acceptAppointment);
router.put("/:id/complete", authMiddleware, requireAdminOrSuperAdmin, completeAppointment);
router.put("/:id/reject", authMiddleware, requireAdminOrSuperAdmin, rejectAppointment);

export default router;
