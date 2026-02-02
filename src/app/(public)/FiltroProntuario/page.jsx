"use client";

import React, { useState } from 'react';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import DivFormulario from '@/components/DivFormulario';
import ProntuarioModal from '@/components/Modal/ProntuarioModal'; 
import styles from './PesquisaPaciente.module.css';
import { useAuth } from "@/AuthContext";

export default function PesquisaPacientePage() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  
  const [results, setResults] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProntuario, setSelectedProntuario] = useState(null);

  // ----------------------------------------------------------------------
  // BUSCA DINÂMICA (Lista de Prontuários)
  // ----------------------------------------------------------------------
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('cpfPaciente', searchTerm); 
      if (dateStart) params.append('dataInicio', dateStart); 
      if (dateEnd) params.append('dataFim', dateEnd); 

      const response = await fetch(`http://localhost:8080/api/prontuarios?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Erro ao buscar lista de prontuários.');
      
      const data = await response.json();
      setResults(data || []); 
      
    } catch (error) {
      console.error("Erro na busca:", error);
      alert('Não foi possível carregar o histórico.');
    }
  };

  // ----------------------------------------------------------------------
  // BUSCA POR ID (Agora garantindo o nome do paciente para o Modal)
  // ----------------------------------------------------------------------
  const handleViewDetails = async (itemResumido) => {
    try {
      const response = await fetch(`http://localhost:8080/api/prontuarios/${itemResumido.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 404) {
        alert(`Prontuário não encontrado.`);
        return;
      }

      if (!response.ok) throw new Error('Erro ao buscar detalhes.');
      
      const prontuarioCompleto = await response.json();

      // Armazenamos o objeto completo. 
      // Certifique-se que o DTO do Java envia 'nomePaciente' ou algo similar.
      setSelectedProntuario(prontuarioCompleto);
      setIsModalOpen(true);
      
    } catch (error) {
      console.error("Erro ao carregar prontuário:", error);
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>Histórico de Prontuários</h2>

      <DivFormulario className={styles.searchForm}>
        {/* Adicionei o Campo de busca que estava faltando no seu último snippet */}
        <Campo label="Data Início" type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        <Campo label="Data Fim" type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        <Botao onClick={handleSearch} style={{ alignSelf: 'flex-end', marginTop: '30px' }}>
          🔍 Filtrar Histórico
        </Botao>
      </DivFormulario>

      <div className={styles.resultsList}>
        <h3>Atendimentos Localizados ({results.length})</h3>
        <div className={styles.cardsContainer}>
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className={styles.resultCard}>
                <p><strong>📅 Atendimento:</strong> {
                  item.dataHoraFinalizacao 
                  ? new Date(item.dataHoraFinalizacao).toLocaleString('pt-BR') 
                  : "Data não registrada"
                }</p>
                {/* Opcional: Mostrar o nome já no card se o DTO de lista permitir */}
                {item.nomePaciente && <p><strong>👤 Paciente:</strong> {item.nomePaciente}</p>}
                <p><strong>🩺 Diagnóstico:</strong> {item.diagnostico}</p>
                
                <Botao onClick={() => handleViewDetails(item)} style={{ padding: '8px 15px', marginTop: '10px' }}>
                  Ver Detalhes
                </Botao>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Nenhum prontuário encontrado.</p>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Prontuário */}
      {isModalOpen && selectedProntuario && (
        <ProntuarioModal 
          prontuario={selectedProntuario} 
          // O Modal agora receberá o objeto completo com nome do paciente e data
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}