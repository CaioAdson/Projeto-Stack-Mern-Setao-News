import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Alert } from "../components/Feedback";
import { FormActions, Panel } from "../components/Panel";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { deleteMe, updateMe } from "../services/userService";
import { profileSchema } from "../schemas";

export default function EditProfile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      background: user.background,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ confirmPassword, ...fields }) {
    try {
      setError("");
      setSuccess("");
      const updated = await updateMe(fields);
      setUser(updated);
      reset({ ...updated, password: "", confirmPassword: "" });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Excluir sua conta apagará também todas as suas notícias, curtidas e comentários. Continuar?"
    );
    if (!confirmed) return;
    try {
      await deleteMe();
      logout();
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Panel $narrow>
      <h1>Editar perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Nome" error={errors.name?.message} {...register("name")} />
        <Input label="Username" error={errors.username?.message} {...register("username")} />
        <Input label="E-mail" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="URL do avatar" error={errors.avatar?.message} {...register("avatar")} />
        <Input label="URL da imagem de capa" error={errors.background?.message} {...register("background")} />
        <Input
          label="Nova senha (deixe em branco para manter)"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

        <FormActions>
          <Button type="button" variant="danger" onClick={handleDeleteAccount} style={{ marginRight: "auto" }}>
            Excluir conta
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
            Voltar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
        </FormActions>
      </form>
    </Panel>
  );
}
