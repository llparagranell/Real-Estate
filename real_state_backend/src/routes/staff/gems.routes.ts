import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { allGemTransactionHistory, gemRequests, giveAcquisitionRewardToUser, previewGemAllocation, sendGemOtp } from "../../controllers/staff/gems.staff";
import { approveGemRequest, rejectGemRequest } from "../../controllers/staff/gems.staff";
import { requireSuperAdmin,requireAdminOrSuperAdmin } from "../../middleware/staff";
const router = express.Router();

router.post("/preview", authMiddleware, requireAdminOrSuperAdmin, previewGemAllocation);
router.post("/send-otp", authMiddleware, requireAdminOrSuperAdmin, sendGemOtp);
router.post("/give", authMiddleware, requireAdminOrSuperAdmin, giveAcquisitionRewardToUser);
router.get("/gem-requests", authMiddleware, requireAdminOrSuperAdmin, gemRequests);
router.get("/transactions", authMiddleware, requireAdminOrSuperAdmin, allGemTransactionHistory);
router.post("/approve", authMiddleware, requireSuperAdmin, approveGemRequest);
router.post("/reject", authMiddleware, requireSuperAdmin, rejectGemRequest);
// router.post("/allot", authMiddleware, requireSuperAdmin, allotGemsToProperty);


export default router;