'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import FilaFilters from '@/components/Fila/FilaFilters';
import FilaTable from '@/components/Fila/FilaTable';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext'; // 1. Importar Auth
import AlertMessage from '@/components/AlertMessage'; // Para feedback visual

// Mapa de status do Front (Tabs) para o Back (Enum StatusAtendimento)
const STATUS_MAP = {
    'Recepcao': 'AGUARDANDO',
    'Triagem': 'PRONTO_PARA_CONSULTA', 
    'EmConsulta': 'EM_CONSULTA' 
};

const FilaPage = () => {
    const router = useRouter();
    const { token } = useAuth(); // 2. Pegar o token
    
    // Unidade 1 como padrão para teste, idealmente viria do perfil do usuário
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('1'); 
    const [statusFiltro, setStatusFiltro] = useState('Recepcao'); 
    const [filaData, setFilaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const isAdminGeral = true; // Isso deveria vir do profile do AuthContext

    // Função de busca real
    const fetchFila = useCallback(async () => {
        if (!unidadeSelecionada || !token) return; 
        
        setLoading(true);
        try {
            // Converte o status da Tab para o Enum do Java
            const statusBackend = STATUS_MAP[statusFiltro] || 'AGUARDANDO';
            
            const response = await fetch(`http://localhost:8080/api/atendimentos?unidadeSaudeId=${unidadeSelecionada}&status=${statusBackend}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar dados da fila.');
            }

            const data = await response.json();
            
            // O back retorna um DTO. Vamos garantir que o formato bata com a tabela.
            // AtendimentoResponseDTO: { id, senha, dataHoraChegada, status, prioridade, pacienteNome... }
            // FilaTable espera: { id, senha, nome, horaChegada, prioridade }
            const dadosFormatados = data.map(item => ({
                id: item.id,
                senha: item.senha,
                nome: item.pacienteNome,
                horaChegada: new Date(item.dataHoraChegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                prioridade: item.prioridade // NORMAL ou PRIORIDADE
            }));

            setFilaData(dadosFormatados);

        } catch (error) {
            console.error("Erro ao buscar fila:", error);
            // setAlert({ message: "Erro ao atualizar a fila.", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [unidadeSelecionada, statusFiltro, token]);

    // Polling a cada 10 segundos
    useEffect(() => {
        fetchFila();
        const intervalId = setInterval(fetchFila, 10000);
        return () => clearInterval(intervalId);
    }, [fetchFila]);

    // --- Handlers de Ação ---

    const handleTriagem = (atendimentoId, nomePaciente) => { // <--- Adicione aqui
    
        // Agora essa linha vai funcionar pois a variável existe
        const nomeSeguro = nomePaciente || ""; 
        const nomeEncoded = encodeURIComponent(nomeSeguro);
    
        router.push(`/Fichamento?atendimentoId=${atendimentoId}&paciente=${nomeEncoded}`); 
    };

    const handleChamar = async (atendimentoId) => {
        // Para chamar, precisamos saber quem é o médico. 
        // Em um cenário real, pegamos o ID do médico logado.
        // Vou usar um ID fixo '2' (supondo que o médico criado no DataInitializer tenha ID 2 ou buscamos do token)
        const medicoIdFixo = 2; 

        try {
            const response = await fetch('http://localhost:8080/api/atendimentos/chamar', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    unidadeSaudeId: unidadeSelecionada,
                    medicoId: medicoIdFixo 
                }) 
            });

            if (!response.ok) throw new Error('Falha ao chamar paciente.');
            
            setAlert({ message: `Senha chamada com sucesso!`, variant: "success" });
            fetchFila(); // Atualiza a lista imediatamente

        } catch (error) {
            console.error("Erro ao chamar:", error);
            setAlert({ message: `Erro ao chamar: ${error.message}`, variant: "error" });
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