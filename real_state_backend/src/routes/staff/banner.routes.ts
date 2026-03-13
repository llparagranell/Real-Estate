import express from "express";
import { createBanner, getAllBanners, deleteBanner, updateBannerStatus } from "../../controllers/staff/banner.staff.controller";
import { authMiddleware } from "../../middleware/auth";
import { requireAdminOrSuperAdmin } from "../../middleware/staff";
const router = express.Router();

router.post('/',authMiddleware, requireAdminOrSuperAdmin, createBanner);
router.get('/',authMiddleware, requireAdminOrSuperAdmin, getAllBanners);
router.put('/:id/status', authMiddleware, requireAdminOrSuperAdmin, updateBannerStatus);
router.delete('/:id',authMiddleware, requireAdminOrSuperAdmin, deleteBanner);
export default router;