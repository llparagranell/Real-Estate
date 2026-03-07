import express from "express";
const router = express.Router();
import staffManagementRoutes from "./staff.management";
import staffAuthRoutes from "./staff.auth";
import staffGemsRoutes from "./gems.routes";
import staffPropertyRoutes from "./property.routes";
import userRoutes from "./user.routes";

router.use('/auth', staffAuthRoutes);
router.use('/management', staffManagementRoutes);
router.use('/gems', staffGemsRoutes);
router.use('/properties', staffPropertyRoutes);
router.use('/users', userRoutes);

export default router;