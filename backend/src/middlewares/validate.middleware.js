/**
 * Valida req.body / req.query / req.params com um schema do Zod.
 * Os dados validados substituem os originais: campos não previstos no schema
 * são descartados (proteção contra mass assignment e injeção de operadores).
 */
export default function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) return next(result.error);
    req[source] = result.data;
    return next();
  };
}
