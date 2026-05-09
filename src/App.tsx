import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import Inicio from './pages/private/Inicio';
import Adopciones from './pages/private/adopciones';
import FichaAnimal from './pages/private/FichaAnimal';
import Operativos from './pages/private/operativos';
import ReportarIncidente from './pages/private/ReportarIncidente';
import Foro from './pages/private/foro';
import InspectorDashboard from './pages/private/InspectorDashboard';

import { AuthProvider } from './context/AuthContext';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          <Route exact path="/login" component={Login} />
          <Route exact path="/registro" component={Registro} />

          <Route exact path="/app/inicio" component={Inicio} />
          <Route exact path="/app/adopciones" component={Adopciones} />
          <Route exact path="/app/adopciones/:id" component={FichaAnimal} />
          <Route exact path="/app/operativos" component={Operativos} />
          <Route exact path="/app/reportar" component={ReportarIncidente} />
          <Route exact path="/app/foro" component={Foro} />
          
          <Route exact path="/admin/dashboard" component={InspectorDashboard} />

        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;