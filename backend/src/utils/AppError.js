/**
 * Erro de negócio com status HTTP associado.
 * Lançado pelos services e convertido em resposta pelo errorHandler.
 */
export default class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
