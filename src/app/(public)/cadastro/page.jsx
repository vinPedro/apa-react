"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";
import { useState } from "react"; // 1. Importar o useState

export default function TelaCadastro() {
    
    // 2. Criar estado para os erros de validação
    const [errors, setErrors] = useState({});

    // 3. Criar função de validação
    const validate = (formData) => {
        const newErrors = {};

        if (!formData.nome) {
            newErrors.nome = "Nome é obrigatório.";
        }
        if (!formData.cpf) {
            newErrors.cpf = "CPF é obrigatório.";
        }
        if (!formData.nasc) {
            newErrors.nasc = "Data de Nascimento é obrigatória.";
        }
        if (!formData.sus) {
            newErrors.sus = "SUS é obrigatório.";
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
            <DivFormulario maxWidth={700} minWidth={300} maxHeight={600}>
                <Formulario
                    initialValues={{ nome: "", cpf: "", nasc: "", sus: "", senha: "" }}
                    onSubmit={handleSubmit} // 5. Usar o novo handleSubmit
                    titulo="Cadastro do Paciente:"
                >
                    {({ formData, handleChange }) => (
                        <>
                            <Campo 
                                label="Nome:"
                                placeholder="Nome Completo"
                                name="nome"
                                value={formData.nome || ''}
                                type="text"
                                onChange={handleChange}
                                error={errors.nome} // 6. Passar o erro para o Campo
                            />

                            <Campo 
                                label="CPF:"
                                placeholder="00000000000"
                                name="cpf"
                                value={formData.cpf || ''}
                                type="number"
                                onChange={handleChange}
                                error={errors.cpf} // 6. Passar o erro
                            />

                            <Campo 
                                label="Data de Nascimento:"
                                name="nasc"
                                value={formData.nasc || ''}
                                type="date"
                                onChange={handleChange}
                                error={errors.nasc} // 6. Passar o erro
                            />

                            <Campo 
                                label="SUS:"
                                placeholder="Número do SUS: 0000000000"
                                name="sus"
                                value={formData.sus || ''}
                                type="number"
                                onChange={handleChange}
                                error={errors.sus} // 6. Passar o erro
                            />

                            <Campo 
                                label="Senha:"
                                placeholder="Senha"
                                name="senha"
                                value={formData.senha || ''}
                                type="password"
                                onChange={handleChange}
                                error={errors.senha} // 6. Passar o erro
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