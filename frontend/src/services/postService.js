import api from "./api";

export async function listPosts({ limit = 6, offset = 0 } = {}) {
  const { data } = await api.get("/posts", { params: { limit, offset } });
  return data; // { total, limit, offset, nextOffset, previousOffset, results }
}

export async function getLatestPost() {
  const { data } = await api.get("/posts/latest");
  return data.post;
}

export async function searchPosts(title) {
  const { data } = await api.get("/posts/search", { params: { title } });
  return data.results;
}

export async function getMyPosts() {
  const { data } = await api.get("/posts/me");
  return data.results;
}

export async function getPost(id) {
  const { data } = await api.get(`/posts/${id}`);
  return data;
}

export async function createPost(post) {
  const { data } = await api.post("/posts", post);
  return data;
}

export async function updatePost(id, post) {
  const { data } = await api.patch(`/posts/${id}`, post);
  return data;
}

export async function deletePost(id) {
  await api.delete(`/posts/${id}`);
}

export async function toggleLike(id) {
  const { data } = await api.patch(`/posts/${id}/like`);
  return data; // { liked, likes }
}

export async function addComment(id, message) {
  const { data } = await api.post(`/posts/${id}/comments`, { message });
  return data;
}

export async function deleteComment(id, commentId) {
  const { data } = await api.delete(`/posts/${id}/comments/${commentId}`);
  return data;
}
