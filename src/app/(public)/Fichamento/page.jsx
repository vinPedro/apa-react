"use client";

import { useRouter } from "next/navigation";
import VitalsForm from "@/components/VitalsForm";

const mockPatient = {
  nome: "Maria Silva",
  senha: "A23",
};

export default function FichamentoPage() {
  const router = useRouter();

  const handleSave = (data) => {
    console.log("Dados enviados:", data);

    // Aqui será o POST no backend
    router.push("/fila");
  };

  const handleCancel = () => {
    router.push("/fila");
  };

  return (
    <div>
      <h1>Registro de Sinais Vitais</h1>

      <VitalsForm
        patient={mockPatient}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
