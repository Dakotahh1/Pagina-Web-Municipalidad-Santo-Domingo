import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import MainTabs from './pages/private/MainTabs';
import InspectorDashboard from './pages/private/InspectorDashboard';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

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

/*App principal. define la estructura de rutas de la aplicación:
  - rutas públicas: login y registro (accesibles sin sesión)
  - rutas protegidas del vecino: /app/* (requieren autenticación)
  - rutas protegidas del funcionario: /admin/* (requieren rol funcionario)

  MainTabs envuelve todas las rutas del vecino con IonTabs para la navegación inferior.
  ProtectedRoute valida autenticación y roles antes de permitir acceso*/

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>

          {/*ruta raíz redirige al login*/}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

          {/*rutas públicas — accesibles sin sesión*/}
          <Route exact path="/login" component={Login} />
          <Route exact path="/registro" component={Registro} />

          {/*rutas protegidas del vecino — requieren autenticación.
            MainTabs maneja el sub-enrutamiento con IonTabs*/}
          <ProtectedRoute path="/app" component={MainTabs} />

          {/*rutas protegidas del panel de gestión — requieren rol funcionario o inspector*/}
          <ProtectedRoute
            exact
            path="/admin/dashboard"
            component={InspectorDashboard}
            allowedRoles={['funcionario', 'inspector']}
          />

        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
