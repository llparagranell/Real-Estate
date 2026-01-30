import express from "express";
import { SigninInput, signupSchema } from "../../validators/user.validator";
import { validate } from "../../middleware/validate";
import { signup } from "../../controllers/user/auth.controller";

const router = express.Router();

// api/v1/user/auth/register
router.post('/register',validate(signupSchema),(signup))

export default router;