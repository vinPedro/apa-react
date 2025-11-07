"use client";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import Formulario from "@/components/Formulario";
import Link from "next/link";

export default function TelaCadastro() {
    return (
        <div className="flex justify-center items-center h-screen p-2">
            <div className="flex flex-col justify-center rounded-3xl shadow-[0_0px_10px_rgba(0,0,0,0.20)] m-1 max-w-[700px] min-w-[300px] w-full max-h-[600px] min-h-fit h-full">
                <h1 className="text-center !text-[clamp(25px,5vw,30px)] !font-bold mb-[clamp(30px,5vw,50px)]">Cadastro do Paciente:</h1>
                <Formulario
                    initialValues={{ nome: "", cpf: "", nasc: "", sus: "", senha: "" }}
                    onSubmit={(data) => console.log(data)}
                >
                    {({ formData, handleChange }) => (
                        <>
                            <Campo label="Nome:" placeholder="Nome Completo" name="nome" value={formData.data} type="text" onChange={handleChange}></Campo>

                            <Campo label="CPF:" placeholder="00000000000" name="cpf" value={formData.data} type="number" onChange={handleChange}></Campo>

                            <Campo label="Data de Nascimento:" name="nasc" value={formData.data} type="date" onChange={handleChange}></Campo>

                            <Campo label="SUS:" placeholder="Número do SUS: 0000000000" name="sus" value={formData.data} type="number" onChange={handleChange}></Campo>

                            <Campo label="Senha:" placeholder="Senha" name="senha" value={formData.data} type="password" onChange={handleChange}></Campo>

                            <div className="flex justify-end space-x-5">
                                <Link href="/">
                                    <Botao background="var(--color-botao-terceira)" color="var(--color-text-botao-secundaria)" maximo={150} type="button">Cancelar</Botao>
                                </Link>

                                <Botao >Salvar</Botao>

                            </div>
                        </>
                    )}
                </Formulario>
            </div>
        </div>
    );
}
