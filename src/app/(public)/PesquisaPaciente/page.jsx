

"use client";

import React, { useState, useEffect, useCallback } from 'react';


import ComboBox from '../../../components/ComboBox.jsx'; 
import Campo from '../../../components/Campo.jsx'; 
import TabelaPacientes from '../../../components/TabelaPacientes.jsx';



export default function PesquisaPacientes() { 
  const [termoBusca, setTermoBusca] = useState('');
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const opcoesFiltro = [
    { value: 'nome', text: 'Nome do Paciente' }, 
    { value: 'cpf', text: 'CPF do Paciente' }
  ];

  const buscarPacientes = useCallback(async (filtro, termo) => {
    if (termo.length < (filtro === 'cpf' ? 3 : 2)) {
      setPacientesFiltrados([]);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const termoLowerCase = termo.toLowerCase();
    
    const resultados = MOCK_PACIENTES.filter(paciente => {
      const valor = filtro === 'nome' ? paciente.nome.toLowerCase() : paciente.cpf;
      return valor.includes(termoLowerCase);
    });
    
    setPacientesFiltrados(resultados);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (termoBusca.trim() === '') {
        setPacientesFiltrados([]);
        return;
    }
    
    const handler = setTimeout(() => {
      buscarPacientes(tipoFiltro, termoBusca);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
    
  }, [termoBusca, tipoFiltro, buscarPacientes]);

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Filtro de Pacientes</h1>
      
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
          label={`Digite o ${tipoFiltro === 'nome' ? 'Nome' : 'CPF'}:`}
          placeholder={`Comece a digitar o ${tipoFiltro}...`}
          valor={termoBusca}
          onChange={handleBuscaChange}
        />
      </div>

      <hr style={{ margin: '30px 0' }}/>

      
      <h2>Resultados da Pesquisa</h2>
      {isLoading && termoBusca.length > 0 && <p style={{ color: '#007bff' }}>Buscando...</p>}
      
      {!isLoading && termoBusca.length === 0 && (
        <p>Comece a digitar no campo acima para exibir a lista de pacientes.</p>
      )}
      
      {!isLoading && termoBusca.length > 0 && (
          <TabelaPacientes pacientes={pacientesFiltrados} />
      )}
      
    </div>
  );
}