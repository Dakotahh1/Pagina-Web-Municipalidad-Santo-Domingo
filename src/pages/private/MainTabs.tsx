import React from 'react';
import { IonTabs, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

import Inicio from './Inicio';
import Adopciones from './adopciones';
import Foro from './foro';
import Operativos from './operativos';
import FichaAnimal from './FichaAnimal';
import ReportarIncidente from './ReportarIncidente';

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
        
        <Route exact path="/app">
          <Redirect to="/app/inicio" />
        </Route>
      </IonRouterOutlet>
      
      
    </IonTabs>
  );
};

export default MainTabs;