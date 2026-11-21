import { Router } from "express";
import userController from "../controllers/user.controller.js";
import postController from "../controllers/post.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { idParams } from "../validators/common.js";
import { updateUserSchema } from "../validators/user.validator.js";

const router = Router();

// Rotas do usuário autenticado
router.get("/me", auth, asyncHandler(userController.getMe));
router.patch("/me", auth, validate(updateUserSchema), asyncHandler(userController.updateMe));
router.delete("/me", auth, asyncHandler(userController.deleteMe));

// Perfil público de qualquer usuário
router.get("/:id", validate(idParams, "params"), asyncHandler(userController.getById));
router.get("/:id/posts", validate(idParams, "params"), asyncHandler(postController.listByUser));

export default router;
