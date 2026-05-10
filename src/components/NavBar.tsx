import React from 'react';
import { IonHeader, IonToolbar } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

/*navbar reutilizable para todas las páginas privadas (inicio, adopciones, foro, operativos).
  detecta la ruta activa automáticamente con useLocation, así no necesita props*/

const links = [
  { label: 'Inicio',     path: '/app/inicio'     },
  { label: 'Mapa',       path: '/app/mapa'       },
  { label: 'Adopciones', path: '/app/adopciones' },
  { label: 'Foro',       path: '/app/foro'       },
  { label: 'Operativos', path: '/app/operativos' },
];

const NavBar: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  //un link está activo si la ruta actual comienza con su path
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <IonHeader className="ion-no-border">

      {/*franja institucional superior, inspirada en el estilo del gobierno digital de chile (gob.cl).
        le da un carácter oficial a la plataforma municipal*/}

      <div className="bg-[#1a2b4a] px-6 py-1.5 flex items-center gap-1.5">
        <span className="text-[11px] text-white/70 font-sans">🇨🇱</span>
        <span className="text-[11px] text-white/60 font-sans">Portal Vecinal —</span>
        <span className="text-[11px] text-white font-sans font-semibold tracking-wide">
          Municipalidad de Santo Domingo
        </span>
      </div>

      {/*barra de navegación principal — siempre en fila horizontal*/}

      <IonToolbar style={{ '--background': '#ffffff', '--border-width': '0', '--min-height': '0', '--padding-start': '0', '--padding-end': '0', '--padding-top': '0', '--padding-bottom': '0' }}>
        <div className="border-b border-gray-200 px-6 lg:px-10 py-3 flex flex-row justify-between items-center gap-4">

          {/*logo con nombre de la plataforma, al hacer click vuelve al inicio*/}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => history.push('/app/inicio')}
          >
            <div className="w-9 h-9 bg-[#7ac29a] flex items-center justify-center rounded overflow-hidden shrink-0">
              <img
                src="/assets/logo.png"
                alt="Bienestar Animal"
                className="w-6 h-6 object-contain"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-black m-0 leading-tight">Bienestar Animal</p>
              <p className="font-sans text-[11px] text-gray-400 m-0">Municipalidad de Santo Domingo</p>
            </div>
          </div>

          {/*links de navegación. el activo tiene subrayado en azul municipal y texto más oscuro*/}
          <nav className="flex items-center gap-0.5">
            {links.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => history.push(path)}
                className={`px-3 py-2 text-sm font-sans rounded-sm whitespace-nowrap transition-all duration-150 border-b-2 ${
                  isActive(path)
                    ? 'text-muni-blue border-muni-blue font-semibold'
                    : 'text-gray-500 border-transparent hover:text-muni-blue hover:bg-blue-50'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/*botón de acceso a la cuenta del vecino registrado*/}
          <button className="shrink-0 px-4 py-2 bg-muni-blue text-white text-sm font-sans font-medium
                             rounded hover:bg-[#245a95] transition-colors duration-150 whitespace-nowrap">
            Mi Cuenta
          </button>

        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default NavBar;
