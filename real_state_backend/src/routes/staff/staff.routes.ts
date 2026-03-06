import express from "express";
const router = express.Router();
import staffManagementRoutes from "./staff.management";
import staffAuthRoutes from "./staff.auth";
import staffGemsRoutes from "./gems.routes";
router.use('/auth', staffAuthRoutes);
router.use('/management', staffManagementRoutes);
router.use('/gems', staffGemsRoutes);

export default router;