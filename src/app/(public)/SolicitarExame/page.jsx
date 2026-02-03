"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode";

import DivFormulario from "@/components/DivFormulario";
import DivBotoes from "@/components/DivBotoes";
import Botao from "@/components/Botao";
import Textarea from "@/components/Textarea";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import AlertMessage from "@/components/AlertMessage";
import Campo from "@/components/Campo"; 

function SolicitarExameUX() {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // PEGA O CPF DA URL AGORA!
    const pacienteCpf = searchParams.get("cpf");
    const pacienteNome = searchParams.get("nome") || "Paciente";

    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profissionalId, setProfissionalId] = useState(null);

    const initialFormData = {
        descricao: "", 
        tipoExame: "",
        prioridade: "NORMAL" 
    };

    // 1. Busca Profissional
    useEffect(() => {
        if (!isAuthenticated) { router.push("/"); return; }
        const fetchProfissionalId = async () => {
            if (!token) return;
            try {
                const decoded = jwtDecode(token);
                const cpfLogado = decoded.sub; 
                const res = await fetch(`http://localhost:8080/api/profissionais/buscar?tipo=CPF&termo=${cpfLogado}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) setProfissionalId(data[0].id);
                }
            } catch (error) { console.error("Erro auth", error); }
        };
        fetchProfissionalId();
    }, [isAuthenticated, token, router]);

    // 2. Salvar usando CPF
    const handleSalvar = async (formData) => {
        if (!pacienteCpf) {
            setAlert({ message: "ERRO: CPF do paciente não encontrado na URL.", variant: "error" });
            return;
        }
        if (!profissionalId) {
            setAlert({ message: "ERRO: Profissional não identificado.", variant: "error" });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                pacienteCpf: pacienteCpf, // <--- MANDA O CPF
                profissionalId: Number(profissionalId),
                tipoExame: formData.tipoExame || "CLINICO",
                dataSolicitacao: new Date().toISOString().split('T')[0],
                descricao: formData.descricao,
                prioridade: formData.prioridade || "NORMAL",
                status: "PENDENTE" 
            };

            const response = await fetch("http://localhost:8080/api/exames", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.message || "Erro ao salvar solicitação.");
            }

            setAlert({ message: "Solicitação enviada com sucesso!", variant: "success" });
            setTimeout(() => router.back(), 1500);

        } catch (error) {
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (!pacienteCpf) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Erro de Identificação</h2>
                <p className="text-gray-600 mb-6">CPF do paciente não foi informado na navegação.</p>
                <Botao onClick={() => router.back()}>Voltar</Botao>
            </div>
        );
    }

    return (
        <DivFormulario maxWidth={800}>
            <div className="w-full mx-auto px-8">
                {alert && <AlertMessage {...alert} onClose={() => setAlert(null)} />}

                <Formulario
                    initialValues={initialFormData}
                    titulo={`🧪 Exame para CPF: ${pacienteCpf}`}
                    onSubmit={handleSalvar}
                >
                    {({ formData, handleChange, handleSelectChange }) => (
                        <div className="space-y-8">
                            <FieldGroup title={`Paciente: ${pacienteNome}`}>
                                <Textarea
                                    name="descricao"
                                    label="Descrição / Motivo"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    required
                                    placeholder="Descreva os exames..."
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Campo 
                                        label="Tipo de Exame"
                                        name="tipoExame"
                                        value={formData.tipoExame}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                        <select 
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            value={formData.prioridade}
                                            onChange={(e) => handleSelectChange("prioridade", e.target.value)}
                                        >
                                            <option value="NORMAL">Normal</option>
                                            <option value="PRIORIDADE">Urgência</option>
                                        </select>
                                    </div>
                                </div>
                            </FieldGroup>

                            <DivBotoes className="justify-end gap-4 mt-8">
                                <Botao type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Botao>
                                <Botao type="submit" disabled={loading || !profissionalId}>
                                    {loading ? "Enviando..." : "💾 Enviar Solicitação"}
                                </Botao>
                            </DivBotoes>
                        </div>
                    )}
                </Formulario>
            </div>
        </DivFormulario>
    );
}

export default function SolicitarExamePage() {
    return <Suspense fallback={<p>Carregando...</p>}><SolicitarExameUX /></Suspense>;
}