

"use client";

import React, { useState } from 'react';
// ⚠️ Ajuste os caminhos de importação se necessário:
import DivFormulario from '@/components/DivFormulario.jsx'; 
import Campo from '@/components/Campo.jsx';                 
import Botao from '@/components/Botao.jsx';                

export default function PrimeiroAdminForm({ onCadastroSucesso }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMensagem('Nome de usuário e senha são obrigatórios.');
      return;
    }
    
    setLoading(true);
    setMensagem('');

    try {
      
      const response = await fetch('/api/setup/criar-admin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ login: username, senha: password }), 
      });

     
      if (response.ok || response.status === 201) { 
        setMensagem('✅ Administrador cadastrado com sucesso! Redirecionando para login...');
        if (onCadastroSucesso) {
            setTimeout(onCadastroSucesso, 1500); 
        }
      } else if (response.status === 409) { 
        setMensagem('❌ Erro: O sistema já possui um administrador configurado. Por favor, faça login.');
      } else {
        
        const data = await response.json(); 
        setMensagem(`❌ Erro: ${data.message || 'Falha ao cadastrar. Verifique o servidor.'}`);
      }

    } catch (error) {
      setMensagem('❌ Erro de conexão com o servidor. Verifique a API.');
      console.error('Erro de setup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DivFormulario> 
        {/* Título e Descrição */}
        <div className="text-center mb-6"> 
            <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center justify-center">
                <span className="mr-2 text-3xl">🚨</span> Configuração Inicial Requerida
            </h2>
            <p className="text-gray-700 leading-relaxed">
                Nenhum administrador foi encontrado no sistema. Por favor, preencha os campos 
                abaixo para criar a conta de administrador principal.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full"> 
            
            {/* Campo Nome de Usuário */}
            <Campo
                label="Nome de Usuário (Login)"
                placeholder="Ex: admin.principal"
                valor={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full" 
            />
            
            {/* Campo Senha */}
            <Campo
                label="Senha"
                type="password"
                placeholder="Defina uma senha forte"
                valor={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
            />

            {/* Botão de Submissão - Centralizado */}
            <div className="mt-4 flex justify-center"> 
                <Botao 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-200"
                >
                    {loading ? 'Cadastrando...' : 'Criar Administrador'}
                </Botao>
            </div>
        </form>
        
        {/* Mensagens de Feedback */}
        {mensagem && (
            <div 
                className={`mt-4 p-3 rounded text-center ${mensagem.startsWith('❌') 
                    ? 'bg-red-100 border border-red-400 text-red-700' 
                    : 'bg-green-100 border border-green-400 text-green-700'}`}
            >
                {mensagem}
            </div>
        )}
    </DivFormulario>
  );
}