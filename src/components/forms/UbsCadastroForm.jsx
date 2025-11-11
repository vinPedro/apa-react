'use client';

import React, { useState } from 'react';
import { useAuth } from '@/AuthContext'; // <-- 1. Importar o useAuth

export default function UbsCadastroForm() {
    const { token } = useAuth(); // <-- 2. Obter o token do contexto
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        // Renomear para corresponder ao DTO do backend
        codigoCnes: '', 
        cnpj: '',
        nome: '',
        logradouro: '',
        bairro: '',
        municipio: '',
        uf: '',
        // O campo 'telefone' não existe no DTO UnidadeSaudeDTO
        // Vamos removê-lo do envio, mas manter no form se quiser
        telefone: '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // <-- 3. Transformar o handleSubmit em assíncrono
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação simples para garantir que o admin está logado
        if (!token) {
            alert("Erro: Você não está autenticado. Faça login novamente.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // <-- 4. Preparar os dados para enviar (exatamente como o DTO)
        const dadosParaApi = {
            codigoCnes: formData.codigoCnes,
            cnpj: formData.cnpj,
            nome: formData.nome,
            logradouro: formData.logradouro,
            bairro: formData.bairro,
            municipio: formData.municipio,
            uf: formData.uf,
        };

        try {
            // <-- 5. Fazer a requisição fetch para o endpoint da API
            const response = await fetch('http://localhost:8080/api/unidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // <-- 6. Enviar o Token de autorização
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(dadosParaApi),
            });

            if (!response.ok) {
                // Tenta ler a mensagem de erro do backend
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro ${response.status}: Falha ao cadastrar UBS`);
            }

            // Se tudo deu certo
            alert(`UBS "${formData.nome}" cadastrada com sucesso!`);
            
            // Limpar o formulário (opcional)
            setFormData({
                codigoCnes: '', cnpj: '', nome: '', logradouro: '',
                bairro: '', municipio: '', uf: '', telefone: '',
            });

        } catch (err) {
            console.error("Erro ao cadastrar UBS:", err);
            setError(err.message);
            alert(`Erro: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
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

                {/* Exibição de Erro */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Falha no cadastro:</strong> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Código CNES</label>
                        <input
                            type="text"
                            name="codigoCnes" // <-- 7. Ajustar o 'name'
                            value={formData.codigoCnes}
                            onChange={handleChange}
                            required
                            maxLength={7}
                            placeholder="Ex: 1234567"
                            className="w-full p-3 mt-1 border rounded-md"
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-700">Telefone (Opcional)</label>
                        <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="Ex: (83) 99999-9999"
                            className="w-full p-3 mt-1 border rounded-md"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`
                        w-full py-3 mt-8
                        text-white text-base font-semibold rounded-lg
                        transition
                        ${isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                    `}
                    disabled={isLoading} // <-- 8. Desabilitar botão durante o envio
                >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar UBS'}
                </button>
            </form>
        </div>
    );
}