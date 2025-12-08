import React from 'react';

const CallDisplay = ({ ticket, location }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#1a1a1a', 
      color: '#FFFFFF',          
      padding: '10px 0',
    }}>
      <p style={{ 
        fontSize: '14px', // Fixo
        fontWeight: '300',
        margin: '0 0 5px 0' 
      }}>
        PRÓXIMO ATENDIMENTO
      </p>

      <h1 style={{ 
        fontSize: '48px', // Fixo, ajustado para caber em cards
        fontWeight: '900',
        color: '#39ff14', 
        margin: '0' 
      }}>
        {ticket || '---'}
      </h1>

      <h2 style={{ 
        fontSize: '20px', // Fixo
        fontWeight: '500',
        marginTop: '10px' 
      }}>
        {location || 'Aguardando Chamada'}
      </h2>
    </div>
  );
};

export default CallDisplay;