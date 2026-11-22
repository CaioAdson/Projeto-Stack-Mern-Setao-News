import { Link, useRouteError } from "react-router-dom";
import { Panel } from "../components/Panel";

export default function NotFound() {
  const error = useRouteError();

  return (
    <Panel $narrow style={{ marginTop: "3rem", textAlign: "center" }}>
      <h1>Ops!</h1>
      <p style={{ marginBottom: "1rem" }}>
        {error ? "Ocorreu um erro inesperado." : "Página não encontrada."}
      </p>
      <Link to="/">Voltar para a página inicial</Link>
    </Panel>
  );
}
