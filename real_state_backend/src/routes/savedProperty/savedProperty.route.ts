import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate, validateQuery } from "../../middleware/validate";
import { 
    saveProperty, 
    unsaveProperty, 
    getSavedProperties, 
    checkIfPropertySaved 
} from "../../controllers/savedProperty/savedProperty.controller";
import { 
    savePropertySchema, 
    getSavedPropertiesQuerySchema 
} from "../../validators/savedProperty.validators";

const router = express.Router();

// All routes require authentication
router.post("/", authMiddleware, validate(savePropertySchema), saveProperty);
router.delete("/:propertyId", authMiddleware, unsaveProperty);
router.get("/", authMiddleware, validateQuery(getSavedPropertiesQuerySchema), getSavedProperties);
router.get("/check/:propertyId", authMiddleware, checkIfPropertySaved);

export default router;
