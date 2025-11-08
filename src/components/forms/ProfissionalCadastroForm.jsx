// src/components/forms/ProfissionalCadastroForm.jsx
'use client';

import React, { useState } from 'react';

// SIMULAÇÃO DE DADOS: Lista de especialidades cadastradas
const MOCK_ESPECIALIDADES = [
    { id: 1, nome: "Clínico Geral" },
    { id: 2, nome: "Pediatria" },
    { id: 3, nome: "Cardiologia" },
    { id: 4, nome: "Psicologia" },
    // A opção "OUTRO" será adicionada no frontend
];

export default function ProfissionalCadastroForm() {
    const [formData, setFormData] = useState({
        nome: '',
        identificador: '',
        especialidadeSelecionada: '', // Guarda o valor do select (ID ou 'OUTRO')
        novaEspecialidade: '',        // Se 'OUTRO' for escolhido
        senha: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o modal de busca
    const [searchTerm, setSearchTerm] = useState('');      // Estado para a busca

    const allEspecialidades = [
        ...MOCK_ESPECIALIDADES, 
        { id: 'OUTRO', nome: 'OUTRO (Digite a nova especialidade abaixo)' }
    ];

    const filteredEspecialidades = allEspecialidades.filter(e => 
        e.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Lógica para lidar com a seleção de especialidade
    const handleEspecialidadeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            especialidadeSelecionada: value,
            // Limpa o campo de nova especialidade se algo que não é 'OUTRO' for escolhido
            novaEspecialidade: value !== 'OUTRO' ? '' : prev.novaEspecialidade,
        }));
        setIsModalOpen(false); // Fecha o modal após a seleção
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let especialidadeFinal;
        
        if (formData.especialidadeSelecionada === 'OUTRO') {
            if (!formData.novaEspecialidade) {
                alert("Por favor, digite o nome da nova especialidade.");
                return;
            }
            especialidadeFinal = formData.novaEspecialidade;
        } else {
            // Encontra o nome da especialidade pelo ID ou usa o valor literal
            const selected = MOCK_ESPECIALIDADES.find(e => e.id.toString() === formData.especialidadeSelecionada);
            especialidadeFinal = selected ? selected.nome : formData.especialidadeSelecionada;
        }

        const dataToSubmit = {
            nome: formData.nome,
            identificador: formData.identificador,
            especialidade: especialidadeFinal,
            senha: formData.senha, // NOTA: Em produção, a senha deve ser criptografada antes de enviar
        };

        console.log('Dados do Profissional enviados:', dataToSubmit);
        alert(`Profissional "${formData.nome}" cadastrado como ${especialidadeFinal} com sucesso!`);
        
        // Limpar o formulário (omitido para brevidade)
    };
    
    // Determina o texto exibido no campo de especialidade
    const especialidadeText = formData.especialidadeSelecionada === 'OUTRO' 
        ? 'OUTRO (Clique para escolher ou digite abaixo)'
        : (MOCK_ESPECIALIDADES.find(e => e.id.toString() === formData.especialidadeSelecionada)?.nome || 'Clique para escolher...');


    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dados do Novo Profissional</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Nome */}
                <div className="md:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        name="nome"
                        id="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Dra. Ana C. Oliveira"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>

                {/* 2. Identificador (Simulando o padrão CPF/CRM) */}
                <div>
                    <label htmlFor="identificador" className="block text-sm font-medium text-gray-700 mb-1">
                        Identificador Profissional (Ex: CPF/CRM)
                    </label>
                    <input
                        type="text"
                        name="identificador"
                        id="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                        required
                        pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{6,10}" // Regex para CPF ou número longo
                        placeholder="Formato: 999.999.999-99 ou número de registro"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>
                
                {/* 3. Especialidade (Botão que abre o Modal de Busca) */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidade
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full p-3 border rounded-lg text-left flex justify-between items-center transition duration-150 ${
                            formData.especialidadeSelecionada ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-500'
                        }`}
                    >
                        {especialidadeText}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </button>
                    
                    {/* Campo para Nova Especialidade (Se 'OUTRO' for selecionado) */}
                    {formData.especialidadeSelecionada === 'OUTRO' && (
                        <input
                            type="text"
                            name="novaEspecialidade"
                            value={formData.novaEspecialidade}
                            onChange={handleChange}
                            placeholder="Digite o nome da nova especialidade"
                            className="mt-2 w-full p-3 border border-orange-500 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                            required
                        />
                    )}
                </div>

                {/* 4. Senha */}
                <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha (Mínimo 8 caracteres)
                    </label>
                    <input
                        type="password"
                        name="senha"
                        id="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        minLength="8"
                        placeholder="********"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>
                
            </div>

            {/* Botão de Envio */}
            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    Cadastrar Profissional
                </button>
            </div>
            
            {/* Modal de Busca de Especialidades */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Buscar Especialidade</h3>
                        
                        {/* Campo de Busca */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Digite para buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        {/* Tabela de Resultados */}
                        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg">
                            <ul className="divide-y divide-gray-100">
                                {filteredEspecialidades.map((esp) => (
                                    <li 
                                        key={esp.id}
                                        onClick={() => handleEspecialidadeChange(esp.id.toString())}
                                        className={`p-3 cursor-pointer hover:bg-blue-50 transition duration-150 ${
                                            formData.especialidadeSelecionada === esp.id.toString() ? 'bg-blue-100 font-semibold' : ''
                                        }`}
                                    >
                                        {esp.nome}
                                    </li>
                                ))}
                                {filteredEspecialidades.length === 0 && (
                                    <li className="p-3 text-center text-gray-500">Nenhuma especialidade encontrada.</li>
                                )}
                            </ul>
                        </div>
                        
                        {/* Botão de Fechar */}
                        <div className="mt-6 text-right">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}