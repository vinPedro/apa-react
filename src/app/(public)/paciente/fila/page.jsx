"use client";

import { useState } from "react";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import ComboBox from "@/components/ComboBox";
import Botao from "@/components/Botao";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivBotoes from "@/components/DivBotoes";

import { useAuth } from "@/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//tem que mudar para receber da API
const instOptions = [
    { id: "INSTITUICAO1", nome: "Instituição 1" },
    { id: "INSTITUICAO2", nome: "Instituição 2" },
    { id: "INSTITUICAO3", nome: "Instituição 3" },
];

export default function CadastroPacienteFila() {

    const { isAuthenticated, profile } = useAuth();
      const router = useRouter();
    
      useEffect(() => {
        if (!isAuthenticated || profile !== "Paciente") {
          router.push("/");
        }
      }, [isAuthenticated, profile]);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [prioridade] = useState(false);

    //mudar para chamada da API
    const paciente = { nome: "Teste teset eytefgiuy tefdytwefdg ewjflhgelfireuh" }

    // Função de validação (simplificada)
    const validate = (formData) => {
        const newErrors = {};
        if (!formData.prioridade) newErrors.prioridade = "Prioridade é obrigatório.";
        if (!formData.unidadeSaudeId || formData.unidadeSaudeId === "") newErrors.unidadeSaudeId = "ID da UBS é obrigatório.";

        return newErrors;
    };

    const handleSubmit = {}

    return (
        <div className=" flex justify-center p-4">
            <DivFormulario>
                <Formulario
                    initialValues={{ unidadeSaudeId: "", prioridade: false }}
                    titulo={"Olá, " + paciente.nome}
                    subTitulo="Criação de ficha:"
                    onSubmit={(d) => console.log(d)}
                >
                    {({ formData, handleSelectChange }) => (
                        <>
                            <ComboBox
                                label="Unidade de Saúde (UBS):"
                                name="unidadeSaudeId" // MUDOU
                                options={instOptions.map(opt => opt.nome)}
                                value={instOptions.find(opt => opt.id === formData.unidadeSaudeId)?.nome || ""}
                                onChange={(name, value) => {
                                    const selectedId = instOptions.find(opt => opt.nome === value)?.id;
                                    handleSelectChange(name, selectedId);
                                }}
                                error={errors.unidadeSaudeId}
                                disabled={isLoading}
                            />

                            <ToggleSwitch label="Prioritario:" onChange={(valor) => handleSelectChange("prioridade", valor)} checked={formData.prioridade} />

                            <DivBotoes>
                                <Botao>
                                    Gerar Senha
                                </Botao>
                            </DivBotoes>

                        </>
                    )}

                </Formulario>
            </DivFormulario>
        </div>
    )
}