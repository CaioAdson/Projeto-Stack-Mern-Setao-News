/**
 * Remove chaves que começam com "$" ou contêm "." de body, query e params.
 * Impede ataques de NoSQL injection como { "email": { "$gt": "" } }.
 */
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, nested]) => [key, clean(nested)])
    );
  }
  return value;
}

export default function sanitize(req, res, next) {
  for (const source of ["body", "query", "params"]) {
    if (req[source]) req[source] = clean(req[source]);
  }
  next();
}
