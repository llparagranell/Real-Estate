import express from "express";
import { getActiveBanners } from "../../controllers/user/banner.controller";

const router = express.Router();

router.get("/", getActiveBanners);

export default router;