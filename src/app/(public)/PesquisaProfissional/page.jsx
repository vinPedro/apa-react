"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/AuthContext'; // <-- Importar Auth
import ComboBox from '../../../components/ComboBox.jsx'; 
import Campo from '../../../components/Campo.jsx'; 
import TabelaProfissionais from '../../../components/TabelaProfissionais.jsx'; 
import AlertMessage from '@/components/AlertMessage'; // <-- AlertMessage

export default function PesquisaProfissional() {
  const { token } = useAuth(); // <-- Token
  const [tipoFiltro, setTipoFiltro] = useState('nome');
  const [termoBusca, setTermoBusca] = useState('');
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const opcoesFiltro = [
    { value: 'nome', text: 'Nome do Profissional' }, 
    { value: 'cns', text: 'CNS' },
    { value: 'cpf', text: 'CPF' }
  ];

  const buscarProfissionais = useCallback(async (filtro, termo) => {
    if (termo.length < (filtro === 'nome' ? 2 : 3)) {
      setProfissionaisFiltrados([]);
      return;
    }

    if (!token) {
        setAlert({ message: "Erro de autenticação. Faça login.", variant: "error" });
        return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      // Endpoint: /api/profissionais/buscar
      const response = await fetch(`/api/profissionais/buscar?tipo=${filtro.toUpperCase()}&termo=${termo}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Erro ao buscar profissionais.');
      }

      const data = await response.json();
      setProfissionaisFiltrados(data);

    } catch (error) {
      console.error("Erro na busca:", error);
      setAlert({ message: "Falha ao buscar dados.", variant: "error" });
      setProfissionaisFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
      {alert && (
          <AlertMessage 
              message={alert.message} 
              variant={alert.variant} 
              onClose={() => setAlert(null)} 
          />
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-800">Buscar Profissionais</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="md:col-span-1">
            <ComboBox
              label="Critério de Busca"
              options={opcoesFiltro}
              value={tipoFiltro}
              onChange={(valor) => { 
                setTipoFiltro(valor);
                setTermoBusca(''); 
                setProfissionaisFiltrados([]);
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
      
      {!isLoading && termoBusca.length > 0 && profissionaisFiltrados.length === 0 && (
        <p className="text-gray-500">Nenhum profissional encontrado.</p>
      )}
      
      {!isLoading && profissionaisFiltrados.length > 0 && (
          <TabelaProfissionais profissionais={profissionaisFiltrados} />
      )}
      
    </div>
  );
}