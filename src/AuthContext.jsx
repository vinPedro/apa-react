"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext(null);

// Função para mapear as roles do Backend para os perfis do Frontend
const mapBackendRoleToProfile = (backendRole) => {
  switch (backendRole) {
    case "ROLE_ADMIN":
      return "admin";
    case "ROLE_PACIENTE":
      return "Paciente";
    case "ROLE_PROFISSIONAL":
      // No seu Sidebar, o perfil é "ProfissionaldeSaude"
      return "ProfissionaldeSaude"; 
    default:
      return null;
  }
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!token;

  const login = async (login, senha) => {
    try {
      // <-- 2. URL correta da API de login
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      
      }

      // API retorna { token: "..." }
      const data = await response.json(); 

      // <-- 3. Decodifica o token
      const decodedToken = jwtDecode(data.token);
      
      // <-- 4. Pega a "role" de dentro do token
      const userProfile = mapBackendRoleToProfile(decodedToken.role); 
      
      if (!userProfile) {
        throw new Error("Perfil de usuário não reconhecido.");
        
      }

      // <-- 5. Salva o token e o perfil extraído
      setToken(data.token);
      setProfile(userProfile);

      // <-- 6. Redireciona com base no perfil
      if (userProfile === "admin") router.push("/admin");
      if (userProfile === "Paciente") router.push("/Paciente");
      if (userProfile === "ProfissionaldeSaude") router.push("/ProfissionalDeSaude");

    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
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