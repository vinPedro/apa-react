'use client';

import { useAuth } from "@/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PacientePage() {
  const { isAuthenticated, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || profile !== "Paciente") {
      router.push("/");
    }
  }, [isAuthenticated, profile]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Painel do Paciente</h1>
      <p>Bem-vindo(a)! Aqui você visualiza suas informações ✅</p>
    </div>
  );
}
