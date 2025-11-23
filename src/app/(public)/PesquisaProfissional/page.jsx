// src\app\(public)\PesquisaProfissional\page.jsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Ajuste o caminho relativo (../../../components/) se necessário
import ComboBox from '../../../components/ComboBox.jsx'; 
import Campo from '../../../components/Campo.jsx'; 
import TabelaProfissionais from '../../../components/TabelaProfissionais.jsx'; // Novo componente

// 💡 SIMULAÇÃO DE DADOS:
const MOCK_PROFISSIONAIS = [
  { id: 101, nome: 'Dr. Ricardo Alves', cns: '700401476921234', especialidade: 'Clínico Geral' },
  { id: 102, nome: 'Dra. Ana Paula Mota', cns: '708507851234567', especialidade: 'Enfermeira' },
  { id: 103, nome: 'Enf. João Silva', cns: '700101459876543', especialidade: 'Enfermeiro' },
  { id: 104, nome: 'Dra. Carolina Souza', cns: '700000012345678', especialidade: 'Pediatra' },
];

// ----------------------------------------------------------------------

export default function PesquisaProfissional() {
  const [tipoFiltro, setTipoFiltro] = useState('nome'); // 'nome' ou 'cns'
  const [termoBusca, setTermoBusca] = useState('');
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Array de opções no formato que o ComboBox espera: { value, text }
  const opcoesFiltro = [
    { value: 'nome', text: 'Nome do Profissional' }, 
    { value: 'cns', text: 'CNS (Cartão Nacional de Saúde)' }
  ];

  const buscarProfissionais = useCallback(async (filtro, termo) => {
    // Para CNS, exigimos 5 dígitos; para Nome, 2
    if (termo.length < (filtro === 'cns' ? 5 : 2)) {
      setProfissionaisFiltrados([]);
      return;
    }

    setIsLoading(true);
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const termoLowerCase = termo.toLowerCase();
    
    // Simulação do filtro parcial (LIKE no backend)
    const resultados = MOCK_PROFISSIONAIS.filter(profissional => {
      const valor = filtro === 'nome' ? profissional.nome.toLowerCase() : profissional.cns;
      return valor.includes(termoLowerCase);
    });
    
    setProfissionaisFiltrados(resultados);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (termoBusca.trim() === '') {
        setProfissionaisFiltrados([]);
        return;
    }
    
    const handler = setTimeout(() => {
      buscarProfissionais(tipoFiltro, termoBusca);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
    
  }, [termoBusca, tipoFiltro, buscarProfissionais]);

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>👨‍⚕️ Filtro de Profissionais de Saúde</h1>
      
      {/* SEÇÃO DE FILTRO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
        
        <ComboBox
          label="Critério de Busca"
          options={opcoesFiltro}
          value={tipoFiltro}
          onChange={(valor) => { 
            setTipoFiltro(valor);
            setTermoBusca(''); 
          }}
        />
        
        <Campo
          label={`Digite o ${tipoFiltro === 'nome' ? 'Nome' : 'CNS'}:`}
          placeholder={`Comece a digitar o ${tipoFiltro}...`}
          valor={termoBusca}
          onChange={handleBuscaChange}
        />
      </div>

      <hr style={{ margin: '30px 0' }}/>

      
      <h2>Resultados da Pesquisa</h2>
      {isLoading && termoBusca.length > 0 && <p style={{ color: '#007bff' }}>Buscando...</p>}
      
      {!isLoading && termoBusca.length === 0 && (
        <p>Comece a digitar no campo acima para exibir a lista de profissionais.</p>
      )}
      
      {!isLoading && termoBusca.length > 0 && (
          <TabelaProfissionais profissionais={profissionaisFiltrados} />
      )}
      
    </div>
  );
}