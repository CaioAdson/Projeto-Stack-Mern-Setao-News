import axios from "axios";

export const TOKEN_KEY = "sn_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

// Envia o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expirado/inválido: avisa o AuthContext para deslogar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      setToken(null);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

/** Extrai uma mensagem de erro legível de uma resposta do axios. */
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    (error?.request && !error?.response ? "Não foi possível conectar à API" : null) ||
    "Algo deu errado, tente novamente"
  );
}

export default api;
