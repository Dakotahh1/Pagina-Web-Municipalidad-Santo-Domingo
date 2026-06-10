import React, { lazy, Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
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

/* Carga diferida de las vistas (EF2 — rendimiento).
   Cada vista se descarga en su propio chunk solo cuando se navega a ella,
   reduciendo el peso del bundle inicial (relevante para RNF-02). */
const Login = lazy(() => import('./pages/public/Login'));
const Registro = lazy(() => import('./pages/public/Registro'));
const MainTabs = lazy(() => import('./pages/private/MainTabs'));
const InspectorDashboard = lazy(() => import('./pages/private/InspectorDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* Indicador de carga mientras se descarga el chunk de una vista. */
const Cargando: React.FC = () => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
  </div>
);

/* App principal. Define la estructura de rutas:
   - públicas: /login y /registro (sin sesión)
   - protegidas del vecino: /app/* (requieren autenticación) vía MainTabs
   - protegidas del panel: /admin/dashboard (rol funcionario o inspector)
   ProtectedRoute valida sesión y rol antes de renderizar. */
const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <NotificationProvider>
        <IonReactRouter>
          <Suspense fallback={<Cargando />}>
            <IonRouterOutlet>

              {/*ruta raíz redirige al login*/}
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>

              {/*rutas públicas — accesibles sin sesión*/}
              <Route exact path="/login" component={Login} />
              <Route exact path="/registro" component={Registro} />

              {/*rutas protegidas del vecino — MainTabs maneja el sub-enrutamiento con IonTabs*/}
              <ProtectedRoute path="/app" component={MainTabs} />

              {/*rutas protegidas del panel — requieren rol funcionario o inspector*/}
              <ProtectedRoute
                exact
                path="/admin/dashboard"
                component={InspectorDashboard}
                allowedRoles={['funcionario', 'inspector']}
              />

              {/*cualquier otra ruta — 404*/}
              <Route component={NotFound} />

            </IonRouterOutlet>
          </Suspense>
        </IonReactRouter>
      </NotificationProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
