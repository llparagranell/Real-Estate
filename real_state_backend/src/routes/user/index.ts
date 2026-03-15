import express from "express";
import authRoutes from "./user.auth";
import profileRoutes from "./user.profile"
import bannerRoutes from "./user.banner";
import exclusivePropertyRoutes from "./user.exclusive-property";
import notificationRoutes from "./user.notification";
import transactionRoutes from "./user.transactions";
import requirementRoutes from "./user.requirements";
const router = express.Router();

router.use('/auth',authRoutes);
router.use('/profile',profileRoutes);
router.use('/banners', bannerRoutes);
router.use('/exclusive-properties', exclusivePropertyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/transactions', transactionRoutes);
router.use('/requirements', requirementRoutes);
export default router;