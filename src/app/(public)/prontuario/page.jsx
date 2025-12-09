"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivFormulario from "@/components/DivFormulario";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import Textarea from "@/components/Textarea";
import Campo from "@/components/Campo"; // Importando Campo para o atestado
import AlertMessage from "@/components/AlertMessage";

function ProntuarioContent() {
    const { token, isAuthenticated, profile } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Dados da URL
    const atendimentoId = searchParams.get("atendimentoId");
    const pacienteNome = searchParams.get("paciente") || "Paciente não identificado";

    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Proteção de Rota ---
    useEffect(() => {
        // Ajuste conforme o perfil exato do seu AuthContext ("ProfissionaldeSaude" ou "admin")
        if (!isAuthenticated) { 
            router.push("/");
        }
    }, [isAuthenticated, profile, router]);

    // --- Envio do Formulário ---
    const handleSubmit = async (formData) => {
        setAlert(null);

        if (!atendimentoId) {
            setAlert({ message: "Erro: Atendimento não identificado (ID ausente).", variant: "error" });
            return;
        }

        setIsLoading(true);

        // Mapeamento para o DTO do Java (ProntuarioRequestDTO)
        const payload = {
            atendimentoId: parseInt(atendimentoId, 10),
            queixaPrincipal: formData.queixa,
            historicoDoenca: formData.historico,
            exameFisico: formData.exaFisico,
            diagnostico: formData.diagnostico,
            prescricaoMedica: formData.prescricao,
            examesSolicitados: formData.exames, // Novo campo
            atestadoDias: formData.atestado ? parseInt(formData.atestado, 10) : 0, // Novo campo
            mudarStatusMedicoParaIndisponivel: formData.sair // Boolean
        };

        try {
            const response = await fetch("http://localhost:8080/api/prontuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro ao finalizar atendimento.");
            }

            setAlert({ message: "Atendimento finalizado com sucesso!", variant: "success" });

            // Redireciona de volta para a lista/painel do profissional
            setTimeout(() => {
                router.push("/ProfissionalDeSaude"); 
            }, 2000);

        } catch (error) {
            console.error("Erro ao salvar prontuário:", error);
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4 bg-gray-50">
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <DivFormulario maxWidth={800}>
                <Formulario
                    initialValues={{ 
                        queixa: "", 
                        historico: "", 
                        exaFisico: "", 
                        diagnostico: "", 
                        prescricao: "", 
                        exames: "",
                        atestado: "",
                        sair: false 
                    }}
                    titulo={`Atendimento Médico`}
                    subTitulo={`Paciente: ${pacienteNome}`}
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleSelectChange, handleChange }) => (
                        <>
                            {/* Seção 1: Anamnese */}
                            <FieldGroup title="1. Anamnese">
                                <Textarea
                                    label="Queixa Principal *"
                                    value={formData.queixa}
                                    name="queixa"
                                    onChange={handleChange}
                                    placeholder="O que o paciente está sentindo?" 
                                    rows={2}
                                />
                                <Textarea
                                    label="Histórico da Doença"
                                    value={formData.historico}
                                    name="historico"
                                    onChange={handleChange}
                                    placeholder="Histórico pregresso, alergias, comorbidades..." 
                                    rows={3}
                                />
                            </FieldGroup>

                            {/* Seção 2: Exame Físico */}
                            <FieldGroup title="2. Exame Físico">
                                <Textarea
                                    value={formData.exaFisico}
                                    name="exaFisico"
                                    onChange={handleChange}
                                    placeholder="Descreva os achados do exame físico..." 
                                    rows={3}
                                />
                            </FieldGroup>

                            {/* Seção 3: Conduta */}
                            <FieldGroup title="3. Conduta Médica">
                                <Textarea
                                    label="Diagnóstico (CID ou Descrição) *"
                                    value={formData.diagnostico}
                                    name="diagnostico"
                                    onChange={handleChange}
                                    placeholder="Conclusão diagnóstica" 
                                    rows={2}
                                />
                                <Textarea
                                    label="Prescrição Médica"
                                    value={formData.prescricao}
                                    name="prescricao"
                                    onChange={handleChange}
                                    placeholder="Medicamentos e posologia" 
                                    rows={3}
                                />
                                <Textarea
                                    label="Solicitação de Exames"
                                    value={formData.exames}
                                    name="exames"
                                    onChange={handleChange}
                                    placeholder="Exames laboratoriais ou de imagem" 
                                    rows={2}
                                />
                                <div className="w-1/3">
                                    <Campo 
                                        label="Atestado (Dias)"
                                        type="number"
                                        name="atestado"
                                        value={formData.atestado}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                            </FieldGroup>

                            {/* Opções Finais */}
                            <div className="py-4 px-2 bg-gray-100 rounded-lg mt-4">
                                <ToggleSwitch
                                    label="Definir meu status como INDISPONÍVEL após este atendimento?"
                                    id="sair-switch"
                                    checked={formData.sair}
                                    onChange={(valor) => handleSelectChange("sair", valor)}
                                />
                            </div>

                            <DivBotoes>
                                <Botao 
                                    type="button" 
                                    background="var(--color-botao-terceira)" 
                                    color="#333"
                                    onClick={() => router.back()}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Botao>
                                <Botao type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Finalizar Atendimento"}
                                </Botao>
                            </DivBotoes>
                        </>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}

export default function CadastroProntuarioPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Carregando prontuário...</div>}>
            <ProntuarioContent />
        </Suspense>
    );
}