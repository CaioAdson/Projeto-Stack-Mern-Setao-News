import { useEffect, useState } from "react";
import styled from "styled-components";
import { CardGrid, NewsCard } from "../components/NewsCard";
import { Alert, EmptyState, Spinner } from "../components/Feedback";
import { Button } from "../components/Button";
import { getErrorMessage } from "../services/api";
import { getLatestPost, listPosts } from "../services/postService";

const PAGE_SIZE = 6;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  font-family: Roboto, Arial, sans-serif;
`;

export default function Home() {
  const [latest, setLatest] = useState(null);
  const [page, setPage] = useState({ results: [], total: 0 });
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLatestPost()
      .then(setLatest)
      .catch(() => setLatest(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    listPosts({ limit: PAGE_SIZE, offset })
      .then((data) => {
        setPage(data);
        setError("");
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [offset]);

  const totalPages = Math.max(1, Math.ceil(page.total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <>
      {latest && offset === 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <NewsCard post={latest} top />
        </div>
      )}

      <Alert>{error}</Alert>

      {loading ? (
        <Spinner />
      ) : (
        <CardGrid>
          {page.results.length === 0 && !error && (
            <EmptyState>Nenhuma notícia publicada ainda. Entre e publique a primeira!</EmptyState>
          )}
          {page.results
            .filter((post) => offset !== 0 || post.id !== latest?.id)
            .map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
        </CardGrid>
      )}

      {page.total > PAGE_SIZE && (
        <Pagination aria-label="Paginação">
          <Button
            variant="outline"
            disabled={page.previousOffset === null}
            onClick={() => setOffset(page.previousOffset)}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page.nextOffset === null}
            onClick={() => setOffset(page.nextOffset)}
          >
            Próxima
          </Button>
        </Pagination>
      )}
    </>
  );
}
