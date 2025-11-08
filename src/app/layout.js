
import './globals.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

import { AuthProvider } from '../AuthContext'; 

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
       
        <AuthProvider> 
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}