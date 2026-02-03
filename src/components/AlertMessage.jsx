"use client";

import { useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"; // Adicionei o Info

const variants = {
    success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
    },
    error: {
        icon: <XCircle className="w-5 h-5" />,
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5" />,
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
    },
    // --- ADICIONADO O TIPO INFO ---
    info: {
        icon: <Info className="w-5 h-5" />,
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
    },
};

export default function AlertMessage({
    message,
    variant = "success", // Se vier vazio, usa success
    onClose,
    duration = 3000,
}) {
    // Proteção: Se passar um tipo que não existe (ex: "purple"), usa "info" como fallback para não quebrar
    const style = variants[variant] || variants.info;

    useEffect(() => {
        if (!duration) return;
        const timer = setTimeout(() => onClose && onClose(), duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
        fixed top-6 left-1/2 -translate-x-1/2
        z-50 flex items-center gap-3 px-6 py-4 
        rounded-xl shadow-lg border text-center
        ${style.bg} ${style.text} ${style.border}
        animate-slide-in
      `}
        >
            {style.icon}
            <span className="font-medium">{message}</span>
        </div>
    );
}