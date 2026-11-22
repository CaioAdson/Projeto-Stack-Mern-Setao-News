import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken } from "../services/api";
import * as authService from "../services/authService";
import { getMe } from "../services/userService";

const AuthContext = createContext(null);

/**
 * Guarda o usuário autenticado e expõe login, cadastro e logout
 * para toda a aplicação.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Ao abrir a aplicação, recupera o usuário a partir do token salvo
  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  // O interceptor do axios dispara este evento quando a API responde 401
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedUser } = await authService.login(credentials);
    setToken(token);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: newUser } = await authService.register(payload);
    setToken(token);
    setUser(newUser);
    return newUser;
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return context;
}
