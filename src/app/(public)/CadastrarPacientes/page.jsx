"use client";

import { useState, useEffect } from "react";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import ComboBox from "@/components/ComboBox";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import { useAuth } from "@/AuthContext";
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

export default function CadastrarPacientesPage() {
    const { token } = useAuth();
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [unidadesSaude, setUnidadesSaude] = useState([]);

    // Busca as UBS do backend Java
    useEffect(() => {
        const fetchUBS = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/unidades", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Falha ao buscar Unidades de Saúde");
                const data = await response.json();
                setUnidadesSaude(data);
            } catch (err) {
                setAlert({ message: "Erro ao carregar UBS.", variant: "error" });
            }
        };
        fetchUBS();
    }, [token]);

    const initialValues = {
        nomeCompleto: "", cns: "", cpf: "", dataNascimento: "",
        sexo: "", racacor: "", unidadeSaudeId: "",
        cep: "", logradouro: "", bairro: "", municipio: "", uf: "",
        telefone: "", email: "", senha: "",
    };

    const validate = (formData) => {
        const newErrors = {};
        if (!formData.nomeCompleto) newErrors.nomeCompleto = "Obrigatório.";
        if (!formData.cpf) newErrors.cpf = "CPF é obrigatório para o login.";
        if (!formData.email) newErrors.email = "E-mail é obrigatório.";
        return newErrors;
    };

    const handleSubmit = async (data) => {
        const validationErrors = validate(data);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setAlert({ message: "Preencha os campos obrigatórios.", variant: "warning" });
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
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) throw new Error("Erro ao cadastrar paciente.");
            setAlert({ message: "Paciente cadastrado com sucesso!", variant: "success" });
        } catch (err) {
            setAlert({ message: err.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            {alert && <AlertMessage message={alert.message} variant={alert.variant} onClose={() => setAlert(null)} />}

            <DivFormulario maxWidth={800} minWidth={350}>
                <Formulario initialValues={initialValues} onSubmit={handleSubmit} titulo="Cadastrar Novo Paciente">
                    {(props) => (
                        <FormularioInterno 
                            {...props} 
                            isLoading={isLoading} 
                            errors={errors} 
                            setAlert={setAlert}
                            unidadesSaude={unidadesSaude}
                        />
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}

function FormularioInterno({ formData, handleChange, handleSelectChange, setFormData, isLoading, errors, setAlert, unidadesSaude }) {
    const { buscarCep, loadingCep, camposTravados } = useViaCep(setFormData, setAlert);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Campo label="Nome Completo:" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} error={errors.nomeCompleto} disabled={isLoading} />
                </div>
                {/* E-mail movido para cima */}
                <Campo label="E-mail:" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} placeholder="exemplo@email.com" />
                <Campo label="CNS:" name="cns" value={formData.cns} onChange={handleChange} maxLength={15} disabled={isLoading} placeholder="XXXXX XXXXX XXXXX XXXXX" />
                <Campo label="Data Nascimento:" name="dataNascimento" value={formData.dataNascimento} type="date" onChange={handleChange} disabled={isLoading} />
                <Campo type="tel" maxLength={11} label="Telefone:" name="telefone" value={formData.telefone} onChange={handleChange} disabled={isLoading} placeholder="83999999999" />
                
                <ComboBox label="Sexo:" value={formData.sexo} onChange={(v) => handleSelectChange("sexo", v)} options={sexoOptions.map(op => ({ value: op.id, text: op.nome }))} disabled={isLoading} />
                <ComboBox label="Raça/Cor:" value={formData.racacor} onChange={(v) => handleSelectChange("racacor", v)} options={racaOptions.map(op => ({ value: op.id, text: op.nome }))} disabled={isLoading} />
            </div>

            <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Campo label={loadingCep ? "..." : "CEP"} name="cep" value={formData.cep} onChange={handleChange} onBlur={(e) => buscarCep(e.target.value)} maxLength={9} disabled={isLoading} />
                    <div className="md:col-span-2">
                        <Campo label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} disabled={isLoading || camposTravados.logradouro} />
                    </div>
                    <Campo label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} disabled={isLoading || camposTravados.bairro} />
                    <Campo label="Município" name="municipio" value={formData.municipio} onChange={handleChange} disabled={isLoading || camposTravados.municipio} />
                    <Campo label="UF" name="uf" value={formData.uf} maxLength={2} onChange={handleChange} disabled={isLoading || camposTravados.uf} />
                </div>
            </div>

            <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Dados de Acesso & Unidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CPF movido para baixo como Login */}
                    <Campo label="CPF (Login):" name="cpf" maxLength={11} value={formData.cpf} onChange={handleChange} error={errors.cpf} disabled={isLoading} placeholder="Apenas números" />
                    <Campo label="Senha:" name="senha" type="password" value={formData.senha} onChange={handleChange} disabled={isLoading} />
                    <div className="md:col-span-2">
                        <ComboBox
                            label="UBS:"
                            value={formData.unidadeSaudeId}
                            onChange={(v) => handleSelectChange("unidadeSaudeId", v)} 
                            options={unidadesSaude.map(op => ({ value: op.id, text: op.nome }))}
                        />
                    </div>
                </div>
            </div>

            <DivBotoes>
                <div className="w-full max-w-[200px]">
                    <Botao type="submit" disabled={isLoading}>{isLoading ? "Cadastrando..." : "Cadastrar Paciente"}</Botao>
                </div>
            </DivBotoes>
        </>
    );
}