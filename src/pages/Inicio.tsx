import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardContent 
} from '@ionic/react';
import './Home.css'; // Usaremos el archivo CSS que ya tienes creado en tu carpeta

const Inicio: React.FC = () => {
  return (
    <IonPage>
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" style={{ '--background': '#1E63B4' }}>
          <IonTitle slot="start">Bienestar Animal</IonTitle>
          <div slot="end" style={{ paddingRight: '1rem' }}>
            <IonButton fill="outline" color="light" className="ion-margin-end">Registrarse</IonButton>
            <IonButton fill="solid" color="dark">Iniciar Sesión</IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* SECCIÓN HERO (Fondo Azul con Título y Estadísticas) */}
        <div style={{ backgroundColor: '#1E63B4', padding: '3rem 2rem' }}>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              
              {/* Columna Izquierda: Textos y Botones */}
              <IonCol size="12" sizeMd="6">
                <div style={{ backgroundColor: 'white', color: 'black', display: 'inline-block', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Municipalidad de Santo Domingo
                </div>
                <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginTop: '0' }}>
                  Tenencia <br />
                  <span style={{ color: '#F59E0B' }}>Responsable</span><br />
                  es de <span style={{ color: '#F59E0B' }}>todos</span>
                </h1>
                <p style={{ color: '#E2E8F0', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '2rem' }}>
                  Reporta abandonos, adopta de forma responsable y mantente informado sobre el bienestar animal en tu comuna.
                </p>
                <IonButton color="dark" className="ion-margin-end">Reportar Incidente</IonButton>
                <IonButton fill="solid" color="dark">Ver Adopciones</IonButton>
              </IonCol>

              {/* Columna Derecha: Tarjetas de Estadísticas */}
              <IonCol size="12" sizeMd="6">
                <IonGrid>
                  <IonRow>
                    <IonCol size="6" sizeMd="6">
                      <IonCard style={{ margin: '8px' }}><IonCardContent><h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'black' }}>30</h2><p style={{ margin: '0', fontSize: '0.8rem' }}>Animales Registrados</p></IonCardContent></IonCard>
                    </IonCol>
                    <IonCol size="6" sizeMd="6">
                      <IonCard style={{ margin: '8px' }}><IonCardContent><h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'black' }}>124</h2><p style={{ margin: '0', fontSize: '0.8rem' }}>Adoptados este mes</p></IonCardContent></IonCard>
                    </IonCol>
                    <IonCol size="6" sizeMd="6">
                      <IonCard style={{ margin: '8px' }}><IonCardContent><h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'black' }}>38</h2><p style={{ margin: '0', fontSize: '0.8rem' }}>Operativos realizados</p></IonCardContent></IonCard>
                    </IonCol>
                    <IonCol size="6" sizeMd="6">
                      <IonCard style={{ margin: '8px' }}><IonCardContent><h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'black' }}>96%</h2><p style={{ margin: '0', fontSize: '0.8rem' }}>Casos gestionados</p></IonCardContent></IonCard>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

            </IonRow>
          </IonGrid>
        </div>

        {/* SECCIÓN INFERIOR (Mapa y Lista de Incidentes) */}
        <div style={{ padding: '3rem 2rem', backgroundColor: 'white' }}>
          <IonGrid>
            <IonRow>
              
              {/* Columna Izquierda: Mapa */}
              <IonCol size="12" sizeMd="8">
                <div style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', display: 'inline-block', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  TIEMPO REAL
                </div>
                <h2 style={{ color: 'black', fontWeight: 'bold', marginTop: '0' }}>Mapa de Calor - Reportes Comunales</h2>
                <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '2rem' }}>Distribución geográfica de incidentes activos. Actualizado cada 24 hrs.</p>
                
                {/* Cuadro gris provisorio donde irá el mapa real */}
                <div style={{ height: '400px', backgroundColor: '#E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#64748B', fontWeight: 'bold' }}>[Área reservada para el mapa interactivo]</p>
                </div>
              </IonCol>

              {/* Columna Derecha: Leyenda de Incidentes */}
              <IonCol size="12" sizeMd="4">
                <IonCard style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                  <IonCardContent>
                    <h3 style={{ fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>Tipos de incidentes activos</h3>
                    <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '2.5', color: '#475569', fontSize: '0.9rem' }}>
                      <li>🟣 Abandono de animales</li>
                      <li>🔴 Mordedura/Agresión</li>
                      <li>🟡 Tenencia irresponsable</li>
                      <li>🔵 Solicitud de ayuda</li>
                      <li>🟢 Caso resuelto</li>
                    </ul>
                    <hr style={{ margin: '2rem 0', borderTop: '1px solid #E2E8F0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ color: 'gray', fontSize: '0.9rem' }}>Total Incidentes activos:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>38</span>
                    </div>
                    <IonButton expand="block" color="dark" style={{ marginTop: '1rem' }}>Reportar Incidente</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;
