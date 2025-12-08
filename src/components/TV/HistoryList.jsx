import React from 'react';

const HistoryList = ({ history }) => {
  return (
    <div style={{
      backgroundColor: '#000000', 
      color: '#cccccc',         
      padding: '10px',
      borderTop: '3px solid #333',
    }}>
      <h3 style={{ 
        fontSize: '16px', // Fixo
        marginBottom: '5px' 
      }}>
        ÚLTIMAS CHAMADAS
      </h3>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0 
      }}>
        {history.map((item, index) => (
          <li key={index} style={{ 
            fontSize: '18px', // Fixo
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            {item.number} | {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;