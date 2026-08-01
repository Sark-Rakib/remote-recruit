import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { api, getToken, setToken, getUser, setUser, removeToken, removeUser } from "../api/client";

export default function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    api
      .me(token)
      .then((data) => {
        setUserState(data.user);
        setUser(data.user);
      })
      .catch(() => {
        removeToken();
        removeUser();
        setUserState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Sign up ─────────────────────────────────────────────────────────────
  // Registers locally; the backend generates a secure verification token and
  // sends the verification email via Gmail SMTP.
  const signup = async (payload) => {
    const data = await api.register(payload);
    return data;
  };

  // ── Sign in ─────────────────────────────────────────────────────────────
  // Login is blocked server-side until the email is verified.
  const login = async (payload) => {
    const data = await api.login(payload);
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    return data.user;
  };

  // ── Resend verification email ───────────────────────────────────────────
  const resendVerification = async (email) => {
    return api.resendVerification(email);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, resendVerification }}
    >
      {children}
    </AuthContext.Provider>
  );
}
