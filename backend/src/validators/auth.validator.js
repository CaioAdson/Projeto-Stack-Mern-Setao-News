import { z } from "zod";
import { httpUrl, nonBlank } from "./common.js";

export const email = z
  .string({ required_error: "E-mail é obrigatório" })
  .trim()
  .toLowerCase()
  .email("E-mail inválido")
  .max(254, "E-mail muito longo");

// O bcrypt considera apenas os primeiros 72 bytes da senha
export const password = z
  .string({ required_error: "Senha é obrigatória" })
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");

export const username = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_-]{3,30}$/, "Username deve ter de 3 a 30 caracteres: letras, números, _ ou -");

export const registerSchema = z.object({
  name: nonBlank("Nome", 3, 60),
  email,
  password,
  username: username.optional(),
  avatar: httpUrl.optional(),
  background: httpUrl.optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string({ required_error: "Senha é obrigatória" }).min(1, "Senha é obrigatória").max(72),
});
