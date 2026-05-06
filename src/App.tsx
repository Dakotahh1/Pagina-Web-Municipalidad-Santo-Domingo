import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Importar las vistas que creamos en src/pages/ */
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';

setupIonicReact();

const App: React.FC = () => {
  // Simulador de autenticación para cumplir con EP 1.5
  // Más adelante esto vendrá de un estado o base de datos real.
  const isAuth = true; 

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          
          {/* RUTAS PÚBLICAS */}
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/registro">
            <Registro />
          </Route>

          {/* RUTA PROTEGIDA (Inicio) */}
          <Route exact path="/inicio">
            {/* Si está autenticado, muestra Inicio. Si no, redirige al Login */}
            {isAuth ? <Inicio /> : <Redirect to="/login" />}
          </Route>

          {/* REDIRECCIÓN POR DEFECTO */}
          <Route exact path="/">
            <Redirect to="/inicio" />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;