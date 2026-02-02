"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";

import DivFormulario from "@/components/DivFormulario";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import Textarea from "@/components/Textarea";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import AlertMessage from "@/components/AlertMessage";

function SolicitarExameUX() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Captura dados do paciente da URL (ex: ?id=1&nome=João)
    const pacienteId = searchParams.get("pacienteId");
    const pacienteNome = searchParams.get("nome") || "Paciente";

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const initialFormData = {
        descricaoExame: "",
        motivoSolicitacao: "",
    };

    /* ======================
       PROTEÇÃO DE ROTA
    ====================== */
    useEffect(() => {
        if (!isAuthenticated) router.push("/");
    }, [isAuthenticated, router]);

    /* ======================
       SALVAR EXAME
    ====================== */
    const handleSalvar = async (formData) => {
        if (!pacienteId) {
            setAlert({ message: "Erro: Paciente não identificado.", variant: "error" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/exames", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pacienteId,
                    ...formData,
                    dataSolicitacao: new Date().toISOString(),
                }),
            });

            if (!response.ok) throw new Error("Erro ao salvar solicitação de exame.");

            setAlert({ message: "Solicitação de exame salva com sucesso!", variant: "success" });
            
            // Redireciona de volta após um curto delay
            setTimeout(() => {
                router.back();
            }, 2000);

        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DivFormulario maxWidth={800}>
            <div className="w-full mx-auto px-8">
                {alert && (
                    <AlertMessage {...alert} onClose={() => setAlert(null)} />
                )}

                <Formulario
                    initialValues={initialFormData}
                    titulo={`🧪 Solicitar Exame • ${pacienteNome}`}
                    onSubmit={handleSalvar}
                >
                    {({ formData, handleChange }) => (
                        <div className="space-y-8">
                            
                            <FieldGroup title="📋 Detalhes do Exame">
                                <Textarea
                                    name="descricaoExame"
                                    label="Descrição do Exame"
                                    placeholder="Ex: Hemograma completo, Creatinina, TSH..."
                                    value={formData.descricaoExame}
                                    onChange={handleChange}
                                    required
                                />
                                <Textarea
                                    name="motivoSolicitacao"
                                    label="Motivo da Solicitação"
                                    placeholder="Descreva a justificativa clínica..."
                                    value={formData.motivoSolicitacao}
                                    onChange={handleChange}
                                    required
                                />
                            </FieldGroup>

                            <DivBotoes className="justify-end gap-4 mt-8">
                                <Botao 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    ⬅️ Voltar
                                </Botao>
                                <Botao 
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? "Salvando..." : "💾 Salvar Solicitação"}
                                </Botao>
                            </DivBotoes>
                        </div>
                    )}
                </Formulario>
            </div>
        </DivFormulario>
    );
}

/* =============================
    EXPORT COM SUSPENSE
============================= */
export default function SolicitarExamePage() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Carregando formulário...</p>}>
            <SolicitarExameUX />
        </Suspense>
    );
}