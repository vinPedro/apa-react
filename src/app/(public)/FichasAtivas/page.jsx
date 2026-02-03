"use client";

import { useState } from "react";
import { useAuth } from "@/AuthContext";
import AlertMessage from "@/components/AlertMessage";
import { useRouter } from "next/navigation";

export default function FichasAtivasPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [fila, setFila] = useState([]);
    
    // Configurações padrão
    const [unidadeId, setUnidadeId] = useState(""); 
    const [localAtendimento, setLocalAtendimento] = useState("Consultório 01");

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // --- 1. BUSCAR A LISTA ---
    const buscarFila = async () => {
        if (!unidadeId) {
            setAlert({ message: "Informe o ID da Unidade.", variant: "warning" });
            return;
        }

        setIsLoading(true);
        setAlert(null);

        try {
            const response = await fetch(`http://localhost:8080/api/atendimentos?unidadeSaudeId=${unidadeId}&status=AGUARDANDO`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Erro ao buscar fila.");

            const data = await response.json();
            setFila(data);
            
            if (data.length === 0) {
                setAlert({ message: "Nenhum paciente aguardando.", variant: "info" });
            }

        } catch (err) {
            console.error(err);
            setAlert({ message: "Erro de conexão.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. CHAMAR E REDIRECIONAR (LÓGICA BLINDADA) ---
    const handleChamar = async () => {
        // Validações básicas
        if (!unidadeId || !localAtendimento) {
            setAlert({ message: "Preencha Unidade e Local.", variant: "warning" });
            return;
        }
        if (fila.length === 0) {
            setAlert({ message: "Fila vazia! Ninguém para chamar.", variant: "warning" });
            return;
        }

        setIsLoading(true);

        // --- PASSO CRÍTICO: SALVAR QUEM VAMOS CHAMAR AGORA ---
        // Pegamos o paciente que está no topo da lista (índice 0)
        // Isso garante que temos o ID dele, independente do que o backend responder depois.
        const proximoPaciente = fila[0];
        const pacienteIdGarantido = proximoPaciente.pacienteId;

        console.log("Paciente que será chamado (ID):", pacienteIdGarantido); // Para debug

        try {
            // Chama o backend para tocar na TV
            const response = await fetch(`http://localhost:8080/api/atendimentos/chamar`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    unidadeSaudeId: parseInt(unidadeId),
                    localAtendimento: localAtendimento
                })
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                throw new Error(erro.message || "Erro ao chamar.");
            }

            const atendimento = await response.json();
            
            setAlert({ 
                message: `Chamando ${proximoPaciente.pacienteNome || 'paciente'}... Abrindo prontuário!`, 
                variant: "success" 
            });

            // --- O PULO DO GATO ---
            // Usamos o ID que salvamos lá em cima (pacienteIdGarantido).
            // Não confiamos apenas no 'atendimento.pacienteId' que vem do backend.
            setTimeout(() => {
                const idParaUrl = atendimento.pacienteId || pacienteIdGarantido;
                
                if (idParaUrl) {
                    // Redireciona já levando o ID correto na URL
                    router.push(`/prontuario?atendimentoId=${atendimento.id}&pacienteId=${idParaUrl}`);
                } else {
                    setAlert({ message: "ERRO GRAVE: ID do paciente sumiu. Tente abrir pelo cartão.", variant: "error" });
                }
            }, 1000);

        } catch (err) {
            console.error(err);
            setAlert({ message: err.message, variant: "error" });
            setIsLoading(false);
        }
    };

    // Botão auxiliar caso precise abrir sem chamar
    const handleAbrirManual = (pId, aId) => {
        router.push(`/prontuario?atendimentoId=${aId}&pacienteId=${pId}`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
            {alert && <AlertMessage message={alert.message} variant={alert.variant} onClose={() => setAlert(null)} />}

            {/* CABEÇALHO DE CONTROLE */}
            <div className="bg-white p-6 rounded-xl shadow mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Fichas / Fila</h1>
                    <p className="text-gray-500 text-sm">Controle de chamada</p>
                </div>
                <div className="flex gap-2 items-end bg-blue-50 p-3 rounded border border-blue-100">
                    <div>
                        <label className="text-xs font-bold uppercase text-blue-900">ID Unidade</label>
                        <input 
                            type="number" 
                            value={unidadeId} onChange={e => setUnidadeId(e.target.value)} 
                            className="w-20 p-2 border rounded text-center font-bold"
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-blue-900">Sala (TV)</label>
                        <input 
                            type="text" 
                            value={localAtendimento} onChange={e => setLocalAtendimento(e.target.value)} 
                            className="w-40 p-2 border rounded"
                            placeholder="Cons. 1"
                        />
                    </div>
                    <button onClick={buscarFila} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        🔄 Atualizar
                    </button>
                </div>
            </div>

            {/* BOTÃO GIGANTE DE CHAMAR */}
            <div className="flex justify-center mb-10">
                <button
                    onClick={handleChamar}
                    disabled={isLoading || fila.length === 0}
                    className={`
                        px-10 py-5 rounded-full text-2xl font-black shadow-xl transition-all transform hover:scale-105
                        ${fila.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 ring-4 ring-green-200'}
                    `}
                >
                    {isLoading ? "⏳ PROCESSANDO..." : "📢 CHAMAR PRÓXIMO"}
                </button>
            </div>

            {/* VISUALIZAÇÃO DA FILA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fila.map((item, i) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border-l-8 border-blue-500 shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                            <span className="text-4xl font-black text-gray-700">{item.senha}</span>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Posição #{i+1}</span>
                        </div>
                        <h3 className="font-bold text-lg mt-2 truncate">{item.pacienteNome}</h3>
                        <p className="text-xs text-gray-400">Chegou às {new Date(item.dataHoraChegada).toLocaleTimeString()}</p>
                        
                        <button 
                            onClick={() => handleAbrirManual(item.pacienteId, item.id)}
                            className="mt-4 w-full py-2 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 text-sm"
                        >
                            Abrir Sem Chamar
                        </button>
                    </div>
                ))}
                {fila.length === 0 && !isLoading && (
                    <div className="col-span-3 text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                        Fila vazia. Clique em Atualizar.
                    </div>
                )}
            </div>
        </div>
    );
}