"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/AuthContext'; // <-- Importar Auth
import ComboBox from '../../../components/ComboBox.jsx'; 
import Campo from '../../../components/Campo.jsx'; 
import TabelaPacientes from '../../../components/TabelaPacientes.jsx';
import AlertMessage from '@/components/AlertMessage'; // <-- AlertMessage

export default function PesquisaPacientes() { 
  const { token } = useAuth(); // <-- Token para autenticação
  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const [termoBusca, setTermoBusca] = useState('');
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null); // Estado do Alerta

  const opcoesFiltro = [
    { value: 'nome', text: 'Nome do Paciente' }, 
    { value: 'cpf', text: 'CPF do Paciente' },
    { value: 'cns', text: 'CNS do Paciente' }
  ];

  const buscarPacientes = useCallback(async (filtro, termo) => {
    // Validação mínima de caracteres antes de buscar
    if (termo.length < (filtro === 'nome' ? 2 : 3)) {
      setPacientesFiltrados([]);
      return;
    }

    if (!token) {
        setAlert({ message: "Erro de autenticação. Faça login.", variant: "error" });
        return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      // Chama o endpoint de busca do Java
      // O Backend espera ?tipo=NOME&termo=Valor
      const response = await fetch(`/api/pacientes/buscar?tipo=${filtro.toUpperCase()}&termo=${termo}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Erro ao buscar pacientes.');
      }

      const data = await response.json();
      setPacientesFiltrados(data);

    } catch (error) {
      console.error("Erro na busca:", error);
      setAlert({ message: "Falha ao buscar dados. Tente novamente.", variant: "error" });
      setPacientesFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Dependência do token

  // Debounce para não chamar a API a cada letra digitada instantaneamente
  useEffect(() => {
    if (termoBusca.trim() === '') {
        setPacientesFiltrados([]);
        return;
    }
    
    const handler = setTimeout(() => {
      buscarPacientes(tipoFiltro, termoBusca);
    }, 500); // Espera 500ms após parar de digitar

    return () => {
      clearTimeout(handler);
    };
    
  }, [termoBusca, tipoFiltro, buscarPacientes]);

  const handleBuscaChange = (e) => {
    setTermoBusca(e.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Alerta Global */}
      {alert && (
          <AlertMessage 
              message={alert.message} 
              variant={alert.variant} 
              onClose={() => setAlert(null)} 
          />
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-800">Buscar Pacientes</h1>
      
      {/* SEÇÃO DE FILTRO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="md:col-span-1">
            <ComboBox
                label="Critério de Busca"
                options={opcoesFiltro}
                value={tipoFiltro}
                onChange={(valor) => { 
                    setTipoFiltro(valor);
                    setTermoBusca(''); 
                    setPacientesFiltrados([]);
                }}
            />
        </div>
        
        <div className="md:col-span-2">
            <Campo
                label={`Digite o ${tipoFiltro.toUpperCase()}:`}
                placeholder={`Pesquisar...`}
                value={termoBusca}
                onChange={handleBuscaChange}
                disabled={isLoading}
            />
        </div>
      </div>

      <hr className="my-6 border-gray-300"/>
      
      <h2 className="text-xl font-semibold mb-2">Resultados</h2>
      
      {isLoading && <p className="text-blue-600 font-medium">Buscando...</p>}
      
      {!isLoading && termoBusca.length > 0 && pacientesFiltrados.length === 0 && (
        <p className="text-gray-500">Nenhum paciente encontrado.</p>
      )}
      
      {!isLoading && pacientesFiltrados.length > 0 && (
          <TabelaPacientes pacientes={pacientesFiltrados} />
      )}
      
    </div>
  );
}