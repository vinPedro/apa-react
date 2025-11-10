"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import ComboBox from "@/components/ComboBox";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react"; 

export default function TelaCadastro() {
    
    // estado para os erros de validação
    const [errors, setErrors] = useState({});

    // função de validação
    const validate = (formData) => {
        const newErrors = {};

        if (!formData.nome) {
            newErrors.nome = "Nome é obrigatório.";
        }
        if (!formData.cns) {
            newErrors.cns = "CNS é obrigatório.";
        }
        if (!formData.cpf) {
            newErrors.cpf = "CPF é obrigatório.";
        }
        if (!formData.nasc) {
            newErrors.nasc = "Data de Nascimento é obrigatória.";
        }
        if (!formData.sexo) {
            newErrors.sexo = "Sexo é obrigatória.";
        }
        if (!formData.ubs) {
            newErrors.ubs = "UBS é obrigatória.";
        }
        if (!formData.sus) {
            newErrors.sus = "SUS é obrigatório.";
        }
        if (!formData.raca) {
            newErrors.raca = "Raça/Cor é obrigatório.";
        }
        if (!formData.end) {
            newErrors.end = "Endereço é obrigatório.";
        }
        if (!formData.tel) {
            newErrors.tel = "Telefone é obrigatório.";
        }
         if (!formData.email) {
            newErrors.email = "E-mail é obrigatório.";
        }
        if (!formData.senha) {
            newErrors.senha = "Senha é obrigatória.";
        }
        
        return newErrors;
    };

    // 4. Criar um 'handleSubmit' que usa a validação
    const handleSubmit = (data) => {
        const validationErrors = validate(data);
        setErrors(validationErrors); // Define os erros (se houver)

        // Se o objeto de erros estiver vazio, envia os dados
        if (Object.keys(validationErrors).length === 0) {
            console.log(data); // Ação de submit original
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            <DivFormulario maxWidth={700} minWidth={350}>
                <Formulario
                    initialValues={{ nome: "", cns: "", cpf: "", nasc: "", sexo:  "", ubs: "", sus: "", raca: "", end: "", tel: "", email: "", senha: "" }}
                    onSubmit={handleSubmit} //  Usar o novo handleSubmit
                    titulo="Cadastro do Paciente:"
                >
                    {({ formData, handleChange, handleSelectChange }) => (
                        <>
                            <Campo 
                                label="Nome:"
                                placeholder="Nome Completo"
                                name="nome"
                                value={formData.nome}
                                type="text"
                                onChange={handleChange}
                                error={errors.nome} //  Passar o erro para o Campo
                            />

                            <Campo 
                                label="CNS:"
                                placeholder="Cartao nacional de saude"
                                name="cns"
                                value={formData.cns}
                                type="number"
                                onChange={handleChange}
                                error={errors.cns}
                            />

                            <Campo 
                                label="CPF:"
                                placeholder="00000000000"
                                name="cpf"
                                value={formData.cpf}
                                type="number"
                                onChange={handleChange}
                                error={errors.cpf} //  Passar o erro
                            />

                            <Campo 
                                label="Data de Nascimento:"
                                name="nasc"
                                value={formData.nasc}
                                type="date"
                                onChange={handleChange}
                                error={errors.nasc} //  Passar o erro
                            />

                            <ComboBox
                                label="Sexo:"
                                name="sexo"
                                options={["Feminino", "Masculino", "Prefiro não dizer"]}
                                value={formData.sexo}
                                onChange={handleSelectChange}
                                error={errors.sexo}
                            />

                            <ComboBox
                                label="UBS:"
                                name="ubs"
                                options={["UBS1", "UBS2", "UBS3"]}
                                value={formData.ubs}
                                onChange={handleSelectChange}
                                error={errors.ubs}
                            />

                            <Campo 
                                label="SUS:"
                                placeholder="Número do SUS: 0000000000"
                                name="sus"
                                value={formData.sus}
                                type="number"
                                onChange={handleChange}
                                error={errors.sus} //  Passar o erro
                            />

                            <ComboBox
                                label="Raça/Cor:"
                                name="raca"
                                options={["Branco", "Pardo", "Preto"]}
                                value={formData.raca}
                                onChange={handleSelectChange}
                                error={errors.raca}
                            />

                            <Campo 
                                label="Endereço:"
                                placeholder="Rua/Bairro/N°"
                                name="end"
                                value={formData.end}
                                onChange={handleChange}
                                error={errors.end}
                            />

                            <Campo 
                                label="Telefone:"
                                placeholder="Número com DDD sem espaço ou traço: 00000000000"
                                name="tel"
                                value={formData.tel}
                                type="number"
                                onChange={handleChange}
                                error={errors.tel}
                            />

                            <Campo 
                                label="E-mail:"
                                placeholder="email@gmail.com"
                                name="email"
                                value={formData.email}
                                type="email"
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <Campo 
                                label="Senha:"
                                placeholder="Senha"
                                name="senha"
                                value={formData.senha}
                                type="password"
                                onChange={handleChange}
                                error={errors.senha} //  Passar o erro
                            />

                            <DivBotoes>
                                <Link href="/" className="w-full max-w-[170px]">
                                    <Botao
                                        background="var(--color-botao-terceira)"
                                        color="var(--color-text-botao-secundaria)"
                                        maximo={170}
                                        type="button"
                                    >
                                        Cancelar
                                    </Botao>
                                </Link>

                                <div className="w-full max-w-[170px]">
                                    <Botao type="submit">Salvar</Botao>
                                </div>
                            </DivBotoes>
                        </>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}