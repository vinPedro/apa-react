"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode"; 

import DivFormulario from "@/components/DivFormulario";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import FieldGroup from "@/components/FieldGroup";
import AlertMessage from "@/components/AlertMessage";

function MeusExamesUX() {
    const { token, profile } = useAuth(); 
    const router = useRouter();
    const searchParams = useSearchParams();

    // ID vindo da URL (caso seja médico visualizando)
    const pacienteIdURL = searchParams.get("pacienteId");
    // Nome vindo da URL para exibição
    const pacienteNomeURL = searchParams.get("nome");

    const [exames, setExames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [nomePacienteDisplay, setNomePacienteDisplay] = useState(pacienteNomeURL || "Paciente");

    useEffect(() => {
        const carregarDados = async () => {
            if (!token) return;

            setLoading(true);
            try {
                let cpfParaBusca = "";

                // CENÁRIO 1: Médico acessando pelo ID (URL)
                if (pacienteIdURL) {
                    const resPaciente = await fetch(`http://localhost:8080/api/pacientes/${pacienteIdURL}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (!resPaciente.ok) {
                        throw new Error("Erro ao identificar o paciente.");
                    }
                    
                    const dadosPaciente = await resPaciente.json();
                    cpfParaBusca = dadosPaciente.cpf; 
                    
                    if (!pacienteNomeURL && dadosPaciente.nomeCompleto) {
                        setNomePacienteDisplay(dadosPaciente.nomeCompleto);
                    }

                } 
                // CENÁRIO 2: Paciente acessando seus próprios exames
                else if (profile === "Paciente") {
                    const decoded = jwtDecode(token);
                    cpfParaBusca = decoded.sub; 
                } else {
                    setLoading(false);
                    return;
                }

                if (!cpfParaBusca) {
                    throw new Error("CPF não identificado para busca.");
                }

                // Busca os exames
                const response = await fetch(`http://localhost:8080/api/exames/paciente/${cpfParaBusca}`, {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) throw new Error("Não foi possível recuperar o histórico de exames.");

                const dados = await response.json();
                setExames(dados);

            } catch (error) {
                console.error(error);
                setAlert({ message: error.message, variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [pacienteIdURL, token, profile, pacienteNomeURL]);

    return (
        <DivFormulario maxWidth={900}>
            <div className="w-full mx-auto px-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        📋 Histórico de Exames
                    </h1>
                    <p className="text-gray-500">
                        Exibindo registros de: <strong>{nomePacienteDisplay}</strong>
                    </p>
                </header>

                {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

                <FieldGroup title="Exames Solicitados">
                    {loading ? (
                        <div className="flex flex-col items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <p className="text-gray-500 italic">Consultando base de dados...</p>
                        </div>
                    ) : exames.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                            <p className="text-gray-400 italic">Nenhum exame encontrado para este histórico.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {exames.map((ex) => (
                                <div 
                                    key={ex.id} 
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                Protocolo #{ex.id}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                📅 {ex.dataSolicitacao ? new Date(ex.dataSolicitacao).toLocaleDateString() : 'Data N/A'}
                                            </span>
                                            {/* Exibição do Status */}
                                            <span className={`text-xs px-2 py-0.5 rounded border ${
                                                ex.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                                {ex.status || 'STATUS N/A'}
                                            </span>
                                        </div>

                                        {/* Correção: Usando 'tipoExame' ao invés de 'descricaoExame' */}
                                        <h3 className="text-lg font-semibold text-gray-800 uppercase">
                                            {ex.tipoExame || 'Exame Sem Nome'}
                                        </h3>

                                        {/* Correção: Usando 'descricao' ao invés de 'motivoSolicitacao' */}
                                        <p className="text-sm text-gray-600 mt-2 italic">
                                            <span className="font-medium not-italic text-gray-500">Motivo/Detalhes:</span> {ex.descricao || 'Sem observações.'}
                                        </p>

                                        {/* Exibição da Prioridade se existir */}
                                        {ex.prioridade && (
                                            <p className="text-xs text-red-500 font-bold mt-1 uppercase">
                                                Prioridade: {ex.prioridade}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Botao 
                                            variant="secondary" 
                                            className="flex-1 md:flex-none text-xs"
                                            onClick={() => window.open(`http://localhost:8080/api/exames/${ex.id}/pdf`, '_blank')}
                                        >
                                            📄 Ver Guia
                                        </Botao>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </FieldGroup>

                <DivBotoes className="mt-10">
                    <Botao onClick={() => router.back()} variant="secondary">
                        ⬅️ Voltar
                    </Botao>
                </DivBotoes>
            </div>
        </DivFormulario>
    );
}

export default function PaginaMeusExames() {
    return (
        <Suspense fallback={<p className="text-center py-10">Carregando...</p>}>
            <MeusExamesUX />
        </Suspense>
    );
}