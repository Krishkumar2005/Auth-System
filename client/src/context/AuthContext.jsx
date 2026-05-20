import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((userData, tokenData) => {
    localStorage.setItem("authToken", tokenData);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  }, []);

  const register = useCallback(async (formData) => {
    const response = await api.post("/auth/register", formData);
    const { token: newToken, user: userData } = response.data;
    saveSession(userData, newToken);
    return response.data;
  }, [saveSession]);

  const login = useCallback(async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const { token: newToken, user: userData } = response.data;
    saveSession(userData, newToken);
    return response.data;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
