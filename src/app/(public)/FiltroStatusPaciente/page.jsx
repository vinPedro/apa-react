// app/fila/page.jsx
'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import FilaFilters from '@/components/Fila/FilaFilters';
import FilaTable from '@/components/Fila/FilaTable';
import { useRouter } from 'next/navigation'; // Hook para navegação

// =========================================================================
// !!! INÍCIO DA LÓGICA DE BACKEND/API !!!
// =========================================================================

/**
 * !!! IMPORTANTE: FUNÇÃO DE BUSCA REAL DA API !!!
 * * Substitua este mock pela função real que fará a chamada HTTP (fetch, axios, etc.) 
 * para o seu endpoint de backend que retorna a lista de pacientes.
 * * @param {string} unidadeId - ID da Unidade de Saúde selecionada no filtro.
 * @param {('Recepcao'|'Triagem'|'EmConsulta')} status - O status da fila selecionado (usado para filtro no backend).
 */
const fetchFilaAPI = async (unidadeId, status) => {
    console.log(`Buscando fila para Unidade: ${unidadeId || 'Todas'}, Status: ${status}`);
    
    // --- LOCAL DE IMPLEMENTAÇÃO REAL DA API ---
    
    // Exemplo de como a chamada de API DEVE ser:
    /*
    const response = await fetch(`/api/fila?unidade=${unidadeId}&status=${status}`, {
        // ... headers, tokens, etc.
    });

    if (!response.ok) {
        throw new Error('Falha ao buscar dados da fila.');
    }

    return response.json();
    */

    // Retorno de um array vazio temporário para não quebrar a aplicação sem o backend:
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return []; 
};

// =========================================================================
// !!! FIM DA LÓGICA DE BACKEND/API !!!
// =========================================================================


// --- Componente Principal ---

const FilaPage = () => {
    const router = useRouter();
    // Você pode querer inicializar com um valor null ou buscar a unidade padrão do usuário logado
    const [unidadeSelecionada, setUnidadeSelecionada] = useState(null); 
    const [statusFiltro, setStatusFiltro] = useState('Recepcao'); 
    const [filaData, setFilaData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Variável que deve ser populada com base no perfil do usuário logado
    const isAdminGeral = true; 

    // Função de busca (usada para Polling)
    const fetchFila = useCallback(async () => {
        // Evita a busca se a unidade ainda não foi selecionada e for obrigatória
        if (!unidadeSelecionada && isAdminGeral) return; 
        
        setLoading(true);
        try {
            const data = await fetchFilaAPI(unidadeSelecionada, statusFiltro);
            setFilaData(data);
        } catch (error) {
            console.error("Erro ao buscar fila:", error);
            // Implemente aqui a exibição de uma mensagem de erro para o usuário
        } finally {
            setLoading(false);
        }
    }, [unidadeSelecionada, statusFiltro, isAdminGeral]);

    // Implementação do Polling (atualiza a cada 10 segundos)
    useEffect(() => {
        fetchFila();
        const intervalId = setInterval(fetchFila, 10000); // Polling a cada 10 segundos
        return () => clearInterval(intervalId); // Limpeza
    }, [fetchFila]);

    // --- Handlers de Ação ---

    const handleTriagem = (pacienteId) => {
        // Redireciona para a tela de Fichamento
        // Certifique-se de que o caminho `/app/cadastro/Fichamento` é o correto em sua estrutura de pastas Next.js
        router.push(`/app/cadastro/Fichamento?pacienteId=${pacienteId}`); 
    };

    const handleChamar = async (pacienteId) => {
        console.log(`Chamando paciente ID: ${pacienteId}`);
        
        // --- LOCAL DE IMPLEMENTAÇÃO DO ENDPOINT DE CHAMADA ---
        try {
            /*
            await fetch('/api/chamar', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pacienteId, unidadeId: unidadeSelecionada }) 
            });
            */
            alert(`Paciente ${pacienteId} CH-AMADO com sucesso!`);
            
        } catch (error) {
            console.error("Erro ao chamar paciente:", error);
            alert(`Erro ao chamar paciente: ${error.message}`);
        }
        // Após a chamada bem-sucedida, atualiza a lista para refletir a mudança de status
        fetchFila(); 
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">🩺 Fila de Espera</h1>
            
            <FilaFilters 
                isAdminGeral={isAdminGeral}
                unidadeSelecionada={unidadeSelecionada}
                setUnidadeSelecionada={setUnidadeSelecionada}
                statusFiltro={statusFiltro}
                setStatusFiltro={setStatusFiltro}
            />

            <hr className="my-4"/>

            {loading ? (
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