"use client";

import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react"; 

export default function HomePage() {
  const { login } = useAuth();
  
  const [errors, setErrors] = useState({});
  
  const [apiError, setApiError] = useState(null); // Para erros do backend
  const [isLoading, setIsLoading] = useState(false);

  const validate = (formData) => {
    // ... (sua validação local continua igual)
    const newErrors = {};
    if (!formData.login) newErrors.login = "CPF/Identificador é obrigatório.";
    if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
    return newErrors;
  };

  const handleSubmit = async (data) => {
    const validationErrors = validate(data);
    setErrors(validationErrors); 
    setApiError(null); // Limpa erros antigos da API

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        // Tenta fazer o login
        await login(data.login, data.senha);
        // Se deu certo, o AuthContext vai redirecionar
      } catch (error) {
        // Se deu errado, captura o erro que o AuthContext lançou
        setApiError(error.message); 
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
      <DivFormulario>
        <Formulario
          initialValues={{ senha: "", login: "" }}
          titulo="Assistente de Pronto Atendimento"
          onSubmit={handleSubmit}
        >
          {({ formData, handleChange }) => (
            <>
              {/* --- 3. ADICIONE O BLOCO DE ERRO DA API --- */}
              {apiError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                  <strong>Falha no login:</strong> {apiError}
                </div>
              )}
              {/* --- FIM DO BLOCO DE ERRO --- */}

              <Campo
                label="CPF/Identificador:"
                placeholder="CPF/Identificador"
                name="login"
                value={formData.login || ""}
                type="text"
                onChange={handleChange}
                error={errors.login}
                disabled={isLoading} // Desabilitar campo
              />

              <Campo
                label="Senha:"
                placeholder="senha"
                name="senha"
                value={formData.senha || ""}
                type="password"
                onChange={handleChange}
                error={errors.senha}
                disabled={isLoading} // Desabilitar campo
              />

              <Botao maximo={700} disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Botao>

              <Link href="/cadastro">
                <Botao
                  maximo={700}
                  background="var(--color-botao-terceira)"
                  color="var(--color-text-botao-secundaria)"
                  disabled={isLoading} // Desabilitar botão
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