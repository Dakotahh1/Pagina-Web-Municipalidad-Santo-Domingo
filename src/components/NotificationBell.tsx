import React from 'react';
import { IonIcon, IonPopover, IonContent } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { useNotifications } from '../context/useNotifications';

/* Campana de notificaciones (EF1). Muestra el contador de no leídas y, al abrir,
   despliega el historial persistido en localStorage. */

const colorBorde = (tipo: string) =>
  tipo === 'error' ? '#dc2626' : tipo === 'success' ? '#16a34a' : '#2d6aab';

const NotificationBell: React.FC = () => {
  const { notificaciones, noLeidas, marcarTodasLeidas, limpiar } = useNotifications();

  return (
    <>
      <button
        id="notif-bell"
        onClick={() => { if (noLeidas) marcarTodasLeidas(); }}
        aria-label="Notificaciones"
        style={{
          position: 'relative', background: 'transparent', border: 'none',
          cursor: 'pointer', width: '40px', height: '40px', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <IonIcon icon={notificationsOutline} style={{ fontSize: '22px', color: '#ffffff' }} />
        {noLeidas > 0 && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px', minWidth: '17px', height: '17px',
            padding: '0 4px', background: '#dc2626', color: '#fff', borderRadius: '9px',
            fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
          }}>
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      <IonPopover trigger="notif-bell" side="bottom" alignment="end" style={{ '--width': '320px' }}>
        <IonContent>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '15px', color: '#111827' }}>
              Notificaciones
            </span>
            {notificaciones.length > 0 && (
              <button onClick={limpiar} style={{ background: 'none', border: 'none', color: '#2d6aab', fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Limpiar
              </button>
            )}
          </div>

          {notificaciones.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#9ca3af' }}>
              No tienes notificaciones.
            </div>
          ) : (
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notificaciones.map((n) => (
                <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', borderLeft: `3px solid ${colorBorde(n.tipo)}` }}>
                  <div style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '13px', color: '#111827', marginBottom: '2px' }}>
                    {n.titulo}
                  </div>
                  <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>
                    {n.mensaje}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#9ca3af' }}>
                    {new Date(n.fecha).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </IonContent>
      </IonPopover>
    </>
  );
};

export default NotificationBell;
