"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import Formulario from "@/components/Formulario";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className="flex flex-col justify-center rounded-3xl shadow-[0_0px_10px_rgba(0,0,0,0.20)] m-1 py-[30px] max-w-[500px] min-w-[300px] w-full max-h-[400px] min-h-fit h-full">
        <h1 className="text-center !text-[clamp(25px,5vw,30px)] !font-bold">
          Assitente de Pronto <br /> Atendimento
        </h1>
        <Formulario
          initialValues={{ senha: "", login: "" }}
          onSubmit={(data) => console.log(data)}
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

        <Link href="/home" className="text-center text-primaria">
          {" "}
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
