import api from "./api";

export async function getMe() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateMe(fields) {
  const { data } = await api.patch("/users/me", fields);
  return data;
}

export async function deleteMe() {
  await api.delete("/users/me");
}

export async function getUser(id) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function getUserPosts(id) {
  const { data } = await api.get(`/users/${id}/posts`);
  return data.results;
}
