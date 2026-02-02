'use client';

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
                const cpfToken = decoded.sub ? decoded.sub.replace(/\D/g, "") : null;

                const res = await fetch('http://localhost:8080/api/profissionais', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const profissionais = await res.json();
                    const prof = profissionais.find(p => p.cpf?.replace(/\D/g, "") === cpfToken);

                    if (prof) {
                        const idUBS = prof.ubsVinculadaId;
                        if (idUBS) {
                            setInfo({ unidadeId: idUBS });
                            setStatus("pronto");
                        } else {
                            setStatus("ubs_id_nulo");
                        }
                    } else {
                        setStatus("cpf_nao_encontrado");
                    }
                } else {
                    setStatus("erro_servidor");
                }
            } catch (error) {
                setStatus("erro_tecnico");
            }
        };
        vincularUBS();
    }, [token, isAuthenticated]);

    if (status === "carregando") return <div className="h-screen bg-black flex items-center justify-center text-blue-500 font-mono text-xs animate-pulse uppercase">Iniciando...</div>;

    if (status !== "pronto") return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-4 font-mono text-red-500 text-center">
            <p className="text-xs p-2 border border-red-500 uppercase font-bold tracking-tighter">ERRO: {status}</p>
        </div>
    );

    return (
        <div className="h-screen bg-[#010204] flex flex-col overflow-hidden">
            {/* Cabeçalho Ultra Compacto */}
            <header className="w-full bg-slate-950 border-b border-blue-900/50 px-4 py-2 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    <h1 className="text-white text-sm font-bold tracking-tight">
                        UBS <span className="text-blue-500">ID {info.unidadeId}</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-mono text-[11px] uppercase tracking-widest">
                        {new Date().toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-white font-mono text-sm font-black bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </header>

            {/* Container da TV - Reduzido para caber no viewport */}
            <main className="flex-1 relative flex items-center justify-center p-3 bg-gradient-to-b from-[#020408] to-black">
                {/* Glow de fundo mais discreto */}
                <div className="absolute inset-0 bg-blue-600/5 blur-[80px] pointer-events-none"></div>
                
                {/* Frame da "TV" - Layout Notebook */}
                <div className="relative w-full max-w-[800px] h-full max-h-[82vh] bg-black border-[6px] border-slate-900 rounded-[1.5rem] shadow-2xl overflow-hidden ring-1 ring-blue-900/20">
                    <div className="w-full h-full relative">
                        <TvPanel unidadeId={info.unidadeId} />
                    </div>
                </div>
            </main>

            {/* Footer Minimalista (Opcional) */}
            <footer className="px-4 py-1 bg-black text-right">
                <span className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">SISTEMA APA v3.0</span>
            </footer>
        </div>
    );
}

export default function OnboardingPage() {
    return <Suspense fallback={null}><PainelChamadaUX /></Suspense>;
}