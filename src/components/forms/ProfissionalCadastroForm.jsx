// src/components/forms/ProfissionalCadastroForm.jsx
'use client';

import React, { useState } from 'react';

// SIMULAÇÃO DE DADOS: Lista de conselhos profissionais
const MOCK_CONSELHOS = [
    { id: 1, nome: "CRM - Conselho Regional de Medicina" },
    { id: 2, nome: "COREN - Conselho Regional de Enfermagem" },
    { id: 3, nome: "CRO - Conselho Regional de Odontologia" },
    { id: 'OUTRO', nome: 'OUTRO (Digite um novo conselho abaixo)' },
];

export default function ProfissionalCadastroForm() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cns: '',
        conselhoSelecionado: '',
        novoConselho: '',
        registroConselho: '',
        ufConselho: '',
        ubsVinculada: '',
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

    const handleConselhoChange = (value) => {
        setFormData(prev => ({
            ...prev,
            conselhoSelecionado: value,
            novoConselho: value !== 'OUTRO' ? '' : prev.novoConselho,
        }));
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let conselhoFinal;

        if (formData.conselhoSelecionado === 'OUTRO') {
            if (!formData.novoConselho) {
                alert("Por favor, digite o nome do novo conselho profissional.");
                return;
            }
            conselhoFinal = formData.novoConselho;
        } else {
            const selected = MOCK_CONSELHOS.find(c => c.id.toString() === formData.conselhoSelecionado);
            conselhoFinal = selected ? selected.nome : formData.conselhoSelecionado;
        }

        const dataToSubmit = {
            nome: formData.nome,
            cpf: formData.cpf,
            cns: formData.cns,
            conselho: conselhoFinal,
            registroConselho: formData.registroConselho,
            ufConselho: formData.ufConselho,
            ubsVinculada: formData.ubsVinculada,
            emailInstitucional: formData.emailInstitucional,
            telefoneContato: formData.telefoneContato,
            senha: formData.senha,
        };

        console.log('Dados do Profissional enviados:', dataToSubmit);
        alert(`Profissional "${formData.nome}" cadastrado com sucesso!`);
    };

    const conselhoText = formData.conselhoSelecionado === 'OUTRO'
        ? 'OUTRO (Clique para escolher ou digite abaixo)'
        : (MOCK_CONSELHOS.find(c => c.id.toString() === formData.conselhoSelecionado)?.nome || 'Clique para escolher...');

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Dados do Novo Profissional
            </h2>

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
                        pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                        placeholder="999.999.999-99"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        pattern="\d{15}"
                        placeholder="15 dígitos"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    >
                        {conselhoText}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </button>

                    {formData.conselhoSelecionado === 'OUTRO' && (
                        <input
                            type="text"
                            name="novoConselho"
                            value={formData.novoConselho}
                            onChange={handleChange}
                            placeholder="Digite o nome do novo conselho"
                            className="mt-2 w-full p-3 border border-orange-500 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    )}
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
                    />
                </div>

                {/* UBS Vinculada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        UBS Vinculada
                    </label>
                    <input
                        type="text"
                        name="ubsVinculada"
                        value={formData.ubsVinculada}
                        onChange={handleChange}
                        required
                        placeholder="Nome da UBS onde o profissional atua"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

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
                        placeholder="email@ubs.sp.gov.br"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}"
                        placeholder="(11) 99999-9999"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha (Mínimo 8 caracteres)
                    </label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        minLength="8"
                        placeholder="********"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Botão Enviar */}
            <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Cadastrar Profissional
                </button>
            </div>

            {/* Modal de Conselhos */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Buscar Conselho Profissional</h3>

                        {/* Campo de busca */}
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

                        {/* Lista de Conselhos */}
                        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg">
                            <ul className="divide-y divide-gray-100">
                                {filteredConselhos.map((c) => (
                                    <li
                                        key={c.id}
                                        onClick={() => handleConselhoChange(c.id.toString())}
                                        className={`p-3 cursor-pointer hover:bg-blue-50 ${
                                            formData.conselhoSelecionado === c.id.toString() ? 'bg-blue-100 font-semibold' : ''
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
