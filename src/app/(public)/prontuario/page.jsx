"use client"

import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivFormulario from "@/components/DivFormulario";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import Textarea from "@/components/Textarea";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode";


export default function CadastroProntuario() {

    const { token, isAuthenticated, profile } = useAuth();
    const router = useRouter();

    // --- 1. Proteção de Rota ---
    useEffect(() => {
        if (!isAuthenticated || profile !== "Admin") {
            router.push("/");
            // router.push("/"); // Descomente para forçar o redirect se não logado
        }
    }, [isAuthenticated, profile, router]);

    const paciente = { nome: "Teste", idade: 11, sinais: "10-11", exaFisico: "kirpijrgergiv", queixa: "yuhgerou8ivherw8ot7uvhtroiughtiugthriughtr" || "" }

    const handleSubmit = (formData) => { // evita recarregar a página
        console.log("FORM DATA:", formData);
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            <DivFormulario>
                <Formulario
                    initialValues={{ diagnostico: "", prescricao: "", exaFisico: "", queixa: paciente.queixa || "", historico: "", sair: false }}
                    // Exibe o nome do paciente carregado ou "Carregando..."
                    titulo={"Prontuário:"}
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleSelectChange, handleChange }) => (
                        <>
                            <FieldGroup title="Dados do Paciente">
                                <p><strong>Nome:</strong> {paciente.nome}</p>
                                <p><strong>Idade:</strong> {paciente.idade}</p>
                                <p><strong>Sinais Vitais:</strong> {paciente.sinais}</p>
                            </FieldGroup>

                            <FieldGroup title="Anamnese">

                                <Textarea
                                    label="Queixa Principal: "
                                    value={formData.queixa}
                                    name="queixa"
                                    onChange={handleChange}
                                    placeholder="Sintomas do paciente: " />


                                <Textarea
                                    label="Histórico da Doença: "
                                    value={formData.historico}
                                    name="historico"
                                    onChange={handleChange}
                                    placeholder="Quando ocorreu a doença: " />


                            </FieldGroup>

                            <Textarea
                                label="Exame Físico: "
                                value={formData.exaFisico}
                                name="exaFisico"
                                onChange={handleChange}
                                placeholder="Estado físico do paciente" />

                            <Textarea
                                label="Diagnóstico: "
                                value={formData.diagnostico}
                                name="diagnostico"
                                onChange={handleChange}
                                placeholder="CID ou Descrição*" />

                            <Textarea
                                label="Prescrição: "
                                value={formData.prescricao}
                                name="prescricao"
                                onChange={handleChange}
                                placeholder="Medicamentos" />


                            <div className="py-2">
                                <ToggleSwitch
                                    label="Sair após este atendimento:"
                                    id="sair-switch"
                                    name="sair"
                                    checked={formData.sair}
                                    onChange={(valor) => handleSelectChange("sair", valor)}
                                />
                            </div>

                            <DivBotoes>
                                <Botao
                                    type="submit"
                                >
                                    Finalizar Atendimento
                                </Botao>
                            </DivBotoes>

                        </>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    )
}