import React from 'react';

const TabelaPacientes = ({ pacientes }) => {
  if (pacientes.length === 0) {
    return <p>Nenhum paciente encontrado com este termo.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={styles.th}>Nome</th>
          <th style={styles.th}>CPF</th>
          <th style={styles.th}>Data de Nascimento</th>
          <th style={styles.th}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id} style={styles.tr}>
            {/* CORREÇÃO AQUI: de .nome para .nomeCompleto */}
            <td style={styles.td}>{paciente.nomeCompleto}</td>
            <td style={styles.td}>{paciente.cpf}</td>
            <td style={styles.td}>{paciente.dataNascimento}</td>
            <td style={styles.td}>
              <button style={styles.button}>Detalhes</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const styles = {
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  tr: {
    
  },
  button: {
      padding: '5px 10px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
  }
};

export default TabelaPacientes;