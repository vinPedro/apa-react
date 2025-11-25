"use client";

import React, { useState } from 'react';
import { ShieldAlert, User, Lock } from 'lucide-react'; // Ícones modernos
import DivFormulario from '@/components/DivFormulario.jsx'; 
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
    setAlert(null);

    try {
      const response = await fetch('/api/setup/criar-admin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, senha: password }), 
      });

      if (response.ok || response.status === 201) { 
        setAlert({ message: 'Sistema configurado com sucesso! Redirecionando...', variant: 'success' });
        if (onCadastroSucesso) {
            setTimeout(onCadastroSucesso, 2000); 
        }
      } else {
        const data = await response.json(); 
        setAlert({ message: `Erro: ${data.message || 'Falha ao cadastrar.'}`, variant: 'error' });
      }

    } catch (error) {
      console.error('Erro de setup:', error);
      setAlert({ message: 'Erro de conexão com o servidor.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DivFormulario> 
        {alert && (
            <AlertMessage 
                message={alert.message} 
                variant={alert.variant} 
                onClose={() => setAlert(null)} 
            />
        )}

        {/* --- CABEÇALHO MAIS MODERNO --- */}
        <div className="flex flex-col items-center text-center mb-8"> 
            <div className="bg-red-100 p-4 rounded-full mb-4 animate-pulse">
                <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Configuração Inicial
            </h2>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Bem-vindo ao <strong>APA</strong>. Detectamos que este é o primeiro acesso. Crie a conta mestre para continuar.
            </p>
        </div>

        {/* --- FORMULÁRIO --- */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full px-2"> 
            
            <div className="relative">
                <div className="absolute top-[34px] left-3 text-gray-400 z-10">
                    {/* Ícone decorativo se quiser, ou apenas mantenha o campo simples */}
                </div>
                <Campo
                    label="Nome de Usuário (Admin)"
                    placeholder="Ex: admin.master"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full" 
                />
            </div>
            
            <div>
                <Campo
                    label="Senha de Acesso"
                    type="password"
                    placeholder="Crie uma senha forte"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">Mínimo de 6 caracteres</p>
            </div>

            <div className="mt-6"> 
                <Botao 
                    type="submit" 
                    disabled={loading}
                    background="#2563eb" // Azul royal
                    color="#ffffff"
                    // Forçamos w-full via style ou classe se o componente aceitar
                    style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }} 
                >
                    {loading ? 'Configurando Sistema...' : 'Criar Administrador'}
                </Botao>
            </div>
        </form>
    </DivFormulario>
  );
}