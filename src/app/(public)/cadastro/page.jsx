"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import ComboBox from "@/components/ComboBox";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/AlertMessage";
import { useViaCep } from "@/hooks/useViaCep"; 

const sexoOptions = [
    { id: "FEMININO", nome: "Feminino" },
    { id: "MASCULINO", nome: "Masculino" },
    { id: "INDETERMINADO", nome: "Indeterminado" },
];

const racaOptions = [
    { id: "BRANCA", nome: "Branca" },
    { id: "PRETA", nome: "Preta" },
    { id: "PARDA", nome: "Parda" },
    { id: "AMARELA", nome: "Amarela" },
    { id: "INDIGENA", nome: "Indígena" },
    { id: "NAO_DECLARADA", nome: "Não Declarada" },
];

export default function TelaCadastro() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        nomeCompleto: "", cns: "", cpf: "", dataNascimento: "",
        sexo: "", racacor: "", unidadeSaudeId: "",
        cep: "", 
        logradouro: "", bairro: "", municipio: "", uf: "",
        telefone: "", email: "", senha: "",
    };

    const validate = (formData) => {
        const newErrors = {};
        if (!formData.nomeCompleto) newErrors.nomeCompleto = "Obrigatório.";
        if (!formData.cpf) newErrors.cpf = "Obrigatório.";
        if (!formData.email) newErrors.email = "Obrigatório.";
        if (!formData.senha) newErrors.senha = "Obrigatório.";
        return newErrors;
    };

    const handleSubmit = async (data) => {
        const validationErrors = validate(data);
        setErrors(validationErrors);
        setAlert(null);

        if (Object.keys(validationErrors).length > 0) {
            setAlert({ message: "Verifique os campos obrigatórios.", variant: "warning" });
            return;
        }

        setIsLoading(true);

        try {
            const dataToSubmit = {
                ...data,
                unidadeSaudeId: parseInt(data.unidadeSaudeId, 10),
            };

            const response = await fetch("/api/pacientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro ${response.status}`);
            }

            setAlert({ message: "Cadastro realizado! Redirecionando...", variant: "success" });
            setTimeout(() => router.push("/"), 2500);

        } catch (err) {
            setAlert({ message: err.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <DivFormulario maxWidth={700} minWidth={350}>
                <Formulario
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    titulo="Cadastro do Paciente"
                >
                    {(props) => (
                        <FormularioInterno 
                            {...props} 
                            isLoading={isLoading} 
                            errors={errors} 
                            setAlert={setAlert} // <--- PASSANDO O SETALERT AQUI
                        />
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}

// Componente separado para isolar a lógica do Hook de Endereço
function FormularioInterno({ formData, handleChange, handleSelectChange, setFormData, isLoading, errors, setAlert }) {
    // PASSANDO setAlert PARA O HOOK AQUI
    const { buscarCep, loadingCep, camposTravados } = useViaCep(setFormData, setAlert);

    return (
        <>
            <Campo label="Nome Completo:" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} error={errors.nomeCompleto} disabled={isLoading} />
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Campo label="CNS:" name="cns" value={formData.cns} onChange={handleChange} type="number" disabled={isLoading} />
                <Campo label="CPF:" name="cpf" value={formData.cpf} onChange={handleChange} type="number" error={errors.cpf} disabled={isLoading} />
            </div>

            <Campo label="Data Nascimento:" name="dataNascimento" value={formData.dataNascimento} type="date" onChange={handleChange} disabled={isLoading} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ComboBox label="Sexo:" value={formData.sexo} onChange={(v) => handleSelectChange("sexo", v)} options={sexoOptions.map(op => ({ value: op.id, text: op.nome }))} disabled={isLoading} />
                <ComboBox label="Raça/Cor:" value={formData.racacor} onChange={(v) => handleSelectChange("racacor", v)} options={racaOptions.map(op => ({ value: op.id, text: op.nome }))} disabled={isLoading} />
            </div>

            <Campo label="ID da UBS:" name="unidadeSaudeId" value={formData.unidadeSaudeId} type="number" onChange={handleChange} disabled={isLoading} />

            {/* --- BLOCO DE ENDEREÇO --- */}
            <div className="border-t pt-4 mt-4">
                <h3 className="text-gray-700 font-semibold mb-3">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                        <Campo 
                            label={loadingCep ? "..." : "CEP"} 
                            name="cep" 
                            value={formData.cep} 
                            onChange={handleChange} 
                            onBlur={(e) => buscarCep(e.target.value)} 
                            maxLength={9} 
                            disabled={isLoading} 
                        />
                    </div>
                    <div className="sm:col-span-9">
                        <Campo label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} disabled={isLoading || camposTravados.logradouro} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-3">
                    <div className="sm:col-span-5">
                        <Campo label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} disabled={isLoading || camposTravados.bairro} />
                    </div>
                    <div className="sm:col-span-5">
                        <Campo label="Município" name="municipio" value={formData.municipio} onChange={handleChange} disabled={isLoading || camposTravados.municipio} />
                    </div>
                    <div className="sm:col-span-2">
                        <Campo label="UF" name="uf" value={formData.uf} maxLength={2} onChange={handleChange} disabled={isLoading || camposTravados.uf} />
                    </div>
                </div>
            </div>
            {/* ------------------------- */}

            <Campo label="Telefone:" name="telefone" value={formData.telefone} onChange={handleChange} disabled={isLoading} />
            <Campo label="E-mail:" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} />
            <Campo label="Senha:" name="senha" type="password" value={formData.senha} onChange={handleChange} error={errors.senha} disabled={isLoading} />

            <DivBotoes>
                <Link href="/" className="w-full max-w-[170px]">
                    <Botao background="var(--color-botao-terceira)" color="var(--color-text-botao-secundaria)" type="button" disabled={isLoading}>Cancelar</Botao>
                </Link>
                <div className="w-full max-w-[170px]">
                    <Botao type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Botao>
                </div>
            </DivBotoes>
        </>
    );
}