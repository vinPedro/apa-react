import React from 'react';
import Botao from '@/components/Botao';
import styles from './ProntuarioModal.module.css'; 

export default function ProntuarioModal({ prontuario, onClose }) {
  
  // Função auxiliar para formatar data
  const formatarData = (data) => {
    if (!data) return 'Data não informada';
    // Tenta criar data se for string ISO (ex: do Java)
    const dataObj = new Date(data);
    return isNaN(dataObj) ? data : dataObj.toLocaleDateString('pt-BR');
  };

  const handleExibirExames = () => {
    console.log('Ação: Abrir visualizador de exames para:', prontuario.exames);
    // Lógica opcional mantida
  };

  const handleExibirMedicamentos = () => {
    console.log('Ação: Abrir visualizador de medicamentos para:', prontuario.medicamentos);
    // Lógica opcional mantida
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        
        <div className={styles.header}>
            <h3>Prontuário de Atendimento</h3>
            <span className={styles.closeButton} onClick={onClose}>&times;</span>
        </div>
        <hr className={styles.divider}/>
        
        <div className={styles.metaData}>
            {/* Suporta 'dataHoraFinalizacao' (DTO novo) ou 'data' (antigo) */}
            <p><strong>📅 Data do Atendimento:</strong> {formatarData(prontuario.dataHoraFinalizacao || prontuario.data)}</p>
            {/* Suporta 'nomeMedico' (DTO novo) ou 'medico' (antigo) */}
            <p><strong>🧑‍⚕️ Médico(a):</strong> {prontuario.nomeMedico || prontuario.medico || 'Não identificado'}</p>
        </div>
        
        {/* CORREÇÃO 1: Queixa Principal (Dados reais do DTO) */}
        <div className={styles.section}>
            <h4>1. Queixa Principal</h4>
            <textarea 
                readOnly 
                value={prontuario.queixaPrincipal || 'Não registrada.'} 
                className={styles.textarea} 
            />
        </div>

        {/* CORREÇÃO 2: Histórico da Doença (Novo campo) */}
        <div className={styles.section}>
            <h4>2. Histórico da Doença</h4>
            <textarea 
                readOnly 
                value={prontuario.historicoDoenca || 'Não registrado.'} 
                className={styles.textarea} 
            />
        </div>
        
        {/* CORREÇÃO 3: Diagnóstico */}
        <div className={styles.section}>
            <h4>3. Diagnóstico Principal</h4>
            <p className={styles.diagnosisTag}>{prontuario.diagnostico || 'Não informado.'}</p>
        </div>

        {/* CORREÇÃO 4: Prescrição Médica (Visualização direta do texto) */}
        <div className={styles.section}>
            <h4>4. Prescrição Médica</h4>
            <textarea 
                readOnly 
                value={prontuario.prescricaoMedica || 'Nenhuma prescrição registrada.'} 
                className={styles.textarea} 
            />
        </div>

        {/* Botões de Ação (Mantidos para lógica extra se houver listas) */}
        <div className={styles.actionButtons}>
            {/* Só exibe o botão se houver lista de exames/meds separada, ou mantém como atalho */}
            <Botao onClick={handleExibirExames} className={styles.examButton}>
                🧪 Exames Solicitados {prontuario.exames ? `(${prontuario.exames.length})` : ''}
            </Botao>
            <Botao onClick={handleExibirMedicamentos} className={styles.medButton}>
                💊 Medicamentos {prontuario.medicamentos ? `(${prontuario.medicamentos.length})` : ''}
            </Botao>
        </div>

        <div className={styles.closeButtonContainer}> 
            <Botao onClick={onClose} className={styles.closeModalButton}>
                Fechar Prontuário
            </Botao>
        </div>
      </div>
    </div>
  );
}