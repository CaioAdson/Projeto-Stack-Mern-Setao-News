import { Router } from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

// Limita tentativas de login/cadastro por IP (proteção contra força bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Tente novamente em alguns minutos." },
});

router.use(authLimiter);

router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));

export default router;
