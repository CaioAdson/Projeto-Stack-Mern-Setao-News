import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Alert, Spinner } from "../components/Feedback";
import { FormActions, Panel } from "../components/Panel";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { createPost, getPost, updatePost } from "../services/postService";
import { newsSchema } from "../schemas";

/** Formulário de criação (/news/new) e edição (/news/:id/edit) de notícias. */
export default function ManageNews() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: { title: "", banner: "", text: "" },
  });

  useEffect(() => {
    if (!isEditing) return;
    getPost(id)
      .then((post) => {
        if (post.author?.id !== user.id) {
          setError("Você só pode editar as suas próprias notícias.");
          return;
        }
        reset({ title: post.title, banner: post.banner, text: post.text });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEditing, reset, user.id]);

  async function onSubmit(data) {
    try {
      setError("");
      const saved = isEditing ? await updatePost(id, data) : await createPost(data);
      navigate(`/news/${saved.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const banner = watch("banner");
  const showPreview = /^https?:\/\/\S+$/i.test(banner || "");

  if (loading) return <Spinner />;

  return (
    <Panel $narrow>
      <h1>{isEditing ? "Editar notícia" : "Nova notícia"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Título" error={errors.title?.message} {...register("title")} />
        <Input
          label="Link da imagem (banner)"
          placeholder="https://..."
          error={errors.banner?.message}
          {...register("banner")}
        />
        {showPreview && (
          <img
            src={banner}
            alt="Pré-visualização do banner"
            referrerPolicy="no-referrer"
            style={{ maxHeight: 200, objectFit: "cover", borderRadius: 6 }}
          />
        )}
        <Input label="Texto" multiline error={errors.text?.message} {...register("text")} />

        <Alert>{error}</Alert>

        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditing ? "Salvar alterações" : "Publicar"}
          </Button>
        </FormActions>
      </form>
    </Panel>
  );
}
