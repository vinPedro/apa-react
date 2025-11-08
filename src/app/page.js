"use client";

import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { profile, isAuthenticated } = useAuth();
  const router = useRouter();

 
  useEffect(() => {
    if (isAuthenticated) {
      if (profile === "admin") router.push("/admin");
      if (profile === "ProfissionaldeSaude") router.push("/ProfissionaldeSaude");
      if (profile === "Paciente") router.push("/Paciente");
    }
  }, [isAuthenticated, profile]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <DivFormulario>
        <Formulario
          initialValues={{ senha: "", login: "" }}
          onSubmit={(data) => console.log(data)}
          titulo="Assistente de Pronto Atendimento"
        >
          {({ formData, handleChange }) => (
            <>
              <Campo
                label="CPF/Identificador:"
                placeholder="CPF/Identificador"
                name="login"
                value={formData.login || ""}
                type="text"
                onChange={handleChange}
              />

              <Campo
                label="Senha:"
                placeholder="senha"
                name="senha"
                value={formData.senha || ""}
                type="password"
                onChange={handleChange}
              />

              <Botao maximo={700}>Entrar</Botao>

              <Link href="/cadastro">
                <Botao
                  maximo={700}
                  background="var(--color-botao-terceira)"
                  color="var(--color-text-botao-secundaria)"
                >
                  Cadastrar-se
                </Botao>
              </Link>
            </>
          )}
        </Formulario>

        <Link href="/senha" className="text-center text-primaria">
          Esqueci minha senha
        </Link>
      </DivFormulario>
    </div>
  );
}
