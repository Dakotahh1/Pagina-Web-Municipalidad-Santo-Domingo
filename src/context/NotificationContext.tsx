import React, { createContext, useCallback, useState, ReactNode } from 'react';
import { IonToast } from '@ionic/react';

/* Sistema de notificaciones de la aplicación (EF1 — notificaciones + almacenamiento local).
   - `notify()` registra una notificación y muestra un toast inmediato.
   - El historial se persiste en localStorage (sobrevive a recargas) y lo consume la
     campana de la barra de navegación. */

export type NotifTipo = 'success' | 'info' | 'error';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: NotifTipo;
  leida: boolean;
  fecha: string;
}

export interface NotificationContextType {
  notificaciones: Notificacion[];
  noLeidas: number;
  notify: (titulo: string, mensaje: string, tipo?: NotifTipo) => void;
  marcarTodasLeidas: () => void;
  limpiar: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'bienestar.notificaciones';
const MAX = 30; // historial acotado

const leerInicial = (): Notificacion[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notificacion[]) : [];
  } catch {
    return [];
  }
};

const guardar = (lista: Notificacion[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista.slice(0, MAX)));
  } catch {
    /* almacenamiento no disponible */
  }
};

const colorPorTipo = (tipo: NotifTipo): string =>
  tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'primary';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(leerInicial);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const notify = useCallback((titulo: string, mensaje: string, tipo: NotifTipo = 'info') => {
    const nueva: Notificacion = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      titulo,
      mensaje,
      tipo,
      leida: false,
      fecha: new Date().toISOString(),
    };
    setNotificaciones((prev) => {
      const next = [nueva, ...prev].slice(0, MAX);
      guardar(next);
      return next;
    });
    setToast({ msg: `${titulo} — ${mensaje}`, color: colorPorTipo(tipo) });
  }, []);

  const marcarTodasLeidas = useCallback(() => {
    setNotificaciones((prev) => {
      const next = prev.map((n) => ({ ...n, leida: true }));
      guardar(next);
      return next;
    });
  }, []);

  const limpiar = useCallback(() => {
    setNotificaciones([]);
    guardar([]);
  }, []);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <NotificationContext.Provider value={{ notificaciones, noLeidas, notify, marcarTodasLeidas, limpiar }}>
      {children}
      {/* Toast global: cualquier notify() lo dispara desde cualquier vista. */}
      <IonToast
        isOpen={Boolean(toast)}
        message={toast?.msg}
        color={toast?.color}
        duration={3500}
        position="top"
        onDidDismiss={() => setToast(null)}
      />
    </NotificationContext.Provider>
  );
};
