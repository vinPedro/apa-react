"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import ComboBox from "@/components/ComboBox";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react"; 
import { useRouter } from "next/navigation"; // Importar o router para redirecionar

// --- Mapeamento dos ENUMS do Backend ---
const sexoOptions = [
    { id: "FEMININO", nome: "Feminino" },
    { id: "MASCULINO", nome: "Masculino" },
    { id: "INDETERMINADO", nome: "Indeterminado / Não declarar" },
];

const racaOptions = [
    { id: "BRANCA", nome: "Branca" },
    { id: "PRETA", nome: "Preta" },
    { id: "PARDA", nome: "Parda" },
    { id: "AMARELA", nome: "Amarela" },
    { id: "INDIGENA", nome: "Indígena" },
    { id: "NAO_DECLARADA", nome: "Não Declarada" },
];
// --- Fim do Mapeamento ---


export default function TelaCadastro() {
    
    const router = useRouter(); // Para redirecionar após o sucesso
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null); // Erro vindo da API
    const [isLoading, setIsLoading] = useState(false);

    // DTO do Backend:
    const initialValues = {
        nomeCompleto: "",
        cns: "",
        cpf: "",
        dataNascimento: "",
        sexo: "", // Vai guardar o ID (ex: "FEMININO")
        racacor: "", // Vai guardar o ID (ex: "BRANCA")
        unidadeSaudeId: "", // ID da UBS
        logradouro: "",
        bairro: "",
        municipio: "",
        uf: "",
        telefone: "",
        email: "",
        senha: "",
    };

    // Função de validação (simplificada)
    const validate = (formData) => {
        const newErrors = {};
        if (!formData.nomeCompleto) newErrors.nomeCompleto = "Nome é obrigatório.";
        if (!formData.cns) newErrors.cns = "CNS é obrigatório.";
        if (!formData.cpf) newErrors.cpf = "CPF é obrigatório.";
        if (!formData.dataNascimento) newErrors.dataNascimento = "Data de Nascimento é obrigatória.";
        if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório.";
        if (!formData.racacor) newErrors.racacor = "Raça/Cor é obrigatório.";
        if (!formData.unidadeSaudeId) newErrors.unidadeSaudeId = "ID da UBS é obrigatório.";
        if (!formData.logradouro) newErrors.logradouro = "Logradouro é obrigatório.";
        if (!formData.bairro) newErrors.bairro = "Bairro é obrigatório.";
        if (!formData.municipio) newErrors.municipio = "Município é obrigatório.";
        if (!formData.uf) newErrors.uf = "UF é obrigatório.";
        if (!formData.email) newErrors.email = "E-mail é obrigatório.";
        if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
        
        return newErrors;
    };

    const handleSubmit = async (data) => {
        const validationErrors = validate(data);
        setErrors(validationErrors); 
        setApiError(null);

        if (Object.keys(validationErrors).length > 0) {
            return; // Para se houver erros de formulário
        }

        setIsLoading(true);

        try {
            // O PacienteService espera um Long no ID da UBS e no Telefone
            //
            // Nota: O DTO PacienteRequestDTO tem telefone como String, mas a entidade Paciente tem como int. 
            // Vamos enviar como String, a API deve tratar. Vamos converter só o ID da UBS.
            const dataToSubmit = {
                ...data,
                unidadeSaudeId: parseInt(data.unidadeSaudeId, 10),
            };

            const response = await fetch("http://localhost:8080/api/pacientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const erroData = await response.json();
                // Ex: "Email já cadastrado para outro usuário."
                throw new Error(erroData.message || `Erro ${response.status}`);
            }

            // Sucesso!
            alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
            router.push("/"); // Redireciona para a home (login)

        } catch (err) {
            console.error("Erro no cadastro:", err);
            setApiError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            <DivFormulario maxWidth={700} minWidth={350}>
                <Formulario
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    titulo="Cadastro do Paciente:"
                >
                    {({ formData, handleChange, handleSelectChange }) => (
                        <>
                            {apiError && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                                    <strong>Falha no cadastro:</strong> {apiError}
                                </div>
                            )}

                            <Campo 
                                label="Nome Completo:"
                                placeholder="Nome Completo"
                                name="nomeCompleto" // MUDOU
                                value={formData.nomeCompleto}
                                type="text"
                                onChange={handleChange}
                                error={errors.nomeCompleto}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="CNS:"
                                placeholder="Cartão nacional de saúde (só números)"
                                name="cns"
                                value={formData.cns}
                                type="number"
                                onChange={handleChange}
                                error={errors.cns}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="CPF:"
                                placeholder="CPF (só números)"
                                name="cpf"
                                value={formData.cpf}
                                type="number"
                                onChange={handleChange}
                                error={errors.cpf}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="Data de Nascimento:"
                                name="dataNascimento" // MUDOU
                                value={formData.dataNascimento}
                                type="date"
                                onChange={handleChange}
                                error={errors.dataNascimento}
                                disabled={isLoading}
                            />

                            <ComboBox
                                label="Sexo:"
                                name="sexo"
                                // Mapeia o array de objetos para o ComboBox
                                options={sexoOptions.map(opt => opt.nome)}
                                value={sexoOptions.find(opt => opt.id === formData.sexo)?.nome || ""}
                                // Ao mudar, salva o ID ("FEMININO", "MASCULINO"...)
                                onChange={(name, value) => {
                                    const selectedId = sexoOptions.find(opt => opt.nome === value)?.id;
                                    handleSelectChange(name, selectedId);
                                }}
                                error={errors.sexo}
                                disabled={isLoading}
                            />

                            <ComboBox
                                label="Raça/Cor:"
                                name="racacor" // MUDOU
                                options={racaOptions.map(opt => opt.nome)}
                                value={racaOptions.find(opt => opt.id === formData.racacor)?.nome || ""}
                                onChange={(name, value) => {
                                    const selectedId = racaOptions.find(opt => opt.nome === value)?.id;
                                    handleSelectChange(name, selectedId);
                                }}
                                error={errors.racacor}
                                disabled={isLoading}
                            />

                            {/* --- CAMPOS DE ENDEREÇO SEPARADOS --- */}
                            <Campo 
                                label="ID da UBS (Unidade de Saúde):"
                                placeholder="Digite o ID da sua UBS (Ex: 1)"
                                name="unidadeSaudeId" // MUDOU
                                value={formData.unidadeSaudeId}
                                type="number"
                                onChange={handleChange}
                                error={errors.unidadeSaudeId}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="Logradouro (Rua, Av, etc):"
                                placeholder="Ex: Rua Principal, 123"
                                name="logradouro" // MUDOU
                                value={formData.logradouro}
                                onChange={handleChange}
                                error={errors.logradouro}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="Bairro:"
                                placeholder="Ex: Centro"
                                name="bairro" // MUDOU
                                value={formData.bairro}
                                onChange={handleChange}
                                error={errors.bairro}
                                disabled={isLoading}
                            />
                            <Campo 
                                label="Município:"
                                placeholder="Ex: João Pessoa"
                                name="municipio" // MUDOU
                                value={formData.municipio}
                                onChange={handleChange}
                                error={errors.municipio}
                                disabled={isLoading}
                            />
                            <Campo 
                                label="UF (Sigla):"
                                placeholder="Ex: PB"
                                name="uf" // MUDOU
                                value={formData.uf}
                                maxLength={2}
                                onChange={handleChange}
                                error={errors.uf}
                                disabled={isLoading}
                            />
                            {/* --- FIM DOS CAMPOS DE ENDEREÇO --- */}


                            <Campo 
                                label="Telefone:"
                                placeholder="Número com DDD (só números)"
                                name="telefone"
                                value={formData.telefone}
                                type="number"
                                onChange={handleChange}
                                error={errors.telefone}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="E-mail (Será seu login):"
                                placeholder="email@gmail.com"
                                name="email"
                                value={formData.email}
                                type="email"
                                onChange={handleChange}
                                error={errors.email}
                                disabled={isLoading}
                            />

                            <Campo 
                                label="Senha:"
                                placeholder="Senha (mínimo 8 caracteres)"
                                name="senha"
                                value={formData.senha}
                                type="password"
                                onChange={handleChange}
                                error={errors.senha}
                                disabled={isLoading}
                            />

                            <DivBotoes>
                                <Link href="/" className="w-full max-w-[170px]">
                                    <Botao
                                        background="var(--color-botao-terceira)"
                                        color="var(--color-text-botao-secundaria)"
                                        maximo={170}
                                        type="button"
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </Botao>
                                </Link>

                                <div className="w-full max-w-[170px]">
                                    <Botao type="submit" disabled={isLoading}>
                                        {isLoading ? "Salvando..." : "Salvar"}
                                    </Botao>
                                </div>
                            </DivBotoes>
                        </>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}