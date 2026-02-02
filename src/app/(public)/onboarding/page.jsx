"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode";
import TvPanel from '@/components/TV/TvPanel';

function PainelChamadaUX() {
    const { token, isAuthenticated } = useAuth();
    const [info, setInfo] = useState({ unidadeId: null, unidadeNome: "" });
    const [status, setStatus] = useState("carregando");

    useEffect(() => {
        const vincularUBS = async () => {
            if (!token || !isAuthenticated) return;

            try {
                const decoded = jwtDecode(token);
                // CPF vindo do token (limpando pontuação)
                const cpfToken = decoded.sub ? decoded.sub.replace(/\D/g, "") : null;

                const res = await fetch('http://localhost:8080/api/profissionais', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const profissionais = await res.json();
                    
                    // Busca o profissional pelo CPF
                    const prof = profissionais.find(p => p.cpf?.replace(/\D/g, "") === cpfToken);

                    if (prof) {
                        // AJUSTE DEFINITIVO BASEADO NO SEU JSON:
                        // O campo correto é ubsVinculadaId
                        const idUBS = prof.ubsVinculadaId;
                        const nomeUBS = prof.nomeCompleto ? `UNIDADE - ${prof.nomeCompleto}` : "UNIDADE DE SAÚDE";

                        if (idUBS) {
                            setInfo({ 
                                unidadeId: idUBS, 
                                unidadeNome: nomeUBS 
                            });
                            setStatus("pronto");
                        } else {
                            setStatus("ubs_id_nulo_no_json");
                        }
                    } else {
                        setStatus("cpf_nao_encontrado");
                    }
                } else {
                    setStatus("erro_servidor_api");
                }
            } catch (error) {
                console.error("Erro técnico:", error);
                setStatus("erro_tecnico");
            }
        };

        vincularUBS();
    }, [token, isAuthenticated]);

    if (status === "carregando") return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono animate-pulse uppercase">Iniciando Sistema...</div>;

    if (status !== "pronto") return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 font-mono text-red-500 border-4 border-red-900 text-center">
            <h2 className="text-2xl font-bold mb-4">ERRO DE IDENTIFICAÇÃO</h2>
            <p className="p-4 bg-red-900/20 border border-red-500">MOTIVO: {status.toUpperCase()}</p>
            <p className="mt-4 text-gray-400 text-sm">Verifique se o CPF no cadastro do profissional está correto.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-4">
            {/* Cabeçalho */}
            <div className="w-full max-w-[1100px] flex justify-between items-end mb-10 p-8 bg-slate-900/40 border-b-4 border-blue-600 rounded-2xl shadow-2xl">
                <div>
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">Painel de Chamadas Profissional</p>
                    <h1 className="text-white text-5xl font-black italic uppercase tracking-tighter">
                        UBS ID: {info.unidadeId}
                    </h1>
                </div>
                <div className="text-white font-mono text-4xl font-bold opacity-60 italic">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Container da TV */}
            <div className="relative">
                <div className="absolute -inset-20 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="relative bg-black border-[16px] border-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden" style={{ width: '460px', height: '660px' }}>
                    <TvPanel unidadeId={info.unidadeId} />
                </div>
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return <Suspense fallback={null}><PainelChamadaUX /></Suspense>;
}