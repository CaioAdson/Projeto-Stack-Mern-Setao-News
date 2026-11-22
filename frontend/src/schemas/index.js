import { z } from "zod";

const notBlank = (label, min, max) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? `${label} não pode ficar vazio` : `${label} deve ter no mínimo ${min} caracteres`)
    .max(max, `${label} deve ter no máximo ${max} caracteres`);

const httpUrl = z
  .string()
  .trim()
  .url("Informe uma URL válida")
  .refine((value) => /^https?:\/\//i.test(value), "A URL deve começar com http:// ou https://");

const email = z.string().trim().toLowerCase().email("E-mail inválido");
const password = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");

// "" vira undefined: o campo não é enviado
const optional = (schema) =>
  z.preprocess((value) => (typeof value === "string" && value.trim() === "" ? undefined : value), schema.optional());

export const signinSchema = z.object({
  email,
  password: z.string().min(1, "Informe a senha"),
});

export const signupSchema = z
  .object({
    name: notBlank("O nome", 3, 60),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

export const newsSchema = z.object({
  title: notBlank("O título", 3, 150),
  banner: httpUrl,
  text: notBlank("O texto", 1, 10000),
});

export const searchSchema = z.object({
  title: notBlank("A pesquisa", 1, 100),
});

export const commentSchema = z.object({
  message: notBlank("O comentário", 1, 500),
});

export const profileSchema = z
  .object({
    name: notBlank("O nome", 3, 60),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_-]{3,30}$/, "Use de 3 a 30 caracteres: letras, números, _ ou -"),
    email,
    avatar: httpUrl,
    background: httpUrl,
    password: optional(password),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });
