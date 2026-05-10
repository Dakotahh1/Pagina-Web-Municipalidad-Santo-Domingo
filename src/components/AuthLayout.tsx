import React from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import AuthHeroPanel, { StatItem } from './AuthHeroPanel';

interface AuthLayoutProps {
  stats: StatItem[];
  children: React.ReactNode;
}

/*
 sirve para la doble pantalla del auth: izquierda fija, derecha scrollable.
 
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ stats, children }) => (
  <IonPage>
    <IonContent fullscreen>
      <IonGrid className="ion-no-padding h-screen">
        <IonRow className="w-full h-full">
          <AuthHeroPanel stats={stats} />
          <IonCol
            size="12" sizeMd="7" sizeLg="6"
            className="bg-white flex flex-col h-full overflow-y-auto p-6 lg:p-12"
          >
            {children}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  </IonPage>
);

export default AuthLayout;
