'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/AuthContext';
import ComboBox from '../ComboBox';
import AlertMessage from '@/components/AlertMessage';

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
    const { token } = useAuth(); 
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    
    // --- ESTADO PARA AS UNIDADES DO BANCO ---
    const [unidadesSaude, setUnidadesSaude] = useState([]);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        cns: '',
        conselhoSelecionado: '',
        registroConselho: '',
        ufConselho: '',
        ubsVinculadaId: '',
        emailInstitucional: '',
        telefoneContato: '',
        senha: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- BUSCA AS UNIDADES AO CARREGAR O COMPONENTE ---
    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/unidades', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUnidadesSaude(data); // Assume que data é List<UnidadeSaudeDTO>
                } else {
                    console.error("Falha ao carregar unidades de saúde");
                }
            } catch (error) {
                console.error("Erro na requisição de unidades:", error);
            }
        };

        if (token) fetchUnidades();
    }, [token]);

    const filteredConselhos = MOCK_CONSELHOS.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConselhoChange = (conselhoId) => {
        setFormData(prev => ({ ...prev, conselhoSelecionado: conselhoId }));
        setIsModalOpen(false);
    };

    function handleSelectChange(name, value) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setAlert({ message: "Erro: Você não está autenticado.", variant: "error" });
            return;
        }

        if (!formData.conselhoSelecionado) {
             setAlert({ message: "Por favor, selecione um Conselho Profissional.", variant: "warning" });
             return;
        }
        
        const dataToSubmit = {
            nomeCompleto: formData.nome,
            cpf: formData.cpf,
            cns: formData.cns,
            conselhoProfissional: formData.conselhoSelecionado,
            registroConselho: formData.registroConselho,
            ufConselho: formData.ufConselho,
            ubsVinculadaId: parseInt(formData.ubsVinculadaId, 10),
            emailInstitucional: formData.emailInstitucional,
            telefoneContato: formData.telefoneContato,
            senha: formData.senha,
        };

        setIsLoading(true);
        setAlert(null);

        try {
            const response = await fetch('http://localhost:8080/api/profissionais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro ${response.status}: Falha ao cadastrar profissional`);
            }

            setAlert({ message: `Profissional "${formData.nome}" cadastrado com sucesso!`, variant: "success" });
            
            setFormData({
                nome: '', cpf: '', cns: '', conselhoSelecionado: '',
                registroConselho: '', ufConselho: '', ubsVinculadaId: '',
                emailInstitucional: '', telefoneContato: '', senha: '',
            });

        } catch (err) {
            setAlert({ message: err.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const conselhoText = MOCK_CONSELHOS.find(c => c.id === formData.conselhoSelecionado)?.nome || 'Clique para escolher...';

    return (
        <div className="relative">
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dados do Novo Profissional</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Ex: Dra. Ana C. Oliveira" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <input type="text" maxLength={11} name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="Somente números" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CNS</label>
                        <input type="text" maxLength={15} name="cns" value={formData.cns} onChange={handleChange} required placeholder="15 dígitos" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conselho Profissional</label>
                        <button type="button" onClick={() => setIsModalOpen(true)} className={`w-full p-3 border rounded-lg text-left flex justify-between items-center ${formData.conselhoSelecionado ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-500'}`} disabled={isLoading}>
                            {conselhoText}
                            <span className="ml-2">▼</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registro no Conselho</label>
                        <input type="text" name="registroConselho" value={formData.registroConselho} onChange={handleChange} required placeholder="Número" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UF do Conselho</label>
                        <input type="text" name="ufConselho" value={formData.ufConselho} onChange={handleChange} required maxLength="2" placeholder="Ex: SP" className="uppercase w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    {/* COMBOBOX INTEGRADO COM O BANCO */}
                    <div>
                        <ComboBox 
                            label={"Unidade de Saúde (UBS):"}
                            value={formData.ubsVinculadaId}
                            onChange={(v) => handleSelectChange("ubsVinculadaId", v)} 
                            options={unidadesSaude.map(op => ({ value: op.id, text: op.nome }))}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Institucional</label>
                        <input type="email" name="emailInstitucional" value={formData.emailInstitucional} onChange={handleChange} required placeholder="email@institucional.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
                        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength="8" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <button type="submit" className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Profissional'}
                    </button>
                </div>

                {/* Modal de Conselhos (Mesma lógica anterior) */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 shadow-2xl w-full max-w-lg">
                            <h3 className="text-xl font-bold mb-4">Buscar Conselho</h3>
                            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4" />
                            <div className="h-64 overflow-y-auto border rounded-lg">
                                <ul className="divide-y divide-gray-100">
                                    {filteredConselhos.map((c) => (
                                        <li key={c.id} onClick={() => handleConselhoChange(c.id)} className="p-3 cursor-pointer hover:bg-blue-50">
                                            {c.nome}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="mt-4 w-full py-2 bg-gray-200 rounded-lg">Fechar</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}