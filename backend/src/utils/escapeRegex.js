/**
 * Escapa caracteres especiais para que o texto do usuário seja tratado
 * literalmente dentro de um $regex (evita ReDoS e injeção de padrões).
 */
export default function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
