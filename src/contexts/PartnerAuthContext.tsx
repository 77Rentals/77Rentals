import React, { createContext, useState, ReactNode } from 'react';

export interface PartnerAuthContextType {
  isLoggedIn: boolean;
  userEmail: string;
  userRole: 'admin' | 'owner';
  login: (email: string, role: 'admin' | 'owner') => void;
  logout: () => void;
}

export const PartnerAuthContext = createContext<PartnerAuthContextType | null>(null);

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<PartnerAuthContextType>(() => {
    const stored = localStorage.getItem('partnerAuth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isLoggedIn: false, userEmail: '', userRole: 'owner' as const };
      }
    }
    return { isLoggedIn: false, userEmail: '', userRole: 'owner' as const };
  });

  const login = (email: string, role: 'admin' | 'owner') => {
    const newAuth = { isLoggedIn: true, userEmail: email, userRole: role };
    setAuth(newAuth);
    localStorage.setItem('partnerAuth', JSON.stringify(newAuth));
  };

  const logout = () => {
    const newAuth = { isLoggedIn: false, userEmail: '', userRole: 'owner' as const };
    setAuth(newAuth);
    localStorage.removeItem('partnerAuth');
  };

  return (
    <PartnerAuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </PartnerAuthContext.Provider>
  );
}
