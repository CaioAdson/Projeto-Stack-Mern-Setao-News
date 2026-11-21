/**
 * Envolve um controller assíncrono e encaminha qualquer erro ao errorHandler,
 * evitando try/catch repetido em todos os controllers.
 */
export default function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
