import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Rota não encontrada" });
}

/**
 * Middleware central de erros: converte qualquer erro em uma resposta JSON
 * padronizada, sem expor stack traces ao cliente.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.issues[0]?.message || "Dados inválidos",
      errors: err.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ message: errors[0]?.message || "Dados inválidos", errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "campo";
    return res.status(409).json({ message: `Já existe um cadastro com este ${field}` });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ message: "Sessão expirada, faça login novamente" });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON mal formatado" });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Corpo da requisição muito grande" });
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
