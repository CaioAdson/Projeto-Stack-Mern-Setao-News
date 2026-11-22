import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Alert, Spinner } from "../components/Feedback";
import { Panel } from "../components/Panel";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import * as postService from "../services/postService";
import { commentSchema } from "../schemas";
import { formatDate } from "../utils/format";

const Article = styled.article`
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  margin-bottom: 1.5rem;

  > img {
    width: 100%;
    max-height: 420px;
    object-fit: cover;
    background: #ddd;
  }

  .content {
    padding: 2rem;
  }

  h1 {
    font-size: 2.6rem;
    line-height: 1.1;
    margin-bottom: 1rem;
    overflow-wrap: anywhere;
  }

  .text {
    font-size: 1.2rem;
    line-height: 1.6;
    white-space: pre-line; /* mantém as quebras de linha sem interpretar HTML */
    overflow-wrap: anywhere;
  }

  @media (max-width: 640px) {
    .content {
      padding: 1.2rem;
    }
    h1 {
      font-size: 1.8rem;
    }
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: Roboto, Arial, sans-serif;
  color: ${({ theme }) => theme.muted};
  margin-bottom: 1.5rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: ${({ theme }) => theme.primaryDark};
    font-weight: 500;
  }

  img {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const LikeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ $active, theme }) => ($active ? theme.primary : "transparent")};
  color: ${({ $active, theme }) => ($active ? "#fff" : theme.primaryDark)};
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-family: Roboto, Arial, sans-serif;
  cursor: pointer;
`;

const CommentList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;

  li {
    display: flex;
    gap: 0.8rem;
    align-items: flex-start;
  }

  li img {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .bubble {
    flex: 1;
    min-width: 0;
    background: #f4f4f4;
    border-radius: ${({ theme }) => theme.radius};
    padding: 0.7rem 0.9rem;
  }

  .bubble header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-family: Roboto, Arial, sans-serif;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.muted};
    margin-bottom: 0.3rem;
  }

  .bubble p {
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .bubble button {
    border: none;
    background: none;
    color: ${({ theme }) => theme.danger};
    cursor: pointer;
  }
`;

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(commentSchema) });

  useEffect(() => {
    setLoading(true);
    postService
      .getPost(id)
      .then(setPost)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleLike() {
    if (!user) return navigate("/auth", { state: { from: `/news/${id}` } });
    try {
      const { likes } = await postService.toggleLike(id);
      setPost((current) => ({ ...current, likes }));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleComment({ message }) {
    try {
      setActionError("");
      setPost(await postService.addComment(id, message));
      reset();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Apagar este comentário?")) return;
    try {
      setPost(await postService.deleteComment(id, commentId));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;

  const liked = Boolean(user && post.likes.includes(user.id));
  const isPostAuthor = user && post.author?.id === user.id;

  return (
    <>
      <Article>
        <img src={post.banner} alt="" referrerPolicy="no-referrer" />
        <div className="content">
          <h1>{post.title}</h1>
          <Meta>
            {post.author ? (
              <Link to={`/users/${post.author.id}`}>
                <img src={post.author.avatar} alt="" referrerPolicy="no-referrer" />
                {post.author.name}
              </Link>
            ) : (
              <span>Autor removido</span>
            )}
            <span>{formatDate(post.createdAt)}</span>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <LikeButton type="button" $active={liked} onClick={handleLike} aria-pressed={liked}>
                <i className={liked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"} />
                {post.likes.length}
              </LikeButton>
              {isPostAuthor && (
                <Link to={`/news/${post.id}/edit`}>
                  <Button variant="outline" type="button">
                    Editar
                  </Button>
                </Link>
              )}
            </div>
          </Meta>
          {/* Renderizado como texto: o React escapa qualquer HTML (proteção contra XSS) */}
          <p className="text">{post.text}</p>
        </div>
      </Article>

      <Panel>
        <h2 style={{ marginBottom: "1rem" }}>Comentários ({post.comments.length})</h2>
        <Alert>{actionError}</Alert>

        {user ? (
          <form onSubmit={handleSubmit(handleComment)} noValidate style={{ marginTop: "0.5rem" }}>
            <Input
              placeholder="Escreva um comentário"
              error={errors.message?.message}
              {...register("message")}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" loading={isSubmitting}>
                Comentar
              </Button>
            </div>
          </form>
        ) : (
          <p>
            <Link to="/auth" state={{ from: `/news/${id}` }}>
              Entre
            </Link>{" "}
            para curtir e comentar.
          </p>
        )}

        <CommentList>
          {post.comments.map((comment) => (
            <li key={comment.id}>
              <img src={comment.author?.avatar} alt="" referrerPolicy="no-referrer" />
              <div className="bubble">
                <header>
                  <span>
                    <strong>{comment.author?.name || "Usuário removido"}</strong> ·{" "}
                    {formatDate(comment.createdAt)}
                  </span>
                  {user && (comment.author?.id === user.id || isPostAuthor) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      aria-label="Apagar comentário"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  )}
                </header>
                <p>{comment.message}</p>
              </div>
            </li>
          ))}
        </CommentList>
      </Panel>
    </>
  );
}
