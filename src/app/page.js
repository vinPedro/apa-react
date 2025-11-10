"use client";

import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react"; // 

export default function HomePage() {
  const { login } = useAuth();
  
  // estado para os erros de validação
  const [errors, setErrors] = useState({});

  //  função de validação
  const validate = (formData) => {
    const newErrors = {};

    if (!formData.login) {
      newErrors.login = "CPF/Identificador é obrigatório.";
    }
    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória.";
    }

    return newErrors;
  };

  // 'handleSubmit' que usa a validação
  const handleSubmit = (data) => {
    const validationErrors = validate(data);
    setErrors(validationErrors); // Define os erros (se houver)

    // Se o objeto de erros estiver vazio, significa que não há erros
    if (Object.keys(validationErrors).length === 0) {
      login(data.login, data.senha);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <DivFormulario>
        <Formulario
          initialValues={{ senha: "", login: "" }}
          titulo="Assistente de Pronto Atendimento"
          onSubmit={handleSubmit} //  Usar o novo handleSubmit
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
                error={errors.login} //  Passar o erro para o Campo
              />

              <Campo
                label="Senha:"
                placeholder="senha"
                name="senha"
                value={formData.senha || ""}
                type="password"
                onChange={handleChange}
                error={errors.senha} //Passar o erro para o Campo
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