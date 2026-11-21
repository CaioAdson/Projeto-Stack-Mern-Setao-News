import { z } from "zod";
import { atLeastOneField, httpUrl, nonBlank, objectId } from "./common.js";

const title = nonBlank("Título", 3, 150);
const text = nonBlank("Texto", 1, 10000);

export const createPostSchema = z.object({ title, banner: httpUrl, text });

export const updatePostSchema = atLeastOneField(
  z.object({
    title: title.optional(),
    banner: httpUrl.optional(),
    text: text.optional(),
  })
);

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(6),
  offset: z.coerce.number().int().min(0).default(0),
});

export const searchSchema = z.object({
  title: nonBlank("Pesquisa", 1, 100),
});

export const commentSchema = z.object({
  message: nonBlank("Comentário", 1, 500),
});

export const commentParams = z.object({ id: objectId, commentId: objectId });
