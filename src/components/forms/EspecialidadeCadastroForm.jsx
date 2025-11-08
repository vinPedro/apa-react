
'use client';

import React, { useState } from 'react';

export default function EspecialidadeCadastroForm() {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
       
        console.log('Dados da Especialidade enviados:', formData);
        
        
        alert(`Especialidade "${formData.nome}" cadastrada com sucesso!`);
        setFormData({ nome: '', descricao: '' });
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalhes da Especialidade</h2>

            <div className="space-y-6">
                
             
                <div>
                    <label 
                        htmlFor="nome" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nome da Especialidade
                    </label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Cardiologia, Fisioterapia, etc."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>

                
                <div>
                    <label 
                        htmlFor="descricao" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Descrição Completa
                    </label>
                    <textarea
                        name="descricao"
                        id="descricao"
                        rows="5"
                        value={formData.descricao}
                        onChange={handleChange}
                        required
                        placeholder="Descreva a área de atuação e foco desta especialidade."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-none"
                    />
                </div>
            </div>

            
            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    Cadastrar Especialidade
                </button>
            </div>
        </form>
    );
}