"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/AuthContext";
import AlertMessage from "@/components/AlertMessage";
import Campo from "@/components/Campo"; // Usamos para filtrar o ID da unidade se necessário

export default function FichasAtivasPage() {
    const { token } = useAuth();
    const [fila, setFila] = useState([]);
    const [unidadeId, setUnidadeId] = useState(""); // O ideal é pegar do perfil do profissional, mas vamos deixar digitável por enquanto
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const buscarFila = async () => {
        if (!unidadeId) {
            setAlert({ message: "Informe o ID da Unidade.", variant: "warning" });
            return;
        }

        setIsLoading(true);
        setAlert(null);

        try {
            const response = await fetch(`/api/atendimentos/fila/${unidadeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Erro ao buscar fila.");

            const data = await response.json();
            setFila(data);
            if (data.length === 0) setAlert({ message: "Nenhum paciente na fila.", variant: "warning" });

        } catch (err) {
            console.error(err);
            setAlert({ message: "Erro ao carregar fila.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {alert && (
                <AlertMessage message={alert.message} variant={alert.variant} onClose={() => setAlert(null)} />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Fichas Ativas (Fila de Espera)</h1>
                <div className="flex gap-2 items-end">
                    <div className="w-40">
                        <label className="text-sm text-gray-600">ID da Unidade:</label>
                        <input 
                            type="number" 
                            value={unidadeId}
                            onChange={(e) => setUnidadeId(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Ex: 1"
                        />
                    </div>
                    <button 
                        onClick={buscarFila}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 h-10"
                        disabled={isLoading}
                    >
                        {isLoading ? "..." : "Atualizar"}
                    </button>
                </div>
            </div>

            {/* Lista de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fila.map((item) => (
                    <div key={item.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${item.prioridade === 'PRIORIDADE' ? 'border-red-500' : 'border-blue-500'}`}>
                        <div className="flex justify-between items-start">
                            <span className="text-2xl font-bold text-gray-800">{item.senha}</span>
                            <span className={`text-xs px-2 py-1 rounded font-bold ${item.prioridade === 'PRIORIDADE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {item.prioridade}
                            </span>
                        </div>
                        <p className="mt-2 font-medium text-gray-700 truncate">{item.pacienteNome}</p>
                        <p className="text-sm text-gray-500">Chegada: {new Date(item.dataHoraChegada).toLocaleTimeString()}</p>
                        
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700">
                                Chamar
                            </button>
                            <button className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm hover:bg-gray-300">
                                Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}