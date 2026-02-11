import express from "express";
import { presignedUpload, directUpload } from "../../controllers/upload/upload.controller";
import { validate } from "../../middleware/validate";
import { uploadSchema } from "../../validators/upload.validator";
import { upload } from "../../config/multer";

const router = express.Router();

// Presigned URL endpoint (existing)
router.post("/presign", validate(uploadSchema), presignedUpload);

// Direct upload endpoint (new)
router.post("/", upload.single("file"), directUpload);

export default router;