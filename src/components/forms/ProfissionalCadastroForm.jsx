// src/components/forms/ProfissionalCadastroForm.jsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/AuthContext'; // <-- 1. Importar o useAuth

// <-- 2. Lista de conselhos ATUALIZADA para bater com o Enum do Backend
//
const MOCK_CONSELHOS = [
    { id: "CRM", nome: "CRM - Conselho Regional de Medicina" },
    { id: "COREN", nome: "COREN - Conselho Regional de Enfermagem" },
    { id: "CRO", nome: "CRO - Conselho Regional de Odontologia" },
    { id: "CRP", nome: "CRP - Conselho Regional de Psicologia" },
    { id: "CRF", nome: "CRF - Conselho Regional de Farmácia" },
    { id: "CREFITO", nome: "CREFITO - Conselho Regional de Fisioterapia e Terapia Ocupacional" },
    { id: "OUTRO", nome: "OUTRO" },
];

export default function ProfissionalCadastroForm() {
    const { token } = useAuth(); // <-- 3. Obter o token
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cns: '',
        conselhoSelecionado: '', // <-- Vai guardar o ID (ex: "CRM")
        // novoConselho: '', // Removido, pois a API não suporta
        registroConselho: '',
        ufConselho: '',
        ubsVinculadaId: '', // <-- 4. Corrigido para ubsVinculadaId
        emailInstitucional: '',
        telefoneContato: '',
        senha: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConselhos = MOCK_CONSELHOS.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConselhoChange = (conselhoId) => {
        setFormData(prev => ({
            ...prev,
            conselhoSelecionado: conselhoId,
        }));
        setIsModalOpen(false);
    };

    // <-- 5. Implementar o handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Erro: Você não está autenticado.");
            return;
        }

        if (!formData.conselhoSelecionado) {
             alert("Por favor, selecione um Conselho Profissional.");
             return;
        }
        
        // <-- 6. Mapear o state do formulário para o DTO da API
        //
        const dataToSubmit = {
            nomeCompleto: formData.nome, // Mapeado
            cpf: formData.cpf,
            cns: formData.cns,
            conselhoProfissional: formData.conselhoSelecionado, // Mapeado
            registroConselho: formData.registroConselho,
            ufConselho: formData.ufConselho,
            ubsVinculadaId: parseInt(formData.ubsVinculadaId, 10), // Mapeado e convertido para número
            emailInstitucional: formData.emailInstitucional,
            telefoneContato: formData.telefoneContato,
            senha: formData.senha,
        };

        setIsLoading(true);
        setError(null);

        try {
            // <-- 7. Fazer o fetch para o endpoint de profissionais
            const response = await fetch('http://localhost:8080/api/profissionais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Enviar o token
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro ${response.status}: Falha ao cadastrar profissional`);
            }

            alert(`Profissional "${formData.nome}" cadastrado com sucesso!`);
            // TODO: Limpar o formulário aqui se desejar

        } catch (err) {
            console.error('Erro ao cadastrar Profissional:', err);
            setError(err.message);
            alert(`Erro: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Ajusta o texto do botão de conselho
    const conselhoText = MOCK_CONSELHOS.find(c => c.id === formData.conselhoSelecionado)?.nome || 'Clique para escolher...';

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Dados do Novo Profissional
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <strong>Falha no cadastro:</strong> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Dra. Ana C. Oliveira"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* CPF */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                    </label>
                    <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        placeholder="Somente números"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* CNS */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNS (Cartão Nacional de Saúde)
                    </label>
                    <input
                        type="text"
                        name="cns"
                        value={formData.cns}
                        onChange={handleChange}
                        required
                        placeholder="Somente números (15 dígitos)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* Conselho Profissional */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conselho Profissional
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className={`w-full p-3 border rounded-lg text-left flex justify-between items-center ${
                            formData.conselhoSelecionado ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-500'
                        }`}
                        disabled={isLoading}
                    >
                        {conselhoText}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </button>

                    {/* Lógica de "novoConselho" removida, pois a API não suporta */}
                </div>

                {/* Registro Conselho */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registro no Conselho
                    </label>
                    <input
                        type="text"
                        name="registroConselho"
                        value={formData.registroConselho}
                        onChange={handleChange}
                        required
                        placeholder="Número de registro"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* UF Conselho */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        UF do Conselho
                    </label>
                    <input
                        type="text"
                        name="ufConselho"
                        value={formData.ufConselho}
                        onChange={handleChange}
                        required
                        maxLength="2"
                        placeholder="Ex: SP, MG"
                        className="uppercase w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* <-- 8. CAMPO DE UBS CORRIGIDO --> */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID da UBS Vinculada
                    </label>
                    <input
                        type="number" // Mudei para number
                        name="ubsVinculadaId" // Mudei o name
                        value={formData.ubsVinculadaId}
                        onChange={handleChange}
                        required
                        placeholder="Digite o ID da UBS (ex: 1)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>
                {/* <-- FIM DA CORREÇÃO --> */}


                {/* E-mail Institucional */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail Institucional
                    </label>
                    <input
                        type="email"
                        name="emailInstitucional"
                        value={formData.emailInstitucional}
                        onChange={handleChange}
                        required
                        placeholder="email@institucional.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* Telefone Contato */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone de Contato
                    </label>
                    <input
                        type="tel"
                        name="telefoneContato"
                        value={formData.telefoneContato}
                        onChange={handleChange}
                        required
                        placeholder="Somente números (ex: 83999999999)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>

                {/* Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha de Acesso
                    </label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        minLength="8"
                        placeholder="Mínimo 8 caracteres"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Botão Enviar */}
            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition
                        ${isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                    `}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Profissional'}
                </button>
            </div>

            {/* Modal de Conselhos */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Buscar Conselho Profissional</h3>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Digite para buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg">
                            <ul className="divide-y divide-gray-100">
                                {filteredConselhos.map((c) => (
                                    <li
                                        key={c.id}
                                        onClick={() => handleConselhoChange(c.id)} // Passa o ID (string do Enum)
                                        className={`p-3 cursor-pointer hover:bg-blue-50 ${
                                            formData.conselhoSelecionado === c.id ? 'bg-blue-100 font-semibold' : ''
                                        }`}
                                    >
                                        {c.nome}
                                    </li>
                                ))}
                                {filteredConselhos.length === 0 && (
                                    <li className="p-3 text-center text-gray-500">
                                        Nenhum conselho encontrado.
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
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