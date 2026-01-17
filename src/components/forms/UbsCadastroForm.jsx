'use client';

import React, { useState } from 'react';
import { useAuth } from '@/AuthContext';
import AlertMessage from '@/components/AlertMessage';
import { useViaCep } from '@/hooks/useViaCep';
import Campo from '@/components/Campo';

export default function UbsCadastroForm() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    
    // Estado de erros para validação visual
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        codigoCnes: '', 
        cnpj: '',
        nome: '',
        cep: '',
        logradouro: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '', 
    });

    const { buscarCep, loadingCep, camposTravados } = useViaCep(setFormData, setAlert);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Limpa o erro ao digitar
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleBlurCep = (e) => {
        buscarCep(e.target.value);
    };

    // --- FUNÇÃO DE VALIDAÇÃO ---
    const validate = () => {
        const newErrors = {};
        
        if (!formData.codigoCnes) newErrors.codigoCnes = "Obrigatório";
        if (!formData.cnpj) newErrors.cnpj = "Obrigatório";
        if (!formData.nome) newErrors.nome = "Obrigatório";
        if (!formData.cep) newErrors.cep = "Obrigatório";
        if (!formData.municipio) newErrors.municipio = "Obrigatório";
        if (!formData.uf) newErrors.uf = "Obrigatório";
        if (!formData.logradouro) newErrors.logradouro = "Obrigatório";
        if (!formData.bairro) newErrors.bairro = "Obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Valida antes de enviar
        if (!validate()) {
            setAlert({ message: "Preencha os campos obrigatórios.", variant: "warning" });
            return;
        }
        
        if (!token) {
            setAlert({ message: "Erro: Você não está autenticado.", variant: "error" });
            return;
        }

        setIsLoading(true);
        setAlert(null);

        try {
            const response = await fetch('/api/unidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || `Erro ${response.status}: Falha ao cadastrar`);
            }

            setAlert({ message: `UBS "${formData.nome}" cadastrada com sucesso!`, variant: "success" });
            
            setFormData({
                codigoCnes: '', cnpj: '', nome: '', cep: '', logradouro: '',
                bairro: '', municipio: '', uf: '', telefone: '',
            });
            setErrors({});

        } catch (err) {
            console.error("Erro:", err);
            setAlert({ message: err.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start w-full min-h-screen p-4">
            
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-lg md:max-w-3xl"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 mb-8">
                    Cadastro de UBS
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    
                    <div className="sm:col-span-1">
                        <Campo 
                            label="Código CNES" 
                            name="codigoCnes" 
                            value={formData.codigoCnes} 
                            onChange={handleChange} 
                            maxLength={7} 
                            placeholder="Ex: 1234567"
                            error={errors.codigoCnes} // Erro visual
                            disabled={isLoading} 
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <Campo 
                            label="CNPJ" 
                            name="cnpj" 
                            maxLength={14}
                            value={formData.cnpj} 
                            onChange={handleChange} 
                            placeholder="Ex: 12345678000199"
                            error={errors.cnpj}
                            disabled={isLoading} 
                        />
                    </div>
                    
                    <div className="sm:col-span-2">
                        <Campo 
                            label="Nome da UBS" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            placeholder="Ex: UBS Central"
                            error={errors.nome}
                            disabled={isLoading} 
                        />
                    </div>

                    {/* --- BLOCO DE ENDEREÇO --- */}
                    <div className="sm:col-span-2 border-t pt-4 mt-2">
                        <h3 className="text-gray-700 font-semibold mb-3">Endereço</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-3">
                                <Campo
                                    label={loadingCep ? "Buscando..." : "CEP"}
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    onBlur={handleBlurCep}
                                    maxLength={9}
                                    placeholder="00000-000"
                                    error={errors.cep}
                                    disabled={isLoading || loadingCep}
                                />
                            </div>
                            <div className="sm:col-span-9">
                                <Campo 
                                    label="Logradouro" 
                                    name="logradouro" 
                                    value={formData.logradouro} 
                                    onChange={handleChange} 
                                    placeholder="Ex: Rua das Flores"
                                    error={errors.logradouro}
                                    disabled={isLoading || camposTravados.logradouro} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-3">
                            <div className="sm:col-span-5">
                                <Campo 
                                    label="Bairro" 
                                    name="bairro" 
                                    value={formData.bairro} 
                                    onChange={handleChange} 
                                    placeholder="Ex: Centro"
                                    error={errors.bairro}
                                    disabled={isLoading || camposTravados.bairro} 
                                />
                            </div>
                            <div className="sm:col-span-5">
                                <Campo 
                                    label="Município" 
                                    name="municipio" 
                                    value={formData.municipio} 
                                    onChange={handleChange} 
                                    placeholder="Ex: João Pessoa"
                                    error={errors.municipio}
                                    disabled={isLoading || camposTravados.municipio} 
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Campo 
                                    label="UF" 
                                    name="uf" 
                                    value={formData.uf} 
                                    onChange={handleChange} 
                                    maxLength={2} 
                                    placeholder="PB"
                                    error={errors.uf}
                                    disabled={isLoading || camposTravados.uf} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <Campo 
                            label="Telefone (Opcional)" 
                            name="telefone" 
                            value={formData.telefone} 
                            onChange={handleChange} 
                            type="tel" 
                            placeholder="Ex: (83) 99999-9999"
                            disabled={isLoading} 
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 mt-8 text-white font-semibold rounded-lg transition ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar UBS'}
                </button>
            </form>
        </div>
    );
}