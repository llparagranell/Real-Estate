import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { addProperty, getAllProperties, getMyProperties, getProperty } from "../../controllers/properties/property.controller";
import { validate } from "../../middleware/validate";
import { addPropertySchema } from "../../validators/property.validators";

const router = express.Router();

router.post("/",authMiddleware,validate(addPropertySchema), addProperty);
router.get("/",authMiddleware, getAllProperties);
router.get("/my-properties",authMiddleware, getMyProperties);
router.get("/:id",authMiddleware, getProperty);

export default router;