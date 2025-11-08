"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";

export default function Login() {
  return (
      <DivFormulario>
        
        <Formulario
          initialValues={{ senha: "", login: "" }}
          onSubmit={(data) => console.log(data)}
          titulo="Assitente de Pronto Atendimento"
        >
          {({ formData, handleChange }) => (
            <>
              <Campo
                label="CPF/Indentificador:"
                placeholder="CPF/Indentificador"
                name="login"
                value={formData.data}
                type="number"
                onChange={handleChange}
              ></Campo>

              <Campo
                label="Senha:"
                placeholder="senha"
                name="senha"
                value={formData.data}
                type="password"
                onChange={handleChange}
              ></Campo>

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
          {" "}
          Esqueci minha senha
        </Link>
      </DivFormulario>
  );
}
