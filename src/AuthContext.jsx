// src/AuthContext.js
'use client'; 

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({ profile: null }); 

export function AuthProvider({ children }) {
  
  const [profile, setProfile] = useState("admin"); 
  
  
  const value = { profile, setProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};