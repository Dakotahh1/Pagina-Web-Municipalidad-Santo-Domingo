import React from 'react';
import { IonHeader, IonToolbar } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/*navbar reutilizable para todas las páginas privadas (inicio, adopciones, foro, operativos, etc.).
  detecta la ruta activa automáticamente con useLocation, así no necesita props.
  incluye franja institucional gob.cl, logo, links de sección y botón de cerrar sesión*/

const links = [
  { label: 'Inicio',      path: '/app/inicio'      },
  { label: 'Mapa',        path: '/app/mapa'        },
  { label: 'Adopciones',  path: '/app/adopciones'  },
  { label: 'Foro',        path: '/app/foro'        },
  { label: 'Operativos',  path: '/app/operativos'  },
  { label: 'Directorio',  path: '/app/directorio'  },
];

const NavBar: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <IonHeader className="ion-no-border shadow-none">
      <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
        <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">

          {/*logo*/}
          <div
            className="flex items-center gap-4 cursor-pointer shrink-0"
            onClick={() => history.push('/app/inicio')}
          >
            <img src="/assets/logo.png" alt="Bienestar Animal" className="w-10 h-10 object-contain shrink-0" loading="lazy"
              onError={e => { e.currentTarget.style.display = 'none'; }} />
            <div className="flex flex-col justify-center">
              <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '16px', color: '#FFFFFF', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
              <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>Municipalidad de Santo Domingo</p>
            </div>
          </div>

          {/*links de navegación estilo botones azules*/}
          <nav className="flex flex-wrap justify-center items-center">
            {links.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => history.push(path)}
                style={{
                  background: isActive(path) ? '#1a4a80' : '#255c99',
                  color: '#ffffff', borderRadius: '6px', border: 'none',
                  fontFamily: "'Inter', sans-serif", fontWeight: isActive(path) ? 700 : 500,
                  fontSize: '15px', textTransform: 'none' as const,
                  margin: '0 4px', height: '40px', padding: '0 18px',
                  cursor: 'pointer', whiteSpace: 'nowrap' as const,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a4a80'; }}
                onMouseLeave={e => { if (!isActive(path)) e.currentTarget.style.background = '#255c99'; }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/*botón cerrar sesión*/}
          <button
            onClick={handleLogout}
            style={{
              background: '#000000', color: '#ffffff', borderRadius: '6px', border: 'none',
              fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '15px',
              textTransform: 'none', height: '40px', padding: '0 20px',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Cerrar Sesión
          </button>

        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default NavBar;
