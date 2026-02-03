import "./globals.css";
import { AuthProvider } from "../AuthContext";
// 1. Importe o ClientLayoutWrapper
import ClientLayoutWrapper from "@/components/Layout/ClientLayoutWrapper";

export const metadata = {
  title: "ASSISTENTE DE PRONTO ATENDIMENTO",
  description: "Sistema APA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          {/*
            2. Substitua o <div> simples pelo Wrapper.
            Agora, o ClientLayoutWrapper vai decidir se mostra
            só os {children} (se deslogado) ou o
            <DashboardLayout>{children}</DashboardLayout> (se logado).
          */}
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          
        </AuthProvider>
      </body>
    </html>
  );
}