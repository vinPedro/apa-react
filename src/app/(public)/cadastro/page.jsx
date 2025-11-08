"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivBotoes from "@/components/DivBotoes";
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Link from "next/link";

export default function TelaCadastro() {
    return (
            <DivFormulario maxWidth={700} minWidth={300} maxHeight={600}>
                <Formulario
                    initialValues={{ nome: "", cpf: "", nasc: "", sus: "", senha: "" }}
                    onSubmit={(data) => console.log(data)}
                    titulo="Cadastro do Paciente:"
                >
                    {({ formData, handleChange }) => (
                        <>
                            <Campo label="Nome:" placeholder="Nome Completo" name="nome" value={formData.data} type="text" onChange={handleChange}></Campo>

                            <Campo label="CPF:" placeholder="00000000000" name="cpf" value={formData.data} type="number" onChange={handleChange}></Campo>

                            <Campo label="Data de Nascimento:" name="nasc" value={formData.data} type="date" onChange={handleChange}></Campo>

                            <Campo label="SUS:" placeholder="Número do SUS: 0000000000" name="sus" value={formData.data} type="number" onChange={handleChange}></Campo>

                            <Campo label="Senha:" placeholder="Senha" name="senha" value={formData.data} type="password" onChange={handleChange}></Campo>

                            <DivBotoes>

                                <Link href="/">
                                    <Botao background="var(--color-botao-terceira)" color="var(--color-text-botao-secundaria)" maximo={150} type="button">Cancelar</Botao>
                                </Link>
                                
                                <div>
                                    <Botao >Salvar</Botao>
                                </div>

                            </DivBotoes>
                        </>
                    )}
                </Formulario>
            </DivFormulario>
    );
}
