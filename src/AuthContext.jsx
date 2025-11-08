"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!token;

  const login = async (login, senha) => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        alert("Usuário ou senha inválidos");
        return;
      }

      const data = await response.json();
      setToken(data.token);
      setProfile(data.profile);

     
      if (data.profile === "admin") router.push("/admin");
      if (data.profile === "Paciente") router.push("/Paciente");
      if (data.profile === "ProfissionaldeSaude") router.push("/ProfissionaldeSaude");

    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
