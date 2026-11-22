export function truncate(text = "", limit = 150) {
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
