
'use client';

import React, { useState } from 'react';

export default function UbsCadastroForm() {
    const [formData, setFormData] = useState({
        nome: '',
        endereco: '',
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
        
        
        setFormData({ nome: '', endereco: '', telefone: '' });
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informações da UBS</h2>

            <div className="space-y-6">
                
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>

                
                <div>
                    <label 
                        htmlFor="endereco" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Endereço Completo
                    </label>
                    <textarea
                        name="endereco"
                        id="endereco"
                        rows="3"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Rua das Flores, 123, Bairro Centro, Cidade/Estado"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-none"
                    />
                </div>

                
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
                        
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    Cadastrar UBS
                </button>
            </div>
        </form>
    );
}