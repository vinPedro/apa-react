// components/Fila/FilaFilters.jsx
import React from 'react';

const UnidadesMock = [
  { id: '1', nome: 'PSF DE TESTE AUTOMATICO' },
];

const tabs = [
  { key: 'Recepcao', label: 'Recepção (Aguardando)' },
  { key: 'Triagem', label: 'Triagem (Pronto)' },
  { key: 'EmConsulta', label: 'Em Consulta' },
];

const FilaFilters = ({
  isAdminGeral,
  unidadeSelecionada,
  setUnidadeSelecionada,
  statusFiltro,
  setStatusFiltro,
}) => {

  const activeClasses = "bg-blue-600 text-white font-semibold";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-blue-100";

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. Select de Unidade de Saúde (apenas para Admin Geral) */}
      {isAdminGeral && (
        <div>
          <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
            Unidade de Saúde:
          </label>
          <select
            id="unidade"
            value={unidadeSelecionada}
            onChange={(e) => setUnidadeSelecionada(e.target.value)}
            className="border p-2 rounded-md w-full md:w-1/3"
          >
            {UnidadesMock.map(unidade => (
              <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
            ))}
          </select>
        </div>
      )}

      {/* 2. Tabs de Filtro por Status */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFiltro(tab.key)}
            className={`px-4 py-2 rounded-md transition-colors text-sm ${
              statusFiltro === tab.key ? activeClasses : inactiveClasses
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilaFilters;