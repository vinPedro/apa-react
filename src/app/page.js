"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import PrimeiroAdminForm from '../components/forms/PrimeiroAdminForm.jsx';
import AlertMessage from '@/components/AlertMessage'; // <-- Importação

// ----------------------------------------------------
// FUNÇÃO DE VERIFICAÇÃO DE STATUS
// ----------------------------------------------------
const checkAdminStatus = async () => {
    try {
        const timestamp = Date.now();
        const url = `/api/setup/status?t=${timestamp}`;
       
        const response = await fetch(url, {
            cache: 'no-store', 
        });

        if (!response.ok) throw new Error('Falha na conexão com a API de status.');

        const data = await response.json();
        return data.adminExists;

    } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        return false;
    }
};

// ----------------------------------------------------
// COMPONENTE PRINCIPAL (HomePage/Login)
// ----------------------------------------------------
export default function HomePage() {
    const { login } = useAuth();

    // --- ESTADOS DO SETUP ---
    const [needsSetup, setNeedsSetup] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // --- ESTADOS E FUNÇÕES DO LOGIN DIÁRIO (USUÁRIO) ---
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado unificado para alertas (Erro ou Sucesso)
    const [alert, setAlert] = useState(null);

    // --- LÓGICA DO SETUP ---
    useEffect(() => {
        const initializePage = async () => {
            const isInitialized = await checkAdminStatus();
            setNeedsSetup(!isInitialized);
            setVerifying(false);
        };
        initializePage();
    }, []);

    const handleSetupSuccess = async () => {
        setVerifying(true);
        const isInitialized = await checkAdminStatus();
        setNeedsSetup(!isInitialized);
        setVerifying(false);
        setAlert({ message: "Administrador configurado! Prossiga com o login.", variant: "success" });
    };

    const validate = (formData) => {
        const newErrors = {};
        if (!formData.login) newErrors.login = "CPF/Identificador é obrigatório.";
        if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
        return newErrors;
    };

    const handleSubmit = async (data) => {
        const validationErrors = validate(data);
        setErrors(validationErrors);
        setAlert(null); // Limpa alertas anteriores

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                await login(data.login, data.senha);
                // O redirecionamento acontece dentro do login(), se falhar cai no catch
            } catch (error) {
                setAlert({ message: error.message || "Falha no login. Verifique suas credenciais.", variant: "error" });
            } finally {
                setIsLoading(false);
            }
        } else {
             setAlert({ message: "Preencha os campos obrigatórios.", variant: "warning" });
        }
    };

    // --- RENDERIZAÇÃO CONDICIONAL ---
    
    if (verifying) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full p-4">
                <p className="text-xl text-blue-500">Verificando status inicial do sistema...</p>
            </div>
        );
    }

    if (needsSetup) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full p-4">
                <PrimeiroAdminForm onCadastroSucesso={handleSetupSuccess} />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            
            {/* Componente AlertMessage */}
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <DivFormulario>
                <Formulario
                    initialValues={{ senha: "", login: "" }}
                    titulo="Assistente de Pronto Atendimento"
                    onSubmit={handleSubmit}
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
                                error={errors.login}
                                disabled={isLoading}
                            />

                            <Campo
                                label="Senha:"
                                placeholder="senha"
                                name="senha"
                                value={formData.senha || ""}
                                type="password"
                                onChange={handleChange}
                                error={errors.senha}
                                disabled={isLoading}
                            />

                            <Botao maximo={700} disabled={isLoading}>
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Botao>

                            <Link href="/cadastro">
                                <Botao
                                    maximo={700}
                                    background="var(--color-botao-terceira)"
                                    color="var(--color-text-botao-secundaria)"
                                    disabled={isLoading}
                                    type="button"
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