import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
    createRequirement,
    getMyRequirements,
    updateRequirement,
    deleteRequirement,
} from "../../controllers/user/requirement.controller";
import { createRequirementSchema, updateRequirementSchema } from "../../validators/requirement.validators";

const router = express.Router();

router.post("/", authMiddleware, validate(createRequirementSchema), createRequirement);
router.get("/", authMiddleware, getMyRequirements);
router.put("/:id", authMiddleware, validate(updateRequirementSchema), updateRequirement);
router.delete("/:id", authMiddleware, deleteRequirement);

export default router;
