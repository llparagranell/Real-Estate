import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { gemRequests } from "../../controllers/staff/staff.gems.controller";
const router = express.Router();

router.post()
router.get('/gem-requests', authMiddleware, gemRequests);


export default router;