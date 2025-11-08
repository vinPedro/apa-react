'use client';

import React, { useState } from 'react';

export default function UbsCadastroForm() {
    const [formData, setFormData] = useState({
        cnes: '',
        cnpj: '',
        nome: '',
        endereco: '',
        logradouro: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Dados da UBS enviados:', formData);
        alert(`UBS "${formData.nome}" cadastrada com sucesso!`);
        
        setFormData({
            cnes: '',
            cnpj: '',
            nome: '',
            endereco: '',
            logradouro: '',
            bairro: '',
            municipio: '',
            uf: '',
            telefone: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                bg-white p-8 rounded-lg shadow-xl border border-gray-200
                w-full max-w-2xl mx-auto
            "
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Informações da UBS
            </h2>

            <div className="space-y-6">

                {/* Código CNES */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código CNES
                    </label>
                    <input
                        type="text"
                        name="cnes"
                        value={formData.cnes}
                        onChange={handleChange}
                        maxLength={7}
                        required
                        placeholder="Ex: 1234567"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* CNPJ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ
                    </label>
                    <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 12.345.678/0001-99"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Nome */}
                <div>
                    <label 
                        htmlFor="nome" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nome da UBS (Unidade Básica de Saúde)
                    </label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Ex: UBS Central Dr. João da Silva"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>


                {/* Logradouro */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logradouro
                    </label>
                    <input
                        type="text"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleChange}
                        required
                        placeholder="Rua, Avenida..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Bairro */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                    </label>
                    <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Centro"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Município */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Município
                    </label>
                    <input
                        type="text"
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleChange}
                        required
                        placeholder="Ex: João Pessoa"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* UF */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        UF (Estado)
                    </label>
                    <input
                        type="text"
                        name="uf"
                        maxLength={2}
                        value={formData.uf}
                        onChange={handleChange}
                        required
                        placeholder="Ex: PB"
                        className="w-full p-3 border border-gray-300 rounded-lg uppercase"
                    />
                </div>

                {/* Telefone */}
                <div>
                    <label 
                        htmlFor="telefone" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Telefone de Contato
                    </label>
                    <input
                        type="tel"
                        name="telefone"
                        id="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        placeholder="Ex: (83) 99999-9999"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="
                        w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
                        shadow-md hover:bg-blue-700
                    "
                >
                    Cadastrar UBS
                </button>
            </div>
        </form>
    );
}
