"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import PrimeiroAdminForm from '../components/forms/PrimeiroAdminForm.jsx';
import AlertMessage from '@/components/AlertMessage';

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
        setAlert(null); 

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                await login(data.login, data.senha);
            } catch (error) {
                setAlert({ message: error.message || "Falha no login. Verifique suas credenciais.", variant: "error" });
            } finally {
                setIsLoading(false);
            }
        } else {
             setAlert({ message: "Preencha os campos obrigatórios.", variant: "warning" });
        }
    };

    const bgContainer = "flex flex-col justify-center items-center min-h-screen w-full p-6 bg-slate-950";

    if (verifying) {
        return (
            <div className={bgContainer}>
                <p className="text-xl text-blue-400 animate-pulse font-medium">Iniciando sistema...</p>
            </div>
        );
    }

    if (needsSetup) {
        return (
            <div className={bgContainer}>
                <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-lg text-slate-900">
                    <PrimeiroAdminForm onCadastroSucesso={handleSetupSuccess} />
                </div>
            </div>
        );
    }

    return (
        <div className={bgContainer}>
            
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            {/* PAINEL BRANCO: max-w-lg (512px) é o equilíbrio perfeito para formulários */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg transition-all">
                <DivFormulario>
                    <Formulario
                        initialValues={{ senha: "", login: "" }}
                        titulo="ASSISTENTE DE PRONTO ATENDIMENTO"
                        onSubmit={handleSubmit}
                    >
                        {({ formData, handleChange }) => (
                            <div className="space-y-4">
                                <Campo
                                    label="CPF/Identificador: "
                                    placeholder="XXXXXXXXXXX"
                                    name="login"
                                    value={formData.login || ""}
                                    type="text"
                                    maxLength={11}
                                    onChange={handleChange}
                                    error={errors.login}
                                    disabled={isLoading}
                                />

                                <Campo
                                    label="Senha:"
                                    placeholder="Sua senha"
                                    name="senha"
                                    value={formData.senha || ""}
                                    type="password"
                                    onChange={handleChange}
                                    error={errors.senha}
                                    disabled={isLoading}
                                />

                                <div className="pt-2">
                                    <Botao maximo={1000} disabled={isLoading}>
                                        {isLoading ? "Entrando..." : "Entrar"}
                                    </Botao>
                                </div>
                            </div>
                        )}
                    </Formulario>

                    <div className="flex justify-center mt-6">
                        <Link href="/senha" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            Esqueci minha senha
                        </Link>
                    </div>
                </DivFormulario>
            </div>
        </div>
    );
}