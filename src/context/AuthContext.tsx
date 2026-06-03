import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { session, setUnauthorizedHandler } from '../services/api';
import type { AuthUser, UserRole } from '../services/authService';

/* Contexto de autenticación global (EP 2.5).
   Mantiene la sesión basada en JWT: token firmado + perfil del usuario.
   La sesión se persiste en localStorage para sobrevivir a recargas de página,
   y se cierra automáticamente si el cliente HTTP detecta un token inválido (401). */

// Se reexportan los tipos para que los consumidores los importen desde el contexto.
export type { AuthUser, UserRole };

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  token: string | null;
  /* Inicia sesión en la app tras una respuesta exitosa del backend. */
  login: (token: string, user: AuthUser) => void;
  /* Cierra la sesión y limpia el almacenamiento. */
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // El estado inicial se hidrata desde localStorage (sesión persistida).
  const [token, setToken] = useState<string | null>(() => session.getToken());
  const [user, setUser] = useState<AuthUser | null>(() => session.getUser<AuthUser>());

  const login = (newToken: string, newUser: AuthUser) => {
    session.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    session.clear();
    setToken(null);
    setUser(null);
  };

  // Registra el cierre de sesión como reacción a un 401 del interceptor HTTP.
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        user,
        role: user?.rol ?? null,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
