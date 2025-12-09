"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";
import VitalsForm from "@/components/VitalsForm";
import AlertMessage from "@/components/AlertMessage";

// Componente interno para usar o useSearchParams (necessário no Next.js 13+ com Suspense)
function FichamentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Captura dados da URL
  const atendimentoId = searchParams.get("atendimentoId");
  const nomePaciente = searchParams.get("paciente") || ""; // Pega o nome se vier na URL

  const [patientData, setPatientData] = useState({
    nome: "",
    senha: "", // Senha não temos fácil aqui, deixamos em branco ou ajustamos se necessário
  });

  useEffect(() => {
    if (nomePaciente) {
      setPatientData(prev => ({ ...prev, nome: nomePaciente }));
    }
  }, [nomePaciente]);

  const handleSave = async (formData) => {
    setAlert(null);

    if (!atendimentoId) {
      setAlert({ message: "Erro: ID do atendimento não identificado.", variant: "error" });
      return;
    }

    setIsLoading(true);

    // 2. Prepara o Payload conforme FichamentoDTO do Java
    const payload = {
      atendimentoId: parseInt(atendimentoId, 10),
      // Converte strings para números (tratando vírgula se o usuário digitar 80,5)
      peso: formData.peso ? parseFloat(formData.peso.replace(',', '.')) : null,
      altura: formData.altura ? parseFloat(formData.altura.replace(',', '.')) : null,
      temperatura: formData.temperatura ? parseFloat(formData.temperatura.replace(',', '.')) : null,
      pressaoArterial: formData.pressao, // Backend espera String (ex: "12/8")
      sintomas: formData.sintomas,
      observacao: "" // Campo opcional que não está no form visual, mas existe no DTO
    };

    try {
      const response = await fetch("http://localhost:8080/api/fichamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao salvar fichamento.");
      }

      setAlert({ message: "Triagem realizada com sucesso!", variant: "success" });
      
      // 3. Redireciona após sucesso (volta para a fila de Triagem ou para Fichas Ativas)
      setTimeout(() => {
        router.push("/FiltroStatusPaciente"); 
      }, 2000);

    } catch (error) {
      console.error("Erro no fichamento:", error);
      setAlert({ message: error.message, variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {alert && (
        <AlertMessage 
            message={alert.message} 
            variant={alert.variant} 
            onClose={() => setAlert(null)} 
        />
      )}

      {/* Passamos o patientData para pré-preencher o nome no visual (apenas leitura) */}
      <VitalsForm
        patient={patientData} 
        onSalvar={handleSave}
        onCancelar={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function FichamentoPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <FichamentoContent />
    </Suspense>
  );
}