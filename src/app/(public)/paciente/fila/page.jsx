"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { jwtDecode } from "jwt-decode"; // Importar para ler o token

// Componentes
import DivFormulario from "@/components/DivFormulario";
import Formulario from "@/components/Formulario";
import ComboBox from "@/components/ComboBox";
import Botao from "@/components/Botao";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import DivBotoes from "@/components/DivBotoes";
import AlertMessage from "@/components/AlertMessage";

export default function CadastroPacienteFila() {
    const { token, isAuthenticated, profile } = useAuth();
    const router = useRouter();

    // Estados de Dados
    const [unidadesOptions, setUnidadesOptions] = useState([]);
    const [pacienteInfo, setPacienteInfo] = useState({ id: null, nome: "" });
    
    // Estados de Controle
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    
    // Estado do Formulário (inicial)
    const initialValues = { 
        unidadeSaudeId: "", 
        prioridade: false 
    };

    // --- 1. Proteção de Rota ---
    useEffect(() => {
        if (!isAuthenticated || profile !== "Paciente") {
            // router.push("/"); // Descomente para forçar o redirect se não logado
        }
    }, [isAuthenticated, profile, router]);

    // --- 2. Carregar Dados Iniciais (Unidades e Paciente) ---
    useEffect(() => {
        if (token) {
            carregarDadosIniciais();
        }
    }, [token]);

    const carregarDadosIniciais = async () => {
        try {
            setIsLoading(true);

            // A) Decodificar token para pegar o email (login)
            const decoded = jwtDecode(token);
            const userEmail = decoded.sub; // No PacienteService, o login é o email

            // B) Buscar Unidades e Lista de Pacientes em paralelo
            // (Nota: O ideal seria um endpoint /api/pacientes/me, mas vamos buscar na lista filtrando pelo email)
            const [resUnidades, resPacientes] = await Promise.all([
                fetch('/api/unidades', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/pacientes', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!resUnidades.ok || !resPacientes.ok) throw new Error("Falha ao carregar dados.");

            const unidades = await resUnidades.json();
            const pacientes = await resPacientes.json();

            // Configurar Opções do ComboBox
            const options = unidades.map(u => ({
                value: u.id,
                text: u.nome
            }));
            setUnidadesOptions(options);

            // Encontrar o paciente logado pelo email
            const pacienteLogado = pacientes.find(p => p.email === userEmail);
            if (pacienteLogado) {
                setPacienteInfo({ id: pacienteLogado.id, nome: pacienteLogado.nomeCompleto });
            } else {
                setAlert({ message: "Paciente não encontrado na base de dados.", variant: "error" });
            }

        } catch (error) {
            console.error(error);
            setAlert({ message: "Erro ao carregar dados do sistema.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // --- 3. Envio do Formulário (Gerar Senha) ---
    const handleSubmit = async (formData) => {
        setAlert(null);

        // Validações
        if (!formData.unidadeSaudeId) {
            setAlert({ message: "Selecione uma Unidade de Saúde.", variant: "warning" });
            return;
        }
        if (!pacienteInfo.id) {
            setAlert({ message: "Erro: Paciente não identificado.", variant: "error" });
            return;
        }

        setIsLoading(true);

        // Preparar DTO para o Backend
        const payload = {
            pacienteId: pacienteInfo.id,
            unidadeSaudeId: parseInt(formData.unidadeSaudeId, 10),
            // Converte booleano do Toggle para Enum do Backend (NORMAL ou PRIORIDADE)
            prioridade: formData.prioridade ? "PRIORIDADE" : "NORMAL" 
        };

        try {
            const response = await fetch('/api/atendimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.message || "Erro ao entrar na fila.");
            }

            const data = await response.json(); // AtendimentoResponseDTO

            // Sucesso: Mostrar a senha gerada
            setAlert({ 
                message: `Sucesso! Sua senha é: ${data.senha} (Status: ${data.status})`, 
                variant: "success" 
            });

        } catch (error) {
            console.error(error);
            setAlert({ message: error.message, variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center p-4 min-h-screen items-center">

            {/* Alerta Global */}
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
                    // Exibe o nome do paciente carregado ou "Carregando..."
                    titulo={pacienteInfo.nome ? `Olá, ${pacienteInfo.nome.split(' ')[0]}` : "Olá, Paciente"} 
                    subTitulo="Retirar nova senha:"
                    onSubmit={handleSubmit}
                >
                    {({ formData, handleSelectChange }) => (
                        <>
                            <ComboBox
                                label="Unidade de Saúde (UBS):"
                                name="unidadeSaudeId"
                                options={unidadesOptions} // Opções carregadas da API
                                value={formData.unidadeSaudeId}
                                onChange={(v) => handleSelectChange("unidadeSaudeId", v)}
                                disabled={isLoading}
                            />

                            <div className="py-2">
                                <ToggleSwitch 
                                    label="Prioridade (Idosos, Gestantes, PCD):" 
                                    id="prioridade-switch"
                                    checked={formData.prioridade}
                                    onChange={(valor) => handleSelectChange("prioridade", valor)} 
                                    disabled={isLoading}
                                />
                            </div>

                            <DivBotoes>
                                <Botao 
                                    type="submit" 
                                    disabled={isLoading || !pacienteInfo.id} // Trava se não carregou o paciente
                                >
                                    {isLoading ? "Processando..." : "Gerar Senha"}
                                </Botao>
                            </DivBotoes>
                        </>
                    )}
                </Formulario>
            </DivFormulario>
        </div>
    );
}