"use client";

import React, { useState } from 'react';
import Botao from '@/components/Botao';
import Campo from '@/components/Campo';
import DivFormulario from '@/components/DivFormulario';
import styles from './Formularios.module.css'; // Estilos compartilhados

export default function SinaisVitaisForm({ patientData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    pressao: '',
    temperatura: '',
    sintomas: '',
  });
  const [loading, setLoading] = useState(false);

  // Dados do paciente recebidos como props (read-only)
  const patientName = patientData?.name || '---';
  const ticketNumber = patientData?.ticket || 'P-00';

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Lógica para aplicar máscara na Pressão Arterial (ex: 00/00)
    if (name === 'pressao') {
      let v = value.replace(/\D/g, ''); // Remove não-dígitos
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      if (v.length > 5) v = v.substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: v }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveAndRelease = async () => {
    // ⬇️⬇️⬇️ CONEXÃO COM O BACKEND (SALVAR SINAIS VITAIS) ⬇️⬇️⬇️
    setLoading(true);
    console.log('Dados a serem salvos:', { patientName, ticketNumber, ...formData });

    try {
      // 1. Defina o endpoint da API para salvar os sinais e liberar o paciente.
      const API_ENDPOINT = `/api/atendimento/sinais-vitais/${ticketNumber}`; 
      
      // Simulação de chamada API
      // const response = await fetch(API_ENDPOINT, { method: 'POST', body: JSON.stringify(formData) });
      // if (!response.ok) throw new Error('Erro ao salvar e liberar.');

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula latência
      
      alert(`Sinais Vitais de ${patientName} salvos e paciente liberado para o próximo setor!`);

      if (onSave) onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Falha ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
    // ⬆️⬆️⬆️ FIM DA CONEXÃO COM O BACKEND ⬆️⬆️⬆️
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho Fixo (Dados do Paciente) */}
      <div className={styles.header}>
        <h3>Registro de Sinais Vitais 🩺</h3>
        <p>Paciente: <strong>{patientName}</strong></p>
        <p>Senha Atual: <strong>{ticketNumber}</strong></p>
      </div>

      <DivFormulario className={styles.formGrid}>
        <Campo 
          label="Peso (kg)" 
          type="number" 
          name="peso"
          value={formData.peso} 
          onChange={handleChange}
          placeholder="Ex: 75.5"
        />
        <Campo 
          label="Altura (m)" 
          type="number" 
          name="altura"
          value={formData.altura} 
          onChange={handleChange}
          placeholder="Ex: 1.75"
        />
        <Campo 
          label="Pressão Arterial (sistólica/diastólica)" 
          type="text" 
          name="pressao"
          value={formData.pressao} 
          onChange={handleChange}
          placeholder="Ex: 12/08"
          maxLength={5}
        />
        <Campo 
          label="Temperatura (°C)" 
          type="number" 
          name="temperatura"
          value={formData.temperatura} 
          onChange={handleChange}
          placeholder="Ex: 36.5"
        />
        <div className={styles.fullWidth}>
          <label>Sintomas / Queixa Principal</label>
          <textarea 
            name="sintomas"
            value={formData.sintomas} 
            onChange={handleChange}
            rows="4" 
            placeholder="Descreva a queixa principal do paciente e observações relevantes."
            className={styles.textArea}
          />
        </div>
      </DivFormulario>

      <div className={styles.actionButtons}>
        <Botao onClick={onCancel} style={{ backgroundColor: '#6c757d' }} disabled={loading}>
          Cancelar
        </Botao>
        <Botao onClick={handleSaveAndRelease} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar e Liberar'}
        </Botao>
      </div>
    </div>
  );
}