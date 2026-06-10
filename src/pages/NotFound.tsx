import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

/* Vista 404 para rutas no existentes (EF2 — UX). */
const NotFound: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent style={{ '--background': '#f3f4f6' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '12px', padding: '24px' }}>
          <div style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 800, fontSize: '64px', color: '#2d6aab', lineHeight: 1 }}>404</div>
          <h1 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '20px', color: '#111827', margin: 0 }}>Página no encontrada</h1>
          <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#6b7280', margin: 0 }}>La ruta que buscas no existe o fue movida.</p>
          <IonButton onClick={() => history.push('/login')} style={{ '--background': '#2d6aab', marginTop: '8px', textTransform: 'none' }}>
            Volver al inicio
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
