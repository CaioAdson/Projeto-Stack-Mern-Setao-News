import { Link } from "react-router-dom";
import styled from "styled-components";
import { formatDate, truncate } from "../utils/format";

const Card = styled.article`
  display: flex;
  background-color: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  min-height: ${({ $top }) => ($top ? "320px" : "200px")};

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem;
  flex: 1;
  min-width: 0;

  h2 {
    font-size: ${({ $top }) => ($top ? "2.4rem" : "1.25rem")};
    line-height: 1.15;
    margin-bottom: 0.6rem;
    overflow-wrap: anywhere;
  }

  h2 a {
    text-decoration: none;
  }

  h2 a:hover {
    color: ${({ theme }) => theme.primaryDark};
  }

  p {
    font-size: ${({ $top }) => ($top ? "1.2rem" : "1rem")};
    color: ${({ theme }) => theme.muted};
    overflow-wrap: anywhere;
  }

  @media (max-width: 640px) {
    h2 {
      font-size: 1.4rem;
    }
  }
`;

const Banner = styled.img`
  width: 40%;
  object-fit: cover;
  background-color: #ddd;

  @media (max-width: 640px) {
    width: 100%;
    height: 180px;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.muted};

  .stats {
    display: flex;
    gap: 1rem;
  }

  .stats span {
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.8rem;

  a,
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.primary};
  }

  button:hover {
    color: ${({ theme }) => theme.danger};
  }
`;

/**
 * Card de notícia usado na home, na busca e no perfil.
 * Com `onDelete`, mostra os botões de editar/excluir (somente para o autor).
 */
export function NewsCard({ post, top = false, onDelete }) {
  return (
    <Card $top={top}>
      <Body $top={top}>
        <div>
          <h2>
            <Link to={`/news/${post.id}`}>{post.title}</Link>
          </h2>
          <p>{truncate(post.text, top ? 300 : 140)}</p>
        </div>

        <Footer>
          <div className="stats">
            <span title="Curtidas">
              <i className="bi bi-hand-thumbs-up" /> {post.likes.length}
            </span>
            <span title="Comentários">
              <i className="bi bi-chat" /> {post.comments.length}
            </span>
            <span>
              {post.author ? `por ${post.author.name}` : ""} · {formatDate(post.createdAt)}
            </span>
          </div>

          {onDelete && (
            <Actions>
              <Link to={`/news/${post.id}/edit`} aria-label="Editar notícia">
                <i className="bi bi-pencil-square" />
              </Link>
              <button type="button" onClick={() => onDelete(post)} aria-label="Excluir notícia">
                <i className="bi bi-trash3" />
              </button>
            </Actions>
          )}
        </Footer>
      </Body>
      <Banner src={post.banner} alt="" loading="lazy" referrerPolicy="no-referrer" />
    </Card>
  );
}

export const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
