import React from 'react';
import Botao from '@/components/Botao';
import styles from './ProntuarioModal.module.css'; 

export default function ProntuarioModal({ prontuario, onClose }) {
  
  

  const handleExibirExames = () => {
    console.log('Ação: Abrir visualizador de exames para:', prontuario.exames);
    
    // ⬇️⬇️⬇️ CONEXÃO OPCIONAL COM O BACKEND (EXAMES) ⬇️⬇️⬇️
    // Se quiser exibir os exames em um NOVO modal:
    // 1. Implemente a lógica para buscar os detalhes completos dos exames (se necessário).
    // 2. Abra um novo modal de 'ExamesDetalhes' passando 'prontuario.exames'.
    // alert('Ação simulada: Exibir Exames');
    // ⬆️⬆️⬆️ FIM DA CONEXÃO OPCIONAL ⬆️⬆️⬆️
  };

  const handleExibirMedicamentos = () => {
    console.log('Ação: Abrir visualizador de medicamentos para:', prontuario.medicamentos);

    // ⬇️⬇️⬇️ CONEXÃO OPCIONAL COM O BACKEND (MEDICAMENTOS) ⬇️⬇️⬇️
    // Se quiser exibir os medicamentos em um NOVO modal:
    // 1. Implemente a lógica para buscar os detalhes completos dos medicamentos (se necessário).
    // 2. Abra um novo modal de 'MedicamentosDetalhes' passando 'prontuario.medicamentos'.
    // alert('Ação simulada: Exibir Medicamentos');
    // ⬆️⬆️⬆️ FIM DA CONEXÃO OPCIONAL ⬆️⬆️⬆️
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
            <p><strong>📅 Data do Atendimento:</strong> {prontuario.data}</p>
            <p><strong>🧑‍⚕️ Médico(a):</strong> {prontuario.medico}</p>
        </div>
        
        <div className={styles.section}>
            <h4>1. Anamnese e Histórico</h4>
            <textarea readOnly value={prontuario.anamnese || 'Nenhuma anamnese registrada.'} className={styles.textarea} />
        </div>
        
        <div className={styles.section}>
            <h4>2. Diagnóstico Principal</h4>
            <p className={styles.diagnosisTag}>{prontuario.diagnostico || 'Não informado.'}</p>
        </div>

        {/* Botões de Ação */}
        <div className={styles.actionButtons}>
            <Botao onClick={handleExibirExames} className={styles.examButton}>
                🧪 Exibir Exames ({prontuario.exames ? prontuario.exames.length : 0})
            </Botao>
            <Botao onClick={handleExibirMedicamentos} className={styles.medButton}>
                💊 Exibir Medicamentos ({prontuario.medicamentos ? prontuario.medicamentos.length : 0})
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