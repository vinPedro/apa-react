'use client';

import { useAuth } from "@/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isAuthenticated, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || profile !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, profile]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      <p>Bem-vindo(a), administrador! Aqui você controla tudo ✅</p>
    </div>
  );
}
