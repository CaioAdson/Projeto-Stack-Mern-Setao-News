import { Router } from "express";
import postController from "../controllers/post.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { idParams } from "../validators/common.js";
import {
  commentParams,
  commentSchema,
  createPostSchema,
  paginationSchema,
  searchSchema,
  updatePostSchema,
} from "../validators/post.validator.js";

const router = Router();
const byId = validate(idParams, "params");

// Rotas públicas (leitura)
router.get("/", validate(paginationSchema, "query"), asyncHandler(postController.list));
router.get("/latest", asyncHandler(postController.latest));
router.get("/search", validate(searchSchema, "query"), asyncHandler(postController.search));

// Notícias do usuário logado (precisa vir antes de "/:id")
router.get("/me", auth, asyncHandler(postController.listMine));

router.get("/:id", byId, asyncHandler(postController.findById));

// CRUD protegido
router.post("/", auth, validate(createPostSchema), asyncHandler(postController.create));
router.patch("/:id", auth, byId, validate(updatePostSchema), asyncHandler(postController.update));
router.delete("/:id", auth, byId, asyncHandler(postController.remove));

// Interações
router.patch("/:id/like", auth, byId, asyncHandler(postController.toggleLike));
router.post(
  "/:id/comments",
  auth,
  byId,
  validate(commentSchema),
  asyncHandler(postController.addComment)
);
router.delete(
  "/:id/comments/:commentId",
  auth,
  validate(commentParams, "params"),
  asyncHandler(postController.removeComment)
);

export default router;
