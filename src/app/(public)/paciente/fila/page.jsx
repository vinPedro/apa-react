"use client";

import { useEffect, useState, useCallback } from "react";
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

    // Função para limpar CPF (remove . e -)
    const limparCPF = (cpf) => (cpf ? String(cpf).replace(/\D/g, "") : "");

    const carregarFluxoDados = useCallback(async () => {
        try {
            setIsLoading(true);
            const decoded = jwtDecode(token);
            
            // Se o login é por CPF, o identificador geralmente está no campo 'sub'
            const cpfLogado = limparCPF(decoded.sub);
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Busca dados necessários
            const [resPacientes, resUnidades] = await Promise.all([
                fetch('/api/pacientes', { headers }),
                fetch('/api/unidades', { headers })
            ]);

            if (!resPacientes.ok || !resUnidades.ok) {
                throw new Error("Erro ao conectar com o servidor.");
            }

            const pacientes = await resPacientes.json();
            const unidades = await resUnidades.json();

            // 2. Encontra o paciente pelo CPF
            const pLogado = pacientes.find(p => limparCPF(p.cpf) === cpfLogado);

            if (!pLogado) {
                setAlert({ message: "Paciente não localizado no sistema.", variant: "error" });
                return;
            }

            // 3. Identifica a UBS (tenta unidadeSaudeId ou ubsId)
            const unidadeId = pLogado.unidadeSaudeId || pLogado.ubsId;
            const uDoc = unidades.find(u => u.id === unidadeId);

            if (!unidadeId) {
                setAlert({ message: "Você ainda não possui uma unidade de saúde vinculada.", variant: "error" });
            }

            setPacienteInfo({
                id: pLogado.id,
                nome: pLogado.nomeCompleto,
                unidadeId: unidadeId,
                unidadeNome: uDoc ? uDoc.nome : "Unidade não identificada"
            });

            // 4. Busca atendimentos ativos para este paciente nesta unidade
            if (unidadeId) {
                const resAtendimentos = await fetch(`/api/atendimentos?unidadeSaudeId=${unidadeId}`, { headers });
                
                if (resAtendimentos.ok) {
                    const atendimentos = await resAtendimentos.json();
                    const ativo = atendimentos.find(a => 
                        a.pacienteId === pLogado.id && 
                        ["AGUARDANDO", "CHAMADO", "EM_ATENDIMENTO"].includes(a.status)
                    );
                    if (ativo) setFichaAtiva(ativo);
                }
            }

        } catch (error) {
            console.error("Erro no carregamento:", error);
            setAlert({ message: "Falha ao carregar seus dados de saúde.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && isAuthenticated) {
            carregarFluxoDados();
        }
    }, [token, isAuthenticated, carregarFluxoDados]);

    const handleSubmit = async (formData) => {
        if (fichaAtiva || !pacienteInfo.unidadeId) return;
        
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao gerar senha.");
            }

            const data = await response.json();
            setFichaAtiva(data);
            setAlert({ message: "Sua senha foi gerada com sucesso!", variant: "success" });
        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !pacienteInfo.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-blue-600 font-bold animate-pulse">Sincronizando com sua UBS...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-4 min-h-screen items-center bg-gray-50">
            {alert && <AlertMessage message={alert.message} variant={alert.variant} onClose={() => setAlert(null)} />}

            <DivFormulario>
                {fichaAtiva && (
                    <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded shadow-sm">
                        <p className="text-green-800 font-semibold text-sm uppercase tracking-wider">Senha Atual</p>
                        <h2 className="text-4xl font-black text-green-900 my-1">{fichaAtiva.senha}</h2>
                        <p className="text-green-700 text-xs">Aguarde o chamado no painel da unidade.</p>
                    </div>
                )}

                <Formulario
                    initialValues={{ prioridade: false }}
                    titulo={pacienteInfo.nome ? `Olá, ${pacienteInfo.nome.split(' ')[0]}` : "Fila Virtual"} 
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleSelectChange }) => (
                        <div className="space-y-4">
                            <Campo 
                                label="Sua Unidade de Saúde:" 
                                value={pacienteInfo.unidadeNome} 
                                readOnly 
                                disabled 
                            />
                            
                            <div className={fichaAtiva ? 'opacity-40 pointer-events-none' : ''}>
                                <ToggleSwitch 
                                    label="Necessito de atendimento prioritário" 
                                    checked={formData.prioridade}
                                    onChange={(v) => handleSelectChange("prioridade", v)} 
                                    disabled={isLoading || !!fichaAtiva}
                                />
                                <p className="text-[10px] text-gray-500 mt-1 px-1">
                                    (Idosos, gestantes, pessoas com deficiência ou crianças de colo)
                                </p>
                            </div>

                            <DivBotoes>
                                <Botao 
                                    type="submit" 
                                    disabled={isLoading || !pacienteInfo.unidadeId || !!fichaAtiva}
                                >
                                    {fichaAtiva ? "Aguardando Chamado..." : isLoading ? "Processando..." : "Entrar na Fila"}
                                </Botao>
                            </DivBotoes>
                        </div>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}