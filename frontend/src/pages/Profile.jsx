import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { CardGrid, NewsCard } from "../components/NewsCard";
import { Alert, EmptyState, Spinner } from "../components/Feedback";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import { deletePost, getMyPosts } from "../services/postService";
import { getUser, getUserPosts } from "../services/userService";

const Header = styled.header`
  position: relative;
  background-color: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  margin-bottom: 1.5rem;

  .cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #e2d3bf;
  }

  .info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 2rem 1.5rem;
    margin-top: -4rem;
  }

  .who {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
  }

  .avatar {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    border: 5px solid #fff;
    object-fit: cover;
    background: #fff;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-family: Roboto, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.muted};
  }

  .actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .info {
      padding: 0 1rem 1rem;
    }
    .avatar {
      width: 6rem;
      height: 6rem;
    }
  }
`;

/**
 * /profile      -> perfil do usuário logado, com ações de CRUD
 * /users/:id    -> perfil público de outro usuário (somente leitura)
 */
export default function Profile() {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();
  const isOwnProfile = !id || id === loggedUser?.id;

  const [profile, setProfile] = useState(isOwnProfile ? loggedUser : null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const request = isOwnProfile
      ? getMyPosts().then((results) => {
          setProfile(loggedUser);
          setPosts(results);
        })
      : Promise.all([getUser(id), getUserPosts(id)]).then(([user, results]) => {
          setProfile(user);
          setPosts(results);
        });

    request.catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [id, isOwnProfile, loggedUser]);

  async function handleDelete(post) {
    if (!window.confirm(`Excluir a notícia "${post.title}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading && !profile) return <Spinner />;
  if (!profile) return <Alert>{error || "Usuário não encontrado"}</Alert>;

  return (
    <>
      <Header>
        <img className="cover" src={profile.background} alt="" referrerPolicy="no-referrer" />
        <div className="info">
          <div className="who">
            <img className="avatar" src={profile.avatar} alt="" referrerPolicy="no-referrer" />
            <div>
              <h1>{profile.name}</h1>
              <h2>@{profile.username}</h2>
            </div>
          </div>

          {isOwnProfile && (
            <div className="actions">
              <Link to="/profile/edit">
                <Button variant="outline" type="button">
                  <i className="bi bi-pencil-square" /> Editar perfil
                </Button>
              </Link>
              <Link to="/news/new">
                <Button type="button">
                  <i className="bi bi-plus-circle" /> Nova notícia
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Header>

      <Alert>{error}</Alert>

      {loading ? (
        <Spinner />
      ) : (
        <CardGrid>
          {posts.length === 0 && (
            <EmptyState>
              {isOwnProfile ? "Você ainda não publicou nenhuma notícia." : "Nenhuma notícia publicada."}
            </EmptyState>
          )}
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} onDelete={isOwnProfile ? handleDelete : undefined} />
          ))}
        </CardGrid>
      )}
    </>
  );
}
