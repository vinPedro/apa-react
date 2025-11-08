'use client';

import { useAuth } from "@/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfissionalPage() {
  const { isAuthenticated, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || profile !== "ProfissionaldeSaude") {
      router.push("/");
    }
  }, [isAuthenticated, profile]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Painel do Profissional de Saúde</h1>
      <p>Bem-vindo(a)! Aqui você gerencia atendimentos ✅</p>
    </div>
  );
}
