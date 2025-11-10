import "./globals.css";
import { AuthProvider } from "../AuthContext";

export const metadata = {
  title: "Assistente de Pronto Atendimento",
  description: "Sistema APA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <div className="flex justify-center items-center min-h-screen p-2">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
