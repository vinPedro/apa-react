// src/components/layout/ClientLayoutWrapper.js
'use client'; 

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/AuthContext'; 
import { usePathname } from 'next/navigation'; // <-- 1. Importar o hook usePathname

// 2. Definir as rotas que NUNCA devem ter a sidebar
const PUBLIC_ROUTES = [
    '/',                     // Sua página de login
    '/cadastro',             // Sua página de cadastro
    '/senha'                 // Sua página de esqueci a senha
]; 

export default function ClientLayoutWrapper({ children }) {
    const { isAuthenticated } = useAuth(); 
    const pathname = usePathname(); // <-- 3. Obter o caminho da URL atual

    // 4. Verificar se a rota atual é uma das públicas
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // A regra agora é:
    // SÓ mostramos o Dashboard (com sidebar) se:
    // 1. O usuário está autenticado E
    // 2. A rota NÃO é pública
    if (isAuthenticated && !isPublicRoute) {
        return <DashboardLayout>{children}</DashboardLayout>;
    }
    
    // Para todos os outros casos (se for rota pública, ou se não estiver logado)
    // renderizamos APENAS o conteúdo da página, sem a sidebar.
    return <>{children}</>;
}