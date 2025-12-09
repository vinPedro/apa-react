"use client"

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import { MultiSelectGroup, MultiSelectOption } from "@/components/MultiSelectGroup";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivBotoes from "@/components/DivBotoes";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";


export default function AgendaProfissional() {

     const { token, isAuthenticated, profile } = useAuth();
        const router = useRouter();
    
        // --- 1. Proteção de Rota ---
        useEffect(() => {
            if (!isAuthenticated || profile !== "Admin") {
                router.push("/");
                // router.push("/"); // Descomente para forçar o redirect se não logado
            }
        }, [isAuthenticated, profile, router]);

    function handleDiasChange(novosDias, handleSelectChange) {
        handleSelectChange("dias", novosDias);
    }


    const handleSubmit = (formData) => { // evita recarregar a página
        console.log("FORM DATA:", formData);
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            <DivFormulario>
                <Formulario
                    initialValues={{ inicio: "", fim: "", dias: [], disponivel: false }}
                    titulo="Agenda: "
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleChange, handleSelectChange }) => (
                        <>
                            <FieldGroup title="Dias da semana">
                                <MultiSelectGroup values={formData.dias} onChange={(novosDias) => handleDiasChange(novosDias, handleSelectChange)}>
                                    <MultiSelectOption value="domingo">Domingo</MultiSelectOption>
                                    <MultiSelectOption value="segunda">Segunda</MultiSelectOption>
                                    <MultiSelectOption value="terca">Terça</MultiSelectOption>
                                    <MultiSelectOption value="quarta">Quarta</MultiSelectOption>
                                    <MultiSelectOption value="quinta">Quinta</MultiSelectOption>
                                    <MultiSelectOption value="sexta">Sexta</MultiSelectOption>
                                    <MultiSelectOption value="sabado">Sábado</MultiSelectOption>
                                </MultiSelectGroup>
                            </FieldGroup>

                            <FieldGroup>
                                <Campo
                                    type="time"
                                    label="Início"
                                    name="inicio"
                                    value={formData.inicio}
                                    onChange={handleChange}
                                />

                                <Campo
                                    type="time"
                                    label="Fim"
                                    name="fim"
                                    value={formData.fim}
                                    onChange={handleChange}
                                />
                            </FieldGroup>

                            <div className="py-2">
                                <ToggleSwitch
                                    label="Disponivel: "
                                    id="disponivel-switch"
                                    checked={formData.disponivel}
                                    value={formData.disponivel}
                                    onChange={(valor) => handleSelectChange("disponivel", valor)}
                                />
                            </div>

                            <DivBotoes>
                                <Botao
                                    type="submit"
                                >
                                    Salvar
                                </Botao>
                            </DivBotoes>

                        </>)}
                </Formulario>
            </DivFormulario>
        </div>
    )
}