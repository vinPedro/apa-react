import React from 'react';

const TabelaProfissionais = ({ profissionais }) => {
  if (profissionais.length === 0) {
    return <p>Nenhum profissional de saúde encontrado com este termo.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={styles.th}>Nome</th>
          <th style={styles.th}>CNS</th>
          <th style={styles.th}>Especialidade</th>
          <th style={styles.th}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {profissionais.map((profissional) => (
          <tr key={profissional.id} style={styles.tr}>
            {/* CORREÇÃO AQUI: de .nome para .nomeCompleto */}
            <td style={styles.td}>{profissional.nomeCompleto}</td>
            <td style={styles.td}>{profissional.cns}</td>
            {/* Ajuste opcional: O DTO tem 'conselhoProfissional', não 'especialidade' direta, verifique se precisa ajustar */}
            <td style={styles.td}>{profissional.conselhoProfissional}</td> 
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
  button: {
      padding: '5px 10px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
  }
};

export default TabelaProfissionais;