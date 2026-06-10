import { useContext } from 'react';
import { NotificationContext, NotificationContextType } from './NotificationContext';

/* Hook de acceso al contexto de notificaciones. */
export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  return ctx;
};
