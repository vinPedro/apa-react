'use client'; 

import { useAuth } from "../AuthContext"; 

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";


export default function HomePage() {
  
  const { profile, isAuthenticated } = useAuth(); 

  

  if (isAuthenticated) { 
    
   
    if (profile === 'admin') {
      return (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
            <p className="text-gray-600">
              Neste Painel, todas as funcionalidades podem ser administradas por você!
            </p>
          </div>
        </div>
      );
    }
    
    
    if (profile === 'ProfissionaldeSaude') {
      return (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
            <p className="text-gray-600">
              Neste Painel, você poderá fazer as funcionalidades de um Profissional de Saúde!
            </p>
          </div>
        </div>
      );
    }
    
 
    if (profile === 'Paciente') {
      return (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
            <p className="text-gray-600">
              Neste Painel, todas as funcionalidades de Paciente podem ser visualizadas por você!
            </p>
          </div>
        </div>
      );
    }

  }


  
  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4">
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
                value={formData.login || ''} 
                type="number"
                onChange={handleChange}
              ></Campo>

              <Campo
                label="Senha:"
                placeholder="senha"
                name="senha"
                value={formData.senha || ''} 
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
    </div>
  );
}