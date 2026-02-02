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

/* =============================
    COMPONENTE PRINCIPAL
============================= */
function ProntuarioUX() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const atendimentoIdURL = searchParams.get("atendimentoId");

    /* ===== CONTROLE ===== */
    const [step, setStep] = useState(1);

    /* ===== BUSCA ===== */
    const [nomeBusca, setNomeBusca] = useState("");
    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState(null);

    /* ===== DADOS ===== */
    const [historicoConsultas, setHistoricoConsultas] = useState([]);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const [initialFormData] = useState({
        queixa: "",
        historico: "",
        diagnostico: "",
    });

    /* ======================
        PROTEÇÃO E CARGA AUTOMÁTICA
    ====================== */
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
            return;
        }

        // Se vier da fila (com atendimentoId), busca dados vitais automaticamente
        if (atendimentoIdURL && token) {
            recuperarDadosVitais(atendimentoIdURL);
        }
    }, [isAuthenticated, router, atendimentoIdURL, token]);

    /* ======================
        BUSCAR DADOS VITAIS (NOVO ENDPOINT)
    ====================== */
    const recuperarDadosVitais = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/atendimentos/${id}/dados-consulta`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Erro ao carregar dados da triagem");
            const dados = await response.json();
            
            setPaciente({
                id: dados.pacienteId,
                nomeCompleto: dados.pacienteNome,
                peso: dados.peso,
                altura: dados.altura,
                pressaoArterial: dados.pressaoArterial,
                atendimentoId: id
            });
            setStep(2);
        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    /* ======================
        BUSCA AUTOMÁTICA (DEBOUNCE - MANTIDO)
    ====================== */
    useEffect(() => {
        if (!nomeBusca || nomeBusca.length < 3 || atendimentoIdURL) {
            setPacientes([]);
            return;
        }

        const timeout = setTimeout(() => {
            buscarPaciente();
        }, 500);

        return () => clearTimeout(timeout);
    }, [nomeBusca]);

    /* ======================
        BUSCAR PACIENTES (MANTIDO)
    ====================== */
    const buscarPaciente = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/pacientes/buscar?tipo=NOME&termo=${encodeURIComponent(nomeBusca)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.ok) setPacientes(await response.json());
        } catch (error) {
            setAlert({ message: "Erro ao buscar pacientes", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    /* ======================
        ATENDER PACIENTE (INTERAÇÃO MANTIDA)
    ====================== */
    const atenderPaciente = async (p) => {
        setPaciente(p);
        setStep(2);
        setPacientes([]);
        setNomeBusca("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/prontuarios/paciente/${p.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.ok) setHistoricoConsultas(await response.json());
        } catch {
            setHistoricoConsultas([]);
        }
    };

    /* ======================
        FINALIZAR ATENDIMENTO (SALVAR E REDIRECIONAR)
    ====================== */
    const handleFinalizar = async (values) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/prontuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    atendimentoId: Number(paciente.atendimentoId || atendimentoIdURL),
                    pacienteId: Number(paciente.id),
                    queixaPrincipal: values.queixa,
                    historicoDoenca: values.historico,
                    diagnostico: values.diagnostico
                }),
            });

            if (!response.ok) throw new Error("Erro ao salvar prontuário.");

            setAlert({ message: "Prontuário salvo com sucesso!", variant: "success" });

            setTimeout(() => {
                router.push("/ProfissionalDeSaude");
            }, 1500);

        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DivFormulario maxWidth={1200}>
            <div className="w-full mx-auto px-8">
                {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

                {/* ===== ETAPA 1 — BUSCA (MANTIDA IDÊNTICA) ===== */}
                {step === 1 && (
                    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-6">🔎 Buscar Paciente</h1>
                        <Campo label="Nome do Paciente" value={nomeBusca} onChange={(e) => setNomeBusca(e.target.value)} />
                        {loading && <p className="mt-2 text-sm text-gray-500">Buscando...</p>}
                        {pacientes.length > 0 && (
                            <div className="mt-6 border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left">Nome</th>
                                            <th className="p-3 text-left">ID</th>
                                            <th className="p-3 text-center">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pacientes.map((p) => (
                                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                                <td className="p-3">{p.nomeCompleto}</td>
                                                <td className="p-3">{p.id}</td>
                                                <td className="p-3 text-center">
                                                    <Botao onClick={() => atenderPaciente(p)}>Atender</Botao>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== ETAPA 2 — PRONTUÁRIO (MANTIDA IDÊNTICA COM VITAIS DINÂMICOS) ===== */}
                {step === 2 && paciente && (
                    <Formulario
                        initialValues={initialFormData}
                        titulo={`📋 Prontuário • ${paciente.nomeCompleto}`}
                        onSubmit={handleFinalizar}
                    >
                        {({ formData, handleChange }) => (
                            <div className="space-y-8 max-w-5xl mx-auto">
                                <FieldGroup title="🧠 Anamnese">
                                    <Textarea name="queixa" label="Queixa Principal" value={formData.queixa} onChange={handleChange} />
                                    <Textarea name="historico" label="Histórico" value={formData.historico} onChange={handleChange} />
                                </FieldGroup>

                                <FieldGroup title="⚖️ Dados Vitais (Registrados)">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
                                        <Campo label="Peso (kg)" value={paciente.peso ?? "---"} disabled />
                                        <Campo label="Altura (cm)" value={paciente.altura ?? "---"} disabled />
                                        <Campo label="Pressão Arterial" value={paciente.pressaoArterial ?? "---"} disabled />
                                    </div>
                                </FieldGroup>

                                <FieldGroup title="🧾 Diagnóstico">
                                    <Textarea name="diagnostico" value={formData.diagnostico} onChange={handleChange} />
                                </FieldGroup>

                                <DivBotoes className="justify-center flex-wrap gap-4">
                                    <Botao type="button" onClick={() => router.push(`/SolicitarExame?pacienteId=${paciente.id}&nome=${encodeURIComponent(paciente.nomeCompleto)}`)}>
                                        🧪 SOLICITAR EXAMES
                                    </Botao>
                                    <Botao>💊 PREESCREVER RECEITAS</Botao>
                                    <Botao>📝 ATRIBUIR ATESTADO</Botao>
                                    <Botao>📚 VISUALIZAR HISTÓRICO</Botao>
                                    <Botao type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                        {loading ? "SALVANDO..." : "✅ FINALIZAR ATENDIMENTO"}
                                    </Botao>
                                </DivBotoes>
                            </div>
                        )}
                    </Formulario>
                )}
            </div>
        </DivFormulario>
    );
}

export default function CadastroProntuarioPage() {
    return (
        <Suspense fallback={<p>Carregando...</p>}>
            <ProntuarioUX />
        </Suspense>
    );
}