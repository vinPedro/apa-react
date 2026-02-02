"use client";

import React, { useEffect, useState } from 'react';

export default function TvPanel({ unidadeId }) {
    const [chamada, setChamada] = useState(null);

    useEffect(() => {
        if (!unidadeId || unidadeId === "undefined") return;

        const carregar = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/painel/proxima?unidadeId=${unidadeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setChamada(data && data.senha ? data : null);
                }
            } catch (err) {
                console.error("Erro no fetch:", err);
            }
        };

        carregar();
        const loop = setInterval(carregar, 5000);
        return () => clearInterval(loop);
    }, [unidadeId]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black p-8 text-white">
            {chamada ? (
                <div className="text-center">
                    <p className="text-blue-500 text-2xl font-bold uppercase mb-4">Senha</p>
                    <div className="text-[120px] font-black leading-none mb-10 text-white drop-shadow-2xl">
                        {chamada.senha}
                    </div>
                    <div className="w-full h-1 bg-blue-600 mb-10 opacity-50"></div>
                    <p className="text-slate-500 text-xl uppercase mb-2">Sala / Local</p>
                    <div className="text-5xl font-bold text-green-400 uppercase">
                        {chamada.local || chamada.sala || "Consultório"}
                    </div>
                </div>
            ) : (
                <div className="text-center opacity-20">
                    <p className="text-8xl mb-4">🔔</p>
                    <p className="font-mono text-xl">AGUARDANDO CHAMADA</p>
                </div>
            )}
        </div>
    );
}