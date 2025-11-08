// src/components/layout/ClientLayoutWrapper.js
'use client'; // <-- A diretiva fica AQUI

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/AuthContext'; 

// Componente que decide o layout com base na autenticação
export default function ClientLayoutWrapper({ children }) {
    const { isAuthenticated } = useAuth(); 

    if (isAuthenticated) {
        return <DashboardLayout>{children}</DashboardLayout>;
    }
    
    return <>{children}</>;
}