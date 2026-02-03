"use client";

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react'; 
import Campo from '@/components/Campo.jsx';                 
import Botao from '@/components/Botao.jsx';                 
import AlertMessage from '@/components/AlertMessage'; 

export default function PrimeiroAdminForm({ onCadastroSucesso }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setAlert({ message: 'Preencha todos os campos.', variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/setup/criar-admin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, senha: password }), 
      });
      if (response.ok || response.status === 201) { 
        setAlert({ message: 'Sistema configurado! Redirecionando...', variant: 'success' });
        if (onCadastroSucesso) setTimeout(onCadastroSucesso, 2000); 
      } else {
        const data = await response.json(); 
        setAlert({ message: `Erro: ${data.message || 'Falha ao cadastrar.'}`, variant: 'error' });
      }
    } catch (error) {
      setAlert({ message: 'Erro de conexão com o servidor.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    /* h-full e flex-col justify-center garantem o meio exato do card */
    <div className="w-full min-h-[500px] flex flex-col justify-center py-4"> 
        {alert && (
            <div className="absolute top-4 left-0 right-0 px-4">
                <AlertMessage 
                    message={alert.message} 
                    variant={alert.variant} 
                    onClose={() => setAlert(null)} 
                />
            </div>
        )}

        {/* --- CABEÇALHO --- */}
        <div className="flex flex-col items-center text-center mb-8"> 
            <div className="bg-red-50 p-4 rounded-full mb-4 shadow-sm border border-red-100">
                <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Configuração Crítica
            </h2>
            
            <div className="h-1.5 w-12 bg-blue-600 rounded-full my-3"></div>
            
            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                Primeiro acesso ao <span className="text-blue-600 font-bold">APA</span>. 
                Crie as credenciais do Administrador.
            </p>
        </div>

        {/* --- FORMULÁRIO --- */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm mx-auto px-2"> 
            
            <Campo
                label="Nome de Usuário (Admin)"
                placeholder="Ex: admin.master"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
            />
            
            <div>
                <Campo
                    label="Senha de Acesso"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <div className="flex justify-between items-center mt-1.5 px-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Segurança Alta</span>
                    <span className="text-[10px] text-slate-400">Mínimo 6 caracteres</span>
                </div>
            </div>

            <div className="mt-4 flex justify-center w-full"> 
                <div className="w-full max-w-[240px]">
                    <Botao 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            backgroundColor: '#2563eb', 
                            color: 'white',
                            borderRadius: '0.75rem',
                            padding: '10px 0',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center'
                        }} 
                    >
                        {loading ? 'Ativando...' : 'Ativar Sistema'}
                    </Botao>
                </div>
            </div>
        </form>
        
        <p className="text-center text-[10px] text-slate-400 mt-12 uppercase tracking-[0.2em]">
            ASSISTENTE DE PRONTO ATENDIMENTO © 2026
        </p>
    </div>
  );
}