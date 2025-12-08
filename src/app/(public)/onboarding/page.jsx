import React from 'react';
import TvPanel from '@/components/TV/TvPanel'; // Seu componente de TV
// Importe seu componente de layout que contém a barra lateral se necessário

export default function OnboardingPage() {
  return (
    // ESTE É O CONTAINER PAI QUE CENTRALIZA
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '80vh', // Define uma altura para que a centralização vertical funcione
      padding: '20px' 
    }}>
      {/* O TvPanel será centralizado dentro deste div */}
      <div style={{ width: '400px', height: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <TvPanel />
      </div>
    </div>
  );
}