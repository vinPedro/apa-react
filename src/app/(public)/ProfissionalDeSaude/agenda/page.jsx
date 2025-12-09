"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode";

import Botao from "@/components/Botao";
import Campo from "@/components/Campo";
import DivFormulario from "@/components/DivFormulario";
import FieldGroup from "@/components/FieldGroup";
import Formulario from "@/components/Formulario";
import { MultiSelectGroup, MultiSelectOption } from "@/components/MultiSelectGroup";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivBotoes from "@/components/DivBotoes";
import AlertMessage from "@/components/AlertMessage";

// Mapa de conversão Front -> Back
const DIAS_MAP = {
    "domingo": "DOMINGO",
    "segunda": "SEGUNDA",
    "terca": "TERCA",
    "quarta": "QUARTA",
    "quinta": "QUINTA",
    "sexta": "SEXTA",
    "sabado": "SABADO"
};

// Mapa Inverso Back -> Front (para preencher o form ao carregar)
const DIAS_MAP_INVERSE = Object.fromEntries(
    Object.entries(DIAS_MAP).map(([k, v]) => [v, k])
);

export default function AgendaProfissional() {
    const { token, isAuthenticated, profile } = useAuth();
    const router = useRouter();

    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profissionalId, setProfissionalId] = useState(null);
    
    // Estado inicial vazio, será preenchido pelo useEffect
    const [initialValues, setInitialValues] = useState({ 
        inicio: "", 
        fim: "", 
        dias: [], 
        disponivel: false 
    });

    // --- 1. Proteção de Rota e Carga de Dados ---
    useEffect(() => {
        if (!isAuthenticated || profile !== "ProfissionaldeSaude") {
            // router.push("/"); // Descomente em produção
        }

        if (token) {
            carregarDadosProfissional();
        }
    }, [isAuthenticated, profile, router, token]);

    const carregarDadosProfissional = async () => {
        try {
            setIsLoading(true);
            // Pega o CPF (login) do token
            const decoded = jwtDecode(token);
            const userLogin = decoded.sub;

            // Busca o profissional pelo CPF para pegar o ID e dados atuais
            // Endpoint: /api/profissionais/buscar?tipo=CPF&termo=...
            const res = await fetch(`http://localhost:8080/api/profissionais/buscar?tipo=CPF&termo=${userLogin}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erro ao buscar dados do profissional.");

            const data = await res.json();
            
            if (data && data.length > 0) {
                const prof = data[0]; // Pega o primeiro (e único) resultado
                setProfissionalId(prof.id);

                // Preenche o formulário com o que já está salvo no banco
                setInitialValues({
                    inicio: prof.horaInicio ? prof.horaInicio.substring(0, 5) : "", // Remove os segundos se houver
                    fim: prof.horaFim ? prof.horaFim.substring(0, 5) : "",
                    dias: prof.diasTrabalho ? prof.diasTrabalho.map(d => DIAS_MAP_INVERSE[d]) : [],
                    disponivel: prof.disponivelAtualmente
                });
            } else {
                setAlert({ message: "Profissional não encontrado na base de dados.", variant: "error" });
            }

        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setAlert({ message: "Falha ao carregar suas informações.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. Handler de Mudança nos Dias ---
    function handleDiasChange(novosDias, handleSelectChange) {
        handleSelectChange("dias", novosDias);
    }

    // --- 3. Envio do Formulário (PUT) ---
    const handleSubmit = async (formData) => {
        setAlert(null);

        if (!profissionalId) {
            setAlert({ message: "Erro de identificação do profissional.", variant: "error" });
            return;
        }

        setIsLoading(true);

        // Prepara o DTO (DisponibilidadeDTO)
        const payload = {
            // Converte array de strings minúsculas para array de Enums maiúsculos
            diasTrabalho: formData.dias.map(d => DIAS_MAP[d]),
            horaInicio: formData.inicio,
            horaFim: formData.fim,
            disponivelAtualmente: formData.disponivel
        };

        try {
            const response = await fetch(`http://localhost:8080/api/profissionais/${profissionalId}/disponibilidade`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar agenda.");
            }

            setAlert({ message: "Agenda e disponibilidade atualizadas com sucesso!", variant: "success" });

        } catch (error) {
            console.error("Erro ao salvar agenda:", error);
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // Evita renderizar o formulário vazio antes de carregar os dados
    if (isLoading && !profissionalId) {
        return <div className="p-10 text-center text-gray-500">Carregando perfil...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full p-4">
            {alert && (
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            )}

            <DivFormulario>
                <Formulario
                    initialValues={initialValues}
                    titulo="Minha Agenda e Status"
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleChange, handleSelectChange }) => (
                        <>
                            <FieldGroup title="Dias de Trabalho">
                                <MultiSelectGroup 
                                    values={formData.dias} 
                                    onChange={(novosDias) => handleDiasChange(novosDias, handleSelectChange)}
                                >
                                    <MultiSelectOption value="segunda">Segunda</MultiSelectOption>
                                    <MultiSelectOption value="terca">Terça</MultiSelectOption>
                                    <MultiSelectOption value="quarta">Quarta</MultiSelectOption>
                                    <MultiSelectOption value="quinta">Quinta</MultiSelectOption>
                                    <MultiSelectOption value="sexta">Sexta</MultiSelectOption>
                                    <MultiSelectOption value="sabado">Sábado</MultiSelectOption>
                                    <MultiSelectOption value="domingo">Domingo</MultiSelectOption>
                                </MultiSelectGroup>
                            </FieldGroup>

                            <FieldGroup title="Horário de Atendimento">
                                <Campo
                                    type="time"
                                    label="Início"
                                    name="inicio"
                                    value={formData.inicio}
                                    onChange={handleChange}
                                />

                                <Campo
                                    type="time"
                                    label="Fim"
                                    name="fim"
                                    value={formData.fim}
                                    onChange={handleChange}
                                />
                            </FieldGroup>

                            <div className="py-4 px-2 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                                <ToggleSwitch
                                    label="Estou Disponível Agora (Aparecer na fila)"
                                    id="disponivel-switch"
                                    checked={formData.disponivel}
                                    onChange={(valor) => handleSelectChange("disponivel", valor)}
                                />
                            </div>

                            <DivBotoes>
                                <Botao type="submit" disabled={isLoading}>
                                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                                </Botao>
                            </DivBotoes>

                        </>)}
                </Formulario>
            </DivFormulario>
        </div>
    );
}