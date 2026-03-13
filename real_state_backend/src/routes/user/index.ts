import express from "express";
import authRoutes from "./user.auth";
import profileRoutes from "./user.profile"
import bannerRoutes from "./user.banner";
import exclusivePropertyRoutes from "./user.exclusive-property";
const router = express.Router();

router.use('/auth',authRoutes);
router.use('/profile',profileRoutes);
router.use('/banners', bannerRoutes);
router.use('/exclusive-properties', exclusivePropertyRoutes);
export default router;