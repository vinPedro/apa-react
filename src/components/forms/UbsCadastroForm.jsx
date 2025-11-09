'use client';

import React, { useState } from 'react';

export default function UbsCadastroForm() {
    const [formData, setFormData] = useState({
        cnes: '',
        cnpj: '',
        nome: '',
        logradouro: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`UBS "${formData.nome}" cadastrada com sucesso!`);
    };

    return (
        <div className="flex justify-center items-start w-full min-h-screen p-4">
            <form
                onSubmit={handleSubmit}
                className="
                    bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200
                    w-full max-w-lg md:max-w-2xl
                "
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 mb-8">
                    Cadastro de UBS
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Código CNES</label>
                        <input
                            type="text"
                            name="cnes"
                            value={formData.cnes}
                            onChange={handleChange}
                            required
                            maxLength={7}
                            placeholder="Ex: 1234567"
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">CNPJ</label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            required
                            placeholder="Ex: 12.345.678/0001-99"
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Nome da UBS</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            placeholder="Ex: UBS Central"
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Logradouro</label>
                        <input
                            type="text"
                            name="logradouro"
                            value={formData.logradouro}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Rua das Flores"
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Bairro</label>
                        <input
                            type="text"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Município</label>
                        <input
                            type="text"
                            name="municipio"
                            value={formData.municipio}
                            onChange={handleChange}
                            required
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">UF</label>
                        <input
                            type="text"
                            name="uf"
                            maxLength={2}
                            value={formData.uf}
                            onChange={handleChange}
                            required
                            className="w-full p-3 mt-1 border rounded-md uppercase"
                            placeholder="Ex: PB"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Telefone</label>
                        <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                            placeholder="Ex: (83) 99999-9999"
                            className="w-full p-3 mt-1 border rounded-md"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="
                        w-full py-3 mt-8
                        bg-blue-600 hover:bg-blue-700
                        text-white text-base font-semibold rounded-lg
                        transition
                    "
                >
                    Cadastrar UBS
                </button>
            </form>
        </div>
    );
}
