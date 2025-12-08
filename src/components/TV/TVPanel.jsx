"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Botao from '@/components/Botao';
import CallDisplay from './CallDisplay';
import HistoryList from './HistoryList';

// Configurações
const POLLING_INTERVAL = 8000;

// Áudio
const playDingDongSound = () => {
  const audio = new Audio('/audio/ding-dong.mp3');
  audio.volume = 1.0;
  audio.play().catch(() =>
    console.warn('Navegador bloqueou o áudio')
  );
};

const TvPanel = () => {
  const [currentCall, setCurrentCall] = useState({
    number: '---',
    location: ''
  });

  const [history, setHistory] = useState([]);

  
  const updateHistory = (newTicket) => {
    if (currentCall.number !== '---') {
      setHistory(prev => [currentCall, ...prev].slice(0, 3));
    }
    setCurrentCall(newTicket);
  };

  // ✅ BUSCA A SENHA ATUAL (BACKEND)
  const fetchCurrentTicket = useCallback(async () => {
    try {
      // 🔽 AQUI VOCÊ VAI CHAMAR O BACKEND
      /*
      const response = await fetch('/api/queue/current');
      const data = await response.json();

      updateHistory({
        number: data.number,
        location: data.location
      });
      */
    } catch (error) {
      console.error('Erro ao buscar senha atual:', error);
    }
  }, [currentCall]);

  
  useEffect(() => {
    fetchCurrentTicket();
    const interval = setInterval(fetchCurrentTicket, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchCurrentTicket]);

  // ✅ CHAMA PRÓXIMA SENHA (BACKEND + SOM)
  const handleNext = async () => {
    try {
      // 🔽 AQUI VOCÊ VAI CHAMAR O BACKEND
      /*
      const response = await fetch('/api/queue/next', {
        method: 'POST'
      });
      const data = await response.json();

      playDingDongSound();
      updateHistory({
        number: data.number,
        location: data.location
      });
      */

      playDingDongSound(); 
    } catch (error) {
      console.error('Erro ao chamar próxima senha:', error);
    }
  };

  // ✅ CANCELAR SENHA (BACKEND)
  const handleCancel = async () => {
    try {
      // 🔽 AQUI VOCÊ VAI CHAMAR O BACKEND
      /*
      await fetch('/api/queue/cancel', {
        method: 'POST'
      });

      fetchCurrentTicket();
      */
    } catch (error) {
      console.error('Erro ao cancelar senha:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#000',
        fontFamily: 'Roboto, sans-serif'
      }}
    >
      <div style={{ flex: 7 }}>
        <CallDisplay
          ticket={currentCall.number}
          location={currentCall.location}
        />
      </div>

      <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <HistoryList history={history} />
        </div>

        {/* BOTÕES ADMIN */}
        <div
          style={{
            padding: '10px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a'
          }}
        >
          <Botao onClick={handleNext}>
            PRÓXIMA
          </Botao>

          <Botao
            onClick={handleCancel}
            style={{ backgroundColor: '#cc0000' }}
          >
            CANCELAR
          </Botao>
        </div>
      </div>
    </div>
  );
};

export default TvPanel;
