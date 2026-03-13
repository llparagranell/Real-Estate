import express from "express";
import {
    getExclusivePropertiesForApp,
    getExclusivePropertyDetailsForApp,
} from "../../controllers/user/exclusiveProperty.controller";

const router = express.Router();

router.get("/", getExclusivePropertiesForApp);
router.get("/:exclusivePropertyId", getExclusivePropertyDetailsForApp);

export default router;