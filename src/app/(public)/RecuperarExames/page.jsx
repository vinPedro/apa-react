"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";

import DivFormulario from "@/components/DivFormulario";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import FieldGroup from "@/components/FieldGroup";
import AlertMessage from "@/components/AlertMessage";

function MeusExamesUX() {
    const { token, user } = useAuth(); // 'user' deve conter os dados do login (id, cpf, etc)
    const router = useRouter();
    const searchParams = useSearchParams();

    // Prioriza o ID que vem da URL (fluxo do médico) ou do usuário logado (fluxo do paciente)
    const pacienteId = searchParams.get("pacienteId") || user?.id;
    const pacienteNome = searchParams.get("nome") || user?.nome || "Paciente";

    const [exames, setExames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    /* ============================================================
       BACK-END: BUSCA AUTOMÁTICA DE EXAMES
    ============================================================ */
    useEffect(() => {
        const carregarExames = async () => {
            if (!pacienteId || !token) {
                setLoading(false);
                return;
            }

            try {
                /* BACK-END: Altere a URL abaixo para o seu endpoint de listagem.
                   Exemplo: /api/exames/paciente/{id} ou /api/exames/meus-exames
                */
               /* const response = await fetch(``, {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });*/

                if (!response.ok) throw new Error("Não foi possível recuperar o histórico de exames.");

                const dados = await response.json();
                setExames(dados);
            } catch (error) {
                setAlert({ message: error.message, variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        carregarExames();
    }, [pacienteId, token]);

    return (
        <DivFormulario maxWidth={900}>
            <div className="w-full mx-auto px-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        📋 Histórico de Exames
                    </h1>
                    <p className="text-gray-500">
                        Exibindo registros de: <strong>{pacienteNome}</strong>
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
                                                ID #{ex.id}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                📅 {new Date(ex.dataSolicitacao).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 uppercase">
                                            {ex.descricaoExame}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2 italic">
                                            <span className="font-medium not-italic text-gray-500">Motivo:</span> {ex.motivoSolicitacao}
                                        </p>
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