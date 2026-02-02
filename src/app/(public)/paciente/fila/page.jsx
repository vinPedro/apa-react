"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode";

import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import Botao from "@/components/Botao";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivBotoes from "@/components/DivBotoes";
import AlertMessage from "@/components/AlertMessage";
import Campo from "@/components/Campo";

export default function CadastroPacienteFila() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [pacienteInfo, setPacienteInfo] = useState({ 
        id: null, 
        nome: "", 
        unidadeId: null, 
        unidadeNome: "" 
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [fichaAtiva, setFichaAtiva] = useState(null);

    useEffect(() => {
        if (token && isAuthenticated) {
            carregarFluxoDados();
        }
    }, [token, isAuthenticated]);

    const carregarFluxoDados = async () => {
        try {
            setIsLoading(true);
            const decoded = jwtDecode(token);
            const userEmail = decoded.sub.toLowerCase();
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Busca Pacientes e Unidades Primeiro
            const [resPacientes, resUnidades] = await Promise.all([
                fetch('/api/pacientes', { headers }),
                fetch('/api/unidades', { headers })
            ]);

            if (!resPacientes.ok || !resUnidades.ok) throw new Error("Erro ao acessar base de dados.");

            const pacientes = await resPacientes.json();
            const unidades = await resUnidades.json();

            const pLogado = pacientes.find(p => p.email?.toLowerCase() === userEmail);

            if (pLogado) {
                const uDoc = unidades.find(u => u.id === pLogado.unidadeSaudeId || u.id === pLogado.ubsId);
                const unidadeId = pLogado.unidadeSaudeId || pLogado.ubsId;

                setPacienteInfo({
                    id: pLogado.id,
                    nome: pLogado.nomeCompleto,
                    unidadeId: unidadeId,
                    unidadeNome: uDoc ? uDoc.nome : "Unidade não identificada"
                });

                // 2. AGORA BUSCA ATENDIMENTOS PASSANDO O PARÂMETRO QUE O BACKEND EXIGE
                // Adicionamos ?unidadeSaudeId=... para satisfazer o Required Parameter do Spring
                const resAtendimentos = await fetch(`/api/atendimentos?unidadeSaudeId=${unidadeId}`, { headers });
                
                if (resAtendimentos.ok) {
                    const atendimentos = await resAtendimentos.json();
                    // Filtra apenas o atendimento ativo DESTE paciente específico
                    const ativo = atendimentos.find(a => 
                        a.pacienteId === pLogado.id && 
                        ["AGUARDANDO", "CHAMADO", "EM_ATENDIMENTO"].includes(a.status)
                    );
                    if (ativo) setFichaAtiva(ativo);
                }
            } else {
                setAlert({ message: "Perfil de paciente não encontrado.", variant: "error" });
            }
        } catch (error) {
            console.error("Erro no carregamento:", error);
            setAlert({ message: "Falha ao identificar sua unidade de saúde.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        if (fichaAtiva) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/atendimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pacienteId: pacienteInfo.id,
                    unidadeSaudeId: pacienteInfo.unidadeId,
                    prioridade: formData.prioridade ? "PRIORIDADE" : "NORMAL" 
                })
            });

            if (!response.ok) throw new Error("Erro ao gerar senha.");

            const data = await response.json();
            setFichaAtiva(data);
            setAlert({ message: "Senha gerada com sucesso!", variant: "success" });
        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !pacienteInfo.id) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">Verificando dados da unidade...</div>;
    }

    return (
        <div className="flex justify-center p-4 min-h-screen items-center bg-gray-50">
            {alert && <AlertMessage message={alert.message} variant={alert.variant} onClose={() => setAlert(null)} />}

            <DivFormulario>
                {fichaAtiva && (
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-900 shadow-sm">
                        <p className="font-bold">Sua senha: {fichaAtiva.senha}</p>
                        <p className="text-xs">Aguarde o chamado no painel da unidade.</p>
                    </div>
                )}

                <Formulario
                    initialValues={{ prioridade: false }}
                    titulo={pacienteInfo.nome ? `Olá, ${pacienteInfo.nome.split(' ')[0]}` : "Fila Virtual"} 
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleSelectChange }) => (
                        <div className="space-y-4">
                            <Campo label="Unidade:" value={pacienteInfo.unidadeNome} readOnly disabled />
                            <div className={fichaAtiva ? 'opacity-40 pointer-events-none' : ''}>
                                <ToggleSwitch 
                                    label="Atendimento prioritário?" 
                                    checked={formData.prioridade}
                                    onChange={(v) => handleSelectChange("prioridade", v)} 
                                    disabled={isLoading || !!fichaAtiva}
                                />
                            </div>
                            <DivBotoes>
                                <Botao type="submit" disabled={isLoading || !pacienteInfo.unidadeId || !!fichaAtiva}>
                                    {fichaAtiva ? "Senha Emitida" : isLoading ? "Carregando..." : "Gerar Senha"}
                                </Botao>
                            </DivBotoes>
                        </div>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}