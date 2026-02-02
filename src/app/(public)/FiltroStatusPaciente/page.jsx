'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import FilaFilters from '@/components/Fila/FilaFilters';
import FilaTable from '@/components/Fila/FilaTable';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext'; 
import AlertMessage from '@/components/AlertMessage'; 

const STATUS_MAP = {
    'Recepcao': 'AGUARDANDO',
    'Triagem': 'PRONTO_PARA_CONSULTA', 
    'EmConsulta': 'EM_CONSULTA' 
};

const FilaPage = () => {
    const router = useRouter();
    const { token, user } = useAuth(); 
    
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('1'); 
    const [statusFiltro, setStatusFiltro] = useState('Recepcao'); 
    const [filaData, setFilaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const isAdminGeral = true; 

    const fetchFila = useCallback(async () => {
        if (!unidadeSelecionada || !token) return; 
        
        setLoading(true);
        try {
            const statusBackend = STATUS_MAP[statusFiltro] || 'AGUARDANDO';
            
            const response = await fetch(`http://localhost:8080/api/atendimentos?unidadeSaudeId=${unidadeSelecionada}&status=${statusBackend}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao buscar dados da fila.');

            const data = await response.json();
            
            const dadosFormatados = data.map(item => ({
                id: item.id,
                senha: item.senha,
                nome: item.pacienteNome,
                horaChegada: new Date(item.dataHoraChegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                prioridade: item.prioridade 
            }));

            setFilaData(dadosFormatados);

        } catch (error) {
            console.error("Erro ao buscar fila:", error);
        } finally {
            setLoading(false);
        }
    }, [unidadeSelecionada, statusFiltro, token]);

    useEffect(() => {
        fetchFila();
        const intervalId = setInterval(fetchFila, 10000);
        return () => clearInterval(intervalId);
    }, [fetchFila]);

    const handleTriagem = (atendimentoId, nomePaciente) => {
        const nomeSeguro = nomePaciente || ""; 
        const nomeEncoded = encodeURIComponent(nomeSeguro);
        router.push(`/Fichamento?atendimentoId=${atendimentoId}&paciente=${nomeEncoded}`); 
    };

    const handleChamar = async () => {
        try {
            // AJUSTE AQUI: Tente usar o user.id. Se falhar, verifique qual ID existe no seu banco.
            // Se você for o administrador ou o primeiro usuário criado, tente 1.
            const medicoId = user?.id || 1; 

            const response = await fetch('http://localhost:8080/api/atendimentos/chamar', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    unidadeSaudeId: Number(unidadeSelecionada),
                    medicoId: Number(medicoId) 
                }) 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Se o erro for 404 ou 500 com a mensagem de profissional, lançamos aqui
                throw new Error(errorData.message || 'Profissional não encontrado no sistema.');
            }
            
            const atendimentoChamado = await response.json();
            
            setAlert({ message: `Paciente ${atendimentoChamado.pacienteNome} chamado! Redirecionando...`, variant: "success" });

            // Redirecionamento para Prontuário conforme solicitado
            router.push(`/prontuario?atendimentoId=${atendimentoChamado.id}`);

        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        }
    };

    return (
        <div className="p-4">
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <h1 className="text-2xl font-bold mb-4">🩺 Fila de Espera</h1>
            
            <FilaFilters 
                isAdminGeral={isAdminGeral}
                unidadeSelecionada={unidadeSelecionada}
                setUnidadeSelecionada={setUnidadeSelecionada}
                statusFiltro={statusFiltro}
                setStatusFiltro={setStatusFiltro}
            />

            <hr className="my-4"/>

            {loading && filaData.length === 0 ? (
                <p className="text-gray-500">Carregando fila...</p>
            ) : (
                <FilaTable 
                    data={filaData} 
                    statusFiltro={statusFiltro} 
                    onTriagem={handleTriagem}
                    onChamar={handleChamar}
                />
            )}
        </div>
    );
};

export default FilaPage;