"use client";

import React, { useState } from 'react';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import DivFormulario from '@/components/DivFormulario';
import ProntuarioModal from '@/components/Modal/ProntuarioModal'; 
import styles from './PesquisaPaciente.module.css';

// O tipo de dado esperado para o prontuário completo seria:
// { id: number, data: string, medico: string, diagnostico: string, anamnese: string, exames: string[], medicamentos: string[] }

export default function PesquisaPacientePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  
  // Estado para armazenar a lista de resultados da busca (apenas itens resumidos)
  const [results, setResults] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para armazenar o prontuário COMPLETO do item selecionado
  const [selectedProntuario, setSelectedProntuario] = useState(null);

  // ----------------------------------------------------------------------
  // FUNÇÃO DE BUSCA INICIAL (AJUSTADA PARA GET COM QUERY PARAMS)
  // ----------------------------------------------------------------------
  const handleSearch = async () => {
    console.log('Iniciando busca no backend com GET e Query Parameters...');
    
    // ⬇️⬇️⬇️ CONEXÃO COM O BACKEND (BUSCA INICIAL) ⬇️⬇️⬇️
    try {
      // 1. Defina o endpoint base que corresponde ao seu @GetMapping.
      const API_ENDPOINT_BASE = '/api/prontuarios'; 
      
      // 2. Criação dos Query Parameters (devem usar os mesmos nomes do @RequestParam do Java)
      const params = new URLSearchParams();
      
      // Usamos 'cpfPaciente' no lugar de 'cpfOrName'
      if (searchTerm) {
        params.append('cpfPaciente', searchTerm); 
      }
      // Usamos 'dataInicio' no lugar de 'startDate'
      if (dateStart) {
        params.append('dataInicio', dateStart); 
      }
      // Usamos 'dataFim' no lugar de 'endDate'
      if (dateEnd) {
        params.append('dataFim', dateEnd); 
      }

      // 3. Concatene o endpoint base com os parâmetros para formar a URL completa.
      const fullUrl = `${API_ENDPOINT_BASE}?${params.toString()}`;

      // 4. Faça a requisição usando o método GET (padrão)
      const response = await fetch(fullUrl);
      
      if (!response.ok) throw new Error('Erro ao buscar o histórico.');
      
      const data = await response.json();
      
      // 5. Atualize o estado 'results'.
      //    Assumimos que o backend retorna diretamente a lista (List<ProntuarioResponseDTO>).
      setResults(data || []); 
      
    } catch (error) {
      console.error("Erro na busca de prontuários:", error);
      alert('Falha ao conectar com o servidor. Tente novamente.');
      setResults([]); // Limpa resultados em caso de erro
    }
    // ⬆️⬆️⬆️ FIM DA CONEXÃO COM O BACKEND (BUSCA INICIAL) ⬆️⬆️⬆️
  };

  // ----------------------------------------------------------------------
  // FUNÇÃO DE BUSCA DE DETALHES (INALTERADA - PADRÃO RESTFUL GET /id)
  // ----------------------------------------------------------------------
  const handleViewDetails = async (itemResumido) => {
    console.log('Buscando detalhes do prontuário ID:', itemResumido.id);

    // ⬇️⬇️⬇️ CONEXÃO COM O BACKEND (DETALHES DO PRONTUÁRIO) ⬇️⬇️⬇️
    try {
      // 1. Endpoint para buscar o prontuário completo pelo ID.
      const API_ENDPOINT_DETALHE = `/api/prontuarios/${itemResumido.id}`; 

      // Este endpoint precisa ser implementado no backend com @GetMapping("/{id}")
      const response = await fetch(API_ENDPOINT_DETALHE);
      
      if (!response.ok) throw new Error('Erro ao buscar detalhes do prontuário.');
      
      const prontuarioCompleto = await response.json();
      
      // 2. Armazene os dados completos no estado e abra o modal.
      setSelectedProntuario(prontuarioCompleto);
      setIsModalOpen(true);
      
    } catch (error) {
      console.error("Erro ao carregar prontuário completo:", error);
      alert('Não foi possível carregar os detalhes do prontuário.');
    }
    // ⬆️⬆️⬆️ FIM DA CONEXÃO COM O BACKEND (DETALHES DO PRONTUÁRIO) ⬆️⬆️⬆️
  };
  
  // ----------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------------------------
  return (
    <div className={styles.container}>
      <h2>Encontrar Pacientes (Histórico de Atendimentos)</h2>

      {/* Área de Busca e Filtros - (Usa handleSearch) */}
      <DivFormulario className={styles.searchForm}>
        <Campo 
          label="CPF ou Nome" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Digite CPF ou Nome do Paciente"
        />
        <Campo label="Data Início" type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        <Campo label="Data Fim" type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        <Botao onClick={handleSearch} style={{ alignSelf: 'flex-end', marginTop: '30px' }}>
          🔍 Buscar
        </Botao>
      </DivFormulario>

      {/* Lista de Resultados em Cards (Usa handleViewDetails) */}
      <div className={styles.resultsList}>
        <h3>Resultados ({results.length})</h3>
        <div className={styles.cardsContainer}>
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className={styles.resultCard}>
                <p><strong>📅 Data:</strong> {item.data}</p>
                <p><strong>🧑‍⚕️ Médico:</strong> {item.medico}</p>
                <p><strong>🩺 Diagnóstico:</strong> {item.diagnostico}</p>
                <Botao onClick={() => handleViewDetails(item)} style={{ padding: '8px 15px', marginTop: '10px' }}>
                  Ver Prontuário
                </Botao>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Nenhum histórico encontrado. Realize uma busca.</p>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Prontuário */}
      {isModalOpen && selectedProntuario && (
        <ProntuarioModal 
          prontuario={selectedProntuario} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}