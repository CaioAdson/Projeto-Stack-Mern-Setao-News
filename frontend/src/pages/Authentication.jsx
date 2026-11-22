import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo-sertaonews.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Alert } from "../components/Feedback";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { signinSchema, signupSchema } from "../schemas";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem;

  > a img {
    width: 10rem;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(900px, 100%);
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ $dark, theme }) => ($dark ? theme.primaryDark : theme.surface)};
  color: ${({ $dark }) => ($dark ? "#fff" : "inherit")};

  h2 {
    font-size: 2rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  ${({ $dark }) =>
    $dark &&
    `
    label { color: #fff; }
    [role="alert"] span, span[role="alert"] { color: #ffe0e0; }
  `}
`;

export default function Authentication() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [signinError, setSigninError] = useState("");
  const [signupError, setSignupError] = useState("");

  const signinForm = useForm({ resolver: zodResolver(signinSchema) });
  const signupForm = useForm({ resolver: zodResolver(signupSchema) });

  async function handleSignin(data) {
    try {
      setSigninError("");
      await login(data);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSigninError(getErrorMessage(error));
    }
  }

  async function handleSignup({ name, email, password }) {
    try {
      setSignupError("");
      await register({ name, email, password });
      navigate("/profile", { replace: true });
    } catch (error) {
      setSignupError(getErrorMessage(error));
    }
  }

  const inErrors = signinForm.formState.errors;
  const upErrors = signupForm.formState.errors;

  return (
    <Container>
      <Link to="/" aria-label="Voltar para a página inicial">
        <img src={logo} alt="SertãoNews" />
      </Link>

      <Columns>
        <Section $dark>
          <h2>Entrar</h2>
          <form onSubmit={signinForm.handleSubmit(handleSignin)} noValidate>
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              error={inErrors.email?.message}
              {...signinForm.register("email")}
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              error={inErrors.password?.message}
              {...signinForm.register("password")}
            />
            <Alert>{signinError}</Alert>
            <Button type="submit" variant="outline" style={{ color: "#fff", borderColor: "#fff" }} loading={signinForm.formState.isSubmitting}>
              Entrar
            </Button>
          </form>
        </Section>

        <Section>
          <h2>Cadastrar</h2>
          <form onSubmit={signupForm.handleSubmit(handleSignup)} noValidate>
            <Input
              label="Nome"
              autoComplete="name"
              error={upErrors.name?.message}
              {...signupForm.register("name")}
            />
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              error={upErrors.email?.message}
              {...signupForm.register("email")}
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="new-password"
              error={upErrors.password?.message}
              {...signupForm.register("password")}
            />
            <Input
              label="Confirmar senha"
              type="password"
              autoComplete="new-password"
              error={upErrors.confirmPassword?.message}
              {...signupForm.register("confirmPassword")}
            />
            <Alert>{signupError}</Alert>
            <Button type="submit" loading={signupForm.formState.isSubmitting}>
              Cadastrar
            </Button>
          </form>
        </Section>
      </Columns>
    </Container>
  );
}
