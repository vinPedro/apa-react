"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from "@/AuthContext";

export default function TvPanel({ unidadeId }) {
    const { token } = useAuth();
    const [painel, setPainel] = useState({ senhaAtual: "---", guiche: "Aguarde...", historico: [] });
    const ultimaSenhaRef = useRef("---");

    const monitorarPainel = useCallback(async () => {
        if (!unidadeId || unidadeId === "undefined" || !token) return;
        try {
            const res = await fetch(`http://localhost:8080/api/painel/atual?unidadeId=${unidadeId}`, {
                method: 'GET', 
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                if (JSON.stringify(data) !== JSON.stringify(painel)) setPainel(data);
                if (data.senhaAtual !== "---" && data.senhaAtual !== ultimaSenhaRef.current) {
                    ultimaSenhaRef.current = data.senhaAtual;
                    new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
                }
            }
        } catch (err) { console.error(err); }
    }, [unidadeId, token, painel]);

    useEffect(() => {
        monitorarPainel();
        const interval = setInterval(monitorarPainel, 4000);
        return () => clearInterval(interval);
    }, [monitorarPainel]);

    return (
        <div className="flex h-full w-full bg-[#05070a] text-white overflow-hidden font-sans border border-white/5 shadow-inner">
            
            {/* ÁREA DA SENHA (ESQUERDA) */}
            <div className="flex-[2.5] flex flex-col items-center justify-center p-6 border-r border-white/10 relative">
                <div className="absolute top-4 left-6">
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Chamada em Tempo Real</span>
                </div>

                {painel.senhaAtual !== "---" ? (
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Senha Atual</h1>
                        
                        {/* AJUSTE CRÍTICO: Tamanho responsivo baseado na altura da tela (vh) */}
                        <div className="text-[25vh] leading-none font-black tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
                            {painel.senhaAtual}
                        </div>
                        
                        <div className="mt-8 px-8 py-3 bg-blue-950/20 rounded-2xl border border-blue-500/30 text-center min-w-[300px]">
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Dirija-se ao Local</p>
                            <div className="text-4xl font-black text-green-400 uppercase tracking-tight">
                                {painel.guiche}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-10 animate-pulse">
                        <div className="text-6xl mb-2">🔔</div>
                        <p className="text-xs uppercase tracking-widest">Aguardando Paciente</p>
                    </div>
                )}
            </div>

            {/* HISTÓRICO (DIREITA) */}
            <div className="flex-1 bg-black/40 flex flex-col p-5">
                <h2 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em] border-b border-white/5 pb-2">Últimas Chamadas</h2>
                
                <div className="flex flex-col gap-3">
                    {painel.historico?.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border-l-4 border-slate-700 hover:border-blue-500 transition-all">
                            <div>
                                <div className="text-xl font-black leading-none">{h.senha}</div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{h.guiche}</div>
                            </div>
                            <div className="h-2 w-2 bg-slate-800 rounded-full"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-4 text-center border-t border-white/5">
                    <p className="text-[9px] text-slate-600 font-mono italic">Painel Atualizado: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    );
}