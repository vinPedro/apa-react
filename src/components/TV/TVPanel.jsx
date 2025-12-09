"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Botao from '@/components/Botao';
import CallDisplay from './CallDisplay';
import HistoryList from './HistoryList';

const POLLING_INTERVAL = 8000;
const API_BASE = 'http://localhost:8080/api/painel';
const NEXT_API_URL = `${API_BASE}/proxima`;

// Som da nova chamada
const playDingDongSound = () => {
  const audio = new Audio('/audio/ding-dong.mp3');
  audio.volume = 1.0;
  audio.play().catch(() =>
    console.warn('Navegador bloqueou o áudio')
  );
};

const TvPanel = () => {
  const [unidadeId, setUnidadeId] = useState(null);
  const [currentCall, setCurrentCall] = useState({
    number: '---',
    location: ''
  });
  const [history, setHistory] = useState([]);

  // A função updateHistory foi removida pois sua lógica de histórico entrava em conflito com a do backend.

  // Busca painel da UBS selecionada
  const fetchPainel = useCallback(async () => {
    if (!unidadeId) return;

    try {
      const response = await fetch(`${API_BASE}/atual?unidadeId=${unidadeId}`);
      if (!response.ok) throw new Error('Erro ao buscar painel');

      const data = await response.json();
      
      // Armazena a senha atual ANTES da atualização para comparação de áudio
      const oldTicketNumber = currentCall.number;

      // 1. Atualiza chamada atual
      const newTicket = {
        number: data.senhaAtual || '---',
        location: data.guiche || ''
      };
      
      // 🌟 Atualização direta do estado sem lógica de histórico local
      setCurrentCall(newTicket);

      // Som só toca se a senha mudou
      if (data.senhaAtual && data.senhaAtual !== oldTicketNumber) {
        playDingDongSound();
      }

      // 2. Atualiza histórico (APENAS COM DADOS DO BACKEND)
      if (data.historico && data.historico.length > 0) {
        const historicoTickets = data.historico.map(item => ({
          number: item,
          location: data.guiche
        }));

        // 🔑 CORREÇÃO: Sobrescreve o histórico com o que veio do backend.
        // O backend (getDadosPainel) já garante que a lista tem as 3 últimas senhas (exceto a atual).
        setHistory(historicoTickets);
      } else {
        setHistory([]);
      }

    } catch (error) {
      console.error('Erro ao buscar painel:', error);
    }
  }, [unidadeId, currentCall.number]); // currentCall.number é usado apenas para o som

  // LÓGICA DO BOTÃO PRÓXIMA (INALTERADA)
  const handleNext = useCallback(async () => {
    if (!unidadeId) {
      alert('Por favor, insira o ID da UBS para chamar a próxima senha.');
      return;
    }

    try {
      const response = await fetch(`${NEXT_API_URL}?unidadeId=${unidadeId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao chamar a próxima senha: ${response.status} - ${errorText}`);
      }

      fetchPainel();

    } catch (error) {
      console.error('Erro ao chamar a próxima:', error);
      alert(error.message);
    }
  }, [unidadeId, fetchPainel]);
  
  const handleCancel = () => {};

  // Polling automático
  useEffect(() => {
    fetchPainel();
    const interval = setInterval(fetchPainel, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPainel]);

  return (
    // ... Restante do código de renderização (inalterado) ...
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#000',
        fontFamily: 'Roboto, sans-serif',
        color: '#0f0'
      }}
    >
      {/* Input para digitar o ID da UBS */}
      <div style={{ padding: '10px', backgroundColor: '#111', textAlign: 'center' }}>
        <label htmlFor="ubs-id" style={{ marginRight: '10px' }}>
          Digite o ID da UBS:
        </label>
        <input
          id="ubs-id"
          type="number"
          value={unidadeId || ''}
          onChange={e => setUnidadeId(Number(e.target.value))}
          placeholder="Ex: 1"
          style={{ padding: '5px', fontSize: '16px', width: '80px' }}
        />
      </div>

      {/* Painel principal */}
      <div style={{ flex: 7 }}>
        <CallDisplay
          ticket={currentCall.number}
          location={currentCall.location}
        />
      </div>

      {/* Histórico + botões */}
      <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <HistoryList history={history} />
        </div>

        <div
          style={{
            padding: '10px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a'
          }}
        >
          <Botao onClick={handleNext} disabled={!unidadeId}>
            PRÓXIMA
          </Botao>
          <Botao disabled style={{ backgroundColor: '#444' }}>
            CANCELAR
          </Botao>
        </div>
      </div>
    </div>
  );
};

export default TvPanel;