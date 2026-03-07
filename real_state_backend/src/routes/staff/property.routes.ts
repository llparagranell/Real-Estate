import express from "express";
import { addBookMark, removeBookMark, getBookMarks } from "../../controllers/staff/properties.staff";
import { authMiddleware } from "../../middleware/auth";
import { requireSupportOrAbove } from "../../middleware/staff";
const router = express.Router();

router.post("/bookmark", authMiddleware, requireSupportOrAbove, addBookMark);
router.delete("/bookmark", authMiddleware, requireSupportOrAbove, removeBookMark);
router.get("/bookmarks", authMiddleware, requireSupportOrAbove, getBookMarks);

export default router;