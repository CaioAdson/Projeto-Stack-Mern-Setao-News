import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardGrid, NewsCard } from "../components/NewsCard";
import { Alert, Spinner } from "../components/Feedback";
import { Panel } from "../components/Panel";
import { getErrorMessage } from "../services/api";
import { searchPosts } from "../services/postService";

export default function Search() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!title.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchPosts(title)
      .then((results) => {
        setPosts(results);
        setError("");
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [title]);

  const summary = posts.length
    ? `Encontramos ${posts.length} ${posts.length > 1 ? "resultados" : "resultado"} para:`
    : "Não encontramos resultados para:";

  return (
    <>
      <Panel style={{ marginBottom: "1rem" }}>
        <p>{loading ? "Pesquisando..." : summary}</p>
        {/* O React escapa o texto automaticamente: o termo pesquisado não vira HTML */}
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
      </Panel>

      <Alert>{error}</Alert>

      {loading ? (
        <Spinner />
      ) : (
        <CardGrid>
          {posts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </CardGrid>
      )}
    </>
  );
}
