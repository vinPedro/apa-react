"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";

import DivFormulario from "@/components/DivFormulario";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import Textarea from "@/components/Textarea";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import AlertMessage from "@/components/AlertMessage";
import ProntuarioModal from "@/components/Modal/ProntuarioModal"; 

function ProntuarioUX() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 1. CAPTURA IMEDIATA DOS IDS NA URL
    const atendimentoIdURL = searchParams.get("atendimentoId");
    const pacienteIdURL = searchParams.get("pacienteId");

    const [step, setStep] = useState(1);
    const [nomeBusca, setNomeBusca] = useState("");
    const [pacientes, setPacientes] = useState([]);
    
    const [paciente, setPaciente] = useState(null);

    // Estados do Histórico
    const [historicoConsultas, setHistoricoConsultas] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProntuario, setSelectedProntuario] = useState(null);
    
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    // ALTERAÇÃO 1: Adicionado 'setInitialFormData' para poder atualizar com o rascunho
    const [initialFormData, setInitialFormData] = useState({
        queixa: "",
        historico: "",
        diagnostico: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
            return;
        }

        // Se veio da Fila (tem IDs na URL), carrega direto
        if (atendimentoIdURL && token) {
            recuperarDadosVitais(atendimentoIdURL);
        }
    }, [isAuthenticated, router, atendimentoIdURL, token]);

    const recuperarDadosVitais = async (idAtendimento) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/atendimentos/${idAtendimento}/dados-consulta`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error("Erro ao carregar dados da triagem");
            
            const dados = await response.json();
            
            // Tenta garantir o CPF
            let cpfPaciente = dados.pacienteCpf || dados.cpfPaciente;
            const idPacienteFinal = dados.pacienteId || pacienteIdURL;

            if (!cpfPaciente && idPacienteFinal) {
                try {
                    const resPac = await fetch(`http://localhost:8080/api/pacientes/${idPacienteFinal}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (resPac.ok) {
                        const dPac = await resPac.json();
                        cpfPaciente = dPac.cpf;
                    }
                } catch (e) { console.error("Falha ao buscar CPF extra", e); }
            }

            setPaciente({
                id: idPacienteFinal, 
                cpf: cpfPaciente,
                nomeCompleto: dados.pacienteNome || "Paciente",
                peso: dados.peso,
                altura: dados.altura,
                pressaoArterial: dados.pressaoArterial,
                atendimentoId: idAtendimento
            });

            // ALTERAÇÃO 2: Verificar se existe rascunho salvo para este atendimento
            if (idAtendimento) {
                const rascunho = localStorage.getItem(`rascunho_prontuario_${idAtendimento}`);
                if (rascunho) {
                    const dadosSalvos = JSON.parse(rascunho);
                    setInitialFormData((prev) => ({ ...prev, ...dadosSalvos }));
                    console.log("Rascunho recuperado:", dadosSalvos);
                }
            }

            setStep(2);
        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // --- AÇÃO DO BOTÃO "SOLICITAR EXAME" ---
    const irParaExames = () => {
        const cpfParaUsar = paciente?.cpf;
        const nomeParaUsar = paciente?.nomeCompleto || "Paciente";

        if (cpfParaUsar) {
            // O dado já foi salvo automaticamente no 'onChange', então só redireciona
            router.push(`/SolicitarExame?cpf=${cpfParaUsar}&nome=${encodeURIComponent(nomeParaUsar)}`);
        } else {
            setAlert({ message: "Erro: CPF do paciente não identificado.", variant: "error" });
        }
    };

    // --- BUSCAR HISTÓRICO ---
    const handleVisualizarHistorico = async () => {
        if (!paciente?.cpf) {
             setAlert({ message: "CPF do paciente não identificado ainda. Aguarde carregamento.", variant: "warning" });
             return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/prontuarios?cpfPaciente=${paciente.cpf}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const dados = await response.json();
                if (!dados || dados.length === 0) {
                    setAlert({ message: "Nenhum histórico anterior encontrado.", variant: "info" });
                } else {
                    setHistoricoConsultas(dados);
                    setShowHistoryModal(true);
                }
            } else {
                throw new Error("Erro ao buscar histórico.");
            }
        } catch (err) {
            setAlert({ message: err.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (p) => {
        setSelectedProntuario({
            dataHoraFinalizacao: p.dataHoraFinalizacao, // Passa o campo correto para o modal
            data: p.dataHoraFinalizacao ? new Date(p.dataHoraFinalizacao).toLocaleDateString() : '---',
            nomeMedico: p.nomeMedico,
            medico: p.nomeMedico || 'Médico Responsável', 
            queixaPrincipal: p.queixaPrincipal,
            historicoDoenca: p.historicoDoenca,
            diagnostico: p.diagnostico,
            prescricaoMedica: p.prescricaoMedica,
            medicamentos: p.prescricaoMedica ? [p.prescricaoMedica] : [],
            exames: p.examesSolicitados ? [p.examesSolicitados] : []
        });
        setShowDetailModal(true);
    };

    const handleFinalizar = async (values) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/prontuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    atendimentoId: Number(atendimentoIdURL),
                    pacienteId: Number(paciente?.id || pacienteIdURL),
                    queixaPrincipal: values.queixa,
                    historicoDoenca: values.historico,
                    diagnostico: values.diagnostico
                }),
            });
            if (!response.ok) throw new Error("Erro ao salvar prontuário.");
            
            // ALTERAÇÃO 3: Limpar o rascunho após sucesso
            if (atendimentoIdURL) {
                localStorage.removeItem(`rascunho_prontuario_${atendimentoIdURL}`);
            }

            setAlert({ message: "Prontuário salvo!", variant: "success" });
            setTimeout(() => router.push("/ProfissionalDeSaude"), 1500);
        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Busca de paciente avulsa
    useEffect(() => {
        if (!nomeBusca || nomeBusca.length < 3 || atendimentoIdURL) {
            setPacientes([]); return;
        }
        const t = setTimeout(async () => {
            if(!token) return;
            try {
                const r = await fetch(`http://localhost:8080/api/pacientes/buscar?tipo=NOME&termo=${encodeURIComponent(nomeBusca)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(r.ok) setPacientes(await r.json());
            } catch {}
        }, 500);
        return () => clearTimeout(t);
    }, [nomeBusca]);

    return (
        <DivFormulario maxWidth={1200}>
            <div className="w-full mx-auto px-8 relative">
                {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

                {/* MODAL LISTA DE HISTÓRICO */}
                {showHistoryModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-800">Histórico de Consultas</h3>
                                <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                            </div>
                            <div className="space-y-3">
                                {historicoConsultas.map(h => (
                                    <div 
                                        key={h.id} 
                                        className="border p-4 rounded hover:bg-blue-50 cursor-pointer transition"
                                        onClick={() => handleOpenDetail(h)}
                                    >
                                        <p className="font-bold text-blue-700">
                                            {h.dataHoraFinalizacao ? new Date(h.dataHoraFinalizacao).toLocaleDateString() : 'Data N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">{h.queixaPrincipal}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {showDetailModal && selectedProntuario && (
                    <ProntuarioModal 
                        prontuario={selectedProntuario} 
                        onClose={() => setShowDetailModal(false)} 
                    />
                )}

                {step === 1 && (
                    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-6">🔎 Buscar Paciente</h1>
                        <Campo label="Nome" value={nomeBusca} onChange={(e) => setNomeBusca(e.target.value)} />
                        {pacientes.map(p => (
                            <div key={p.id} className="border-b p-2 flex justify-between">
                                <span>{p.nomeCompleto}</span>
                                <Botao onClick={() => { setPaciente({...p, atendimentoId: null}); setStep(2); }}>Atender</Botao>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <Formulario initialValues={initialFormData} titulo={`📋 ${paciente?.nomeCompleto || "Carregando..."}`} onSubmit={handleFinalizar}>
                        {({ formData, handleChange }) => {
                            
                            // ALTERAÇÃO 4: Função Helper para salvar no localStorage a cada mudança
                            const handleChangeComSave = (e) => {
                                handleChange(e); // Chama o original do Formulario
                                
                                // Salva no LocalStorage
                                if (atendimentoIdURL) {
                                    const key = `rascunho_prontuario_${atendimentoIdURL}`;
                                    const saved = JSON.parse(localStorage.getItem(key) || '{}');
                                    saved[e.target.name] = e.target.value;
                                    localStorage.setItem(key, JSON.stringify(saved));
                                }
                            };

                            return (
                                <div className="space-y-6">
                                    <FieldGroup title="Anamnese">
                                        <Textarea 
                                            name="queixa" 
                                            label="Queixa" 
                                            value={formData.queixa} 
                                            onChange={handleChangeComSave} // Usa a nova função
                                        />
                                        <Textarea 
                                            name="historico" 
                                            label="Histórico" 
                                            value={formData.historico} 
                                            onChange={handleChangeComSave} // Usa a nova função
                                        />
                                    </FieldGroup>
                                    <FieldGroup title="Dados Vitais">
                                        <div className="flex gap-4">
                                            <Campo label="Peso" value={paciente?.peso || '-'} disabled />
                                            <Campo label="Pressão" value={paciente?.pressaoArterial || '-'} disabled />
                                        </div>
                                    </FieldGroup>
                                    <FieldGroup title="Diagnóstico">
                                        <Textarea 
                                            name="diagnostico" 
                                            value={formData.diagnostico} 
                                            onChange={handleChangeComSave} // Usa a nova função
                                        />
                                    </FieldGroup>
                                    <DivBotoes className="flex-wrap gap-2 justify-center">
                                        
                                        <Botao 
                                            type="button" 
                                            onClick={irParaExames} 
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            🧪 SOLICITAR EXAMES
                                        </Botao>
                                        
                                        <Botao 
                                            type="button" 
                                            onClick={handleVisualizarHistorico} 
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            📚 HISTÓRICO
                                        </Botao>
                                        
                                        <Botao type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                            {loading ? "Salvando..." : "FINALIZAR"}
                                        </Botao>
                                    </DivBotoes>
                                </div>
                            );
                        }}
                    </Formulario>
                )}
            </div>
        </DivFormulario>
    );
}

export default function Page() {
    return <Suspense fallback={<p>Carregando...</p>}><ProntuarioUX /></Suspense>;
}