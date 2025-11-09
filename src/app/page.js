"use client";

import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";

export default function HomePage() {
  const { login } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <DivFormulario>
        <Formulario
          initialValues={{ senha: "", login: "" }}
          titulo="Assistente de Pronto Atendimento"
          onSubmit={(data) => login(data.login, data.senha)}
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
