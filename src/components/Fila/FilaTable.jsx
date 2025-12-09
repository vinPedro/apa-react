import React from 'react';

const FilaTable = ({ data, statusFiltro, onTriagem, onChamar }) => {

  const getPriorityDisplay = (prioridade) => {
    if (prioridade === 'PRIORIDADE' || prioridade === 'Prioritario') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ⚠️ Prioritário
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Normal
      </span>
    );
  };

  const renderActionButton = (paciente) => {
    // Aba Recepção: Paciente chegou, precisa de Triagem
    if (statusFiltro === 'Recepcao' || statusFiltro === 'AGUARDANDO') {
      return (
        <button
          onClick={() => onTriagem(paciente.id, paciente.nome)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition"
        >
          Triagem
        </button>
      );
    } 
    
    // Aba Triagem: Paciente já triado, está aguardando o Médico Chamar
    // CORREÇÃO: Adicionado 'Triagem' aqui
    else if (statusFiltro === 'Triagem' || statusFiltro === 'PRONTO_PARA_CONSULTA') {
      return (
        <button
          onClick={() => onChamar(paciente.id)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition"
        >
          Chamar
        </button>
      );
    }
    
    // Aba Em Consulta: Paciente já foi chamado
    else if (statusFiltro === 'EmConsulta' || statusFiltro === 'EM_CONSULTA') {
        return (
            <button
              onClick={() => onChamar(paciente.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition"
            >
              Chamar Novamente
            </button>
        );
    }

    return <span className="text-gray-400 text-xs">-</span>;
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Senha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Chegada</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Nenhum paciente na fila de {statusFiltro}.
              </td>
            </tr>
          ) : (
            data.map((paciente) => (
              <tr key={paciente.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{paciente.senha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{paciente.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paciente.horaChegada}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityDisplay(paciente.prioridade)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {renderActionButton(paciente)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilaTable;