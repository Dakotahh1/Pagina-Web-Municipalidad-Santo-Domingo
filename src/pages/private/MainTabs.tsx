import React from 'react';
import { IonTabs, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

import Inicio            from './Inicio';
import Adopciones        from './adopciones';
import FichaAnimal       from './FichaAnimal';
import Foro              from './foro';
import Operativos        from './operativos';
import ReportarIncidente from './ReportarIncidente';

/*contenedor principal de rutas para las páginas privadas (vecino autenticado).
  no renderiza ningún ui propio, solo define qué componente se muestra para cada url.

  IonTabs: envuelve el sistema de rutas con soporte para tabs de ionic.
            en este proyecto los tabs están vacíos (sin IonTabBar) porque la navegación
            se maneja desde el NavBar superior, no desde una barra inferior.

  IonRouterOutlet: es el equivalente a <Switch> de react-router, pero integrado con
                   las animaciones de transición de ionic entre páginas.

  la ruta /app sola redirige a /app/inicio para que nunca quede la pantalla en blanco
*/

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>

        {/*página de inicio: landing del vecino autenticado*/}
        <Route exact path="/app/inicio" component={Inicio} />

        {/*listado de animales en adopción*/}
        <Route exact path="/app/adopciones" component={Adopciones} />

        {/*ficha de detalle de un animal específico, recibe el id por la url*/}
        <Route exact path="/app/adopciones/:id" component={FichaAnimal} />

        {/*foro vecinal de publicaciones y reportes*/}
        <Route exact path="/app/foro" component={Foro} />

        {/*calendario y detalle de operativos veterinarios municipales*/}
        <Route exact path="/app/operativos" component={Operativos} />

        {/*formulario para reportar un incidente de bienestar animal*/}
        <Route exact path="/app/reportar" component={ReportarIncidente} />

        {/*ruta base: redirige a inicio para evitar pantalla en blanco*/}
        <Route exact path="/app">
          <Redirect to="/app/inicio" />
        </Route>

      </IonRouterOutlet>
    </IonTabs>
  );
};

export default MainTabs;
