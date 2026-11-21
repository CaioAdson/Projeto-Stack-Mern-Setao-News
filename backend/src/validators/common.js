import mongoose from "mongoose";
import { z } from "zod";

export const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), "ID inválido");

// Só aceita URLs http(s): bloqueia "javascript:" e "data:", usados em ataques XSS
export const httpUrl = z
  .string()
  .trim()
  .max(2048, "URL muito longa")
  .url("URL inválida")
  .refine((value) => /^https?:\/\//i.test(value), "A URL deve começar com http:// ou https://");

export const idParams = z.object({ id: objectId });

export const nonBlank = (field, min, max) =>
  z
    .string({
      required_error: `${field} é obrigatório`,
      invalid_type_error: `${field} deve ser texto`,
    })
    .trim()
    .min(min, `${field} deve ter no mínimo ${min} caractere(s)`)
    .max(max, `${field} deve ter no máximo ${max} caracteres`);

export const atLeastOneField = (schema) =>
  schema.refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Envie pelo menos um campo para atualizar",
  });
