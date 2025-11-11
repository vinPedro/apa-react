'use client';

import { useAuth } from "@/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isAuthenticated, profile, token } = useAuth();
  const router = useRouter();

  const [unidades, setUnidades] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para proteger a rota
  useEffect(() => {
    if (!isAuthenticated || profile !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, profile, router]);

  // Efeito para buscar os dados da API
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const [unidadesRes, profRes] = await Promise.all([
            fetch('http://localhost:8080/api/unidades', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8080/api/profissionais', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);

          if (!unidadesRes.ok) throw new Error('Falha ao buscar Unidades de Saúde.');
          if (!profRes.ok) throw new Error('Falha ao buscar Profissionais.');

          const unidadesData = await unidadesRes.json();
          const profData = await profRes.json();

          setUnidades(unidadesData);
          setProfissionais(profData);

        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [token]);


  // Função para DELETAR UNIDADE
  const handleDeleteUnidade = async (unidadeId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta Unidade de Saúde?")) {
      return;
    }
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/unidades/${unidadeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const erroData = await response.json();
        throw new Error(erroData.message || 'Falha ao excluir unidade.');
      }
      alert('Unidade de Saúde excluída com sucesso!');
      setUnidades(unidades.filter(u => u.id !== unidadeId));
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(`Erro: ${err.message}`);
    }
  };

  // --- 1. NOVA FUNÇÃO PARA DELETAR PROFISSIONAL ---
  const handleDeleteProfissional = async (profissionalId) => {
    if (!window.confirm("Tem certeza que deseja excluir este Profissional?")) {
      return;
    }
    try {
      setError(null);
      
      // Endpoint: DELETE /api/profissionais/{id}
      const response = await fetch(`http://localhost:8080/api/profissionais/${profissionalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
         // O delete do profissional no backend não tem validações,
         // mas caso falhe por outro motivo (ex: BD)
        throw new Error('Falha ao excluir profissional.');
      }

      alert('Profissional excluído com sucesso!');
      
      // Atualiza o estado local para remover o item da lista
      setProfissionais(profissionais.filter(p => p.id !== profissionalId));

    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(`Erro: ${err.message}`);
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---


  if (!isAuthenticated || profile !== "admin") {
    return <div className="text-center p-10"><p>Redirecionando...</p></div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-lg text-gray-700">Bem-vindo(a), administrador!</p>
      </div>

      {loading && <p className="text-gray-600 text-lg">Carregando dados do painel...</p>}
      {error && <p className="text-red-600 text-lg">Erro: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna 1: Unidades de Saúde */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Unidades de Saúde ({unidades.length})</h2>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {unidades.length === 0 ? (
                <li className="py-3 text-gray-500">Nenhuma unidade cadastrada.</li>
              ) : (
                unidades.map((unidade) => (
                  <li key={unidade.id} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-medium text-blue-700">{unidade.nome}</p>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        ID: {unidade.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">CNES: {unidade.codigoCnes}</p>
                    <p className="text-sm text-gray-500">{`${unidade.logradouro} - ${unidade.municipio}/${unidade.uf}`}</p>
                    <div className="text-right mt-2">
                      <button
                        onClick={() => handleDeleteUnidade(unidade.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md hover:bg-red-200 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Coluna 2: Profissionais */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Profissionais ({profissionais.length})</h2>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {profissionais.length === 0 ? (
                <li className="py-3 text-gray-500">Nenhum profissional cadastrado.</li>
              ) : (
                profissionais.map((prof) => (
                  <li key={prof.id} className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-medium text-green-700">{prof.nomeCompleto}</p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        ID: {prof.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">CPF: {prof.cpf}</p>
                    <p className="text-sm text-gray-600">Conselho: {prof.conselhoProfissional} ({prof.ufConselho}) - {prof.registroConselho}</p>
                    <p className="text-sm text-gray-500">UBS ID: {prof.ubsVinculadaId}</p>
                    
                    {/* --- 2. BOTÃO DE EXCLUIR ATUALIZADO --- */}
                    <div className="text-right mt-2">
                      <button
                        onClick={() => handleDeleteProfissional(prof.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md hover:bg-red-200 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}