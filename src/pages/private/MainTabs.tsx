import React from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { homeOutline, pawOutline, megaphoneOutline, chatbubblesOutline, mapOutline } from 'ionicons/icons';

import Inicio            from './Inicio';
import Adopciones        from './adopciones';
import FichaAnimal       from './FichaAnimal';
import Foro              from './foro';
import Operativos        from './operativos';
import ReportarIncidente from './ReportarIncidente';
import MapaReportes      from './MapaReportes';
import Directorio        from './Directorio';

/*contenedor principal de navegación para el vecino autenticado.
  usa IonTabs con IonTabBar para la navegación inferior en móvil (EP 1.6).
  en escritorio la barra inferior se oculta y la navegación se maneja desde el NavBar superior.

  IonRouterOutlet: maneja las transiciones entre páginas con animaciones de ionic.
  IonTabBar: barra inferior con los accesos principales para uso con una sola mano*/

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/inicio" component={Inicio} />
        <Route exact path="/app/adopciones" component={Adopciones} />
        <Route exact path="/app/adopciones/:id" component={FichaAnimal} />
        <Route exact path="/app/foro" component={Foro} />
        <Route exact path="/app/operativos" component={Operativos} />
        <Route exact path="/app/reportar" component={ReportarIncidente} />
        <Route exact path="/app/mapa" component={MapaReportes} />
        <Route exact path="/app/directorio" component={Directorio} />
        <Route exact path="/app">
          <Redirect to="/app/inicio" />
        </Route>
      </IonRouterOutlet>

      {/*barra de navegación inferior para móvil. se oculta en pantallas grandes con CSS*/}
      <IonTabBar slot="bottom" className="md:hidden" style={{ '--background': '#ffffff', '--border': '1px solid #e5e7eb' }}>
        <IonTabButton tab="inicio" href="/app/inicio">
          <IonIcon icon={homeOutline} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="mapa" href="/app/mapa">
          <IonIcon icon={mapOutline} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>
        <IonTabButton tab="adopciones" href="/app/adopciones">
          <IonIcon icon={pawOutline} />
          <IonLabel>Adopciones</IonLabel>
        </IonTabButton>
        <IonTabButton tab="reportar" href="/app/reportar">
          <IonIcon icon={megaphoneOutline} />
          <IonLabel>Reportar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="foro" href="/app/foro">
          <IonIcon icon={chatbubblesOutline} />
          <IonLabel>Foro</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;