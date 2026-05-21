import React from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent,
  IonHeader, IonToolbar
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import RevealWrapper from '../../components/RevealWrapper';
import { useAuth } from '../../context/useAuth';

/*página de inicio (landing page pública). es la primera pantalla que ve un vecino
  antes de iniciar sesión. tiene navbar azul propia con botones de auth.
  Es distinta al NavBar institucional blanco que usan las páginas privadas.

  estructura:
    1. navbar con logo, links y botones de registro/login
    2. sección hero con texto principal y kpis
    3. sección mapa de calor de reportes
    4. sección accesos rápidos
    5. sección adopciones destacadas
    6. footer
*/

const Inicio: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  /*animales que se muestran en la sección de adopciones del inicio.
    son solo 3 destacados. la lista completa está en /app/adopciones*/
  const animalesDestacados = [
    { id: 1, nombre: 'Camaron', raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
    { id: 2, nombre: 'Kenai',   raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
    { id: 3, nombre: 'Leonidas', raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
  ];

  /*kpis del hero: estadísticas generales de la plataforma municipal.
    estos valores son hardcodeados por ahora, deberían venir de la api eventualmente*/
  const kpisHero = [
    { valor: '30',  label: 'Animales Registrados' },
    { valor: '124', label: 'Adoptados este mes'   },
    { valor: '38',  label: 'Operativos realizados' },
    { valor: '96%', label: 'Casos gestionados'     },
  ];

  /*accesos rápidos a las secciones más usadas de la plataforma.
    TODO: las descripciones aún tienen texto placeholder; actualizar con el texto real de cada sección*/
  const accesosRapidos = [
    { titulo: 'Dar en Adopción',    desc: 'Registra a tu mascota para que pueda encontrar un nuevo hogar.', ruta: '/app/adopciones' },
    { titulo: 'Mapa de Reportes',   desc: 'Revisa el mapa de calor de incidentes reportados en la comuna.', ruta: '/app/mapa'       },
    { titulo: 'Reportar Incidente', desc: 'Informa a la municipalidad sobre animales en situación de riesgo.', ruta: '/app/reportar'   },
    { titulo: 'Foro Vecinal',       desc: 'Comunícate con otros vecinos y con el equipo municipal.', ruta: '/app/foro'        },
    { titulo: 'Operativos',         desc: 'Consulta los próximos operativos de vacunación y esterilización.', ruta: '/app/operativos' },
    { titulo: 'Directorio',         desc: 'Contactos y horarios de atención de la unidad de bienestar.', ruta: '/app/directorio'  },
  ];

  //estilo base de los botones de navegación del header azul público
  const navButtonStyle = {
    '--background': '#255c99', '--color': '#ffffff', '--border-radius': '6px',
    '--box-shadow': 'none', fontFamily: "'Inter', sans-serif",
    fontWeight: 500, fontSize: '14px', textTransform: 'none' as const,
    margin: '0 3px', height: '38px'
  };
  return (
    <IonPage>

      {/*navbar público de la landing page. usa fondo azul y muestra botones de registro/login
        en lugar del "mi cuenta" del navbar privado. si se unifica con NavBar.tsx, se puede
        agregar un prop isPublic que cambie los botones del lado derecho*/}

      <IonHeader className="ion-no-border shadow-none">
        <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
          <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">

            {/*logo y nombre de la plataforma*/}
            <div className="flex items-center gap-4 shrink-0">
              <img src="/assets/logo.png" alt="Logo" loading="lazy" className="w-14 h-14 object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '16px', color: '#FFFFFF', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>Municipalidad de Santo Domingo</p>
              </div>
            </div>

            {/*links de sección. "inicio" activo porque estamos en esta página*/}
            <div className="flex flex-wrap justify-center items-center">
              <IonButton fill="solid" onClick={() => history.push('/app/inicio')}     style={navButtonStyle}>Inicio</IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/mapa')}       style={navButtonStyle}>Mapa de Reportes</IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/adopciones')} style={navButtonStyle}>Adopciones</IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/foro')}       style={navButtonStyle}>Foro Vecinal</IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/operativos')} style={navButtonStyle}>Operativos</IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/directorio')} style={navButtonStyle}>Directorio</IonButton>
            </div>

            {/*botón de cierre de sesión para usuario autenticado*/}
            <div className="flex items-center gap-3">
              <IonButton onClick={handleLogout}
                style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}>
                Cerrar Sesión
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-white">

        {/*sección 1: hero con título principal y kpis de actividad municipal*/}
        <div className="bg-[#2d6aab] pt-12 pb-24 px-8 md:px-16 lg:px-24">
          <IonGrid className="ion-no-padding max-w-[1400px] mx-auto">
            <IonRow className="items-center">

              {/*columna izquierda: tagline + descripción + botones de acción*/}
              <IonCol size="12" sizeLg="5" className="pr-0 lg:pr-12 mb-12 lg:mb-0">
                <RevealWrapper>
                  <div style={{ backgroundColor: '#ffffff', display: 'inline-block', padding: '6px 16px', borderRadius: '4px', marginBottom: '32px' }}>
                    <span className="font-slab font-bold text-xs text-black">Municipalidad de Santo Domingo</span>
                  </div>

                  <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 800, fontSize: '40px', lineHeight: '1.1', marginBottom: '24px', color: '#FFFFFF' }}>
                    Tenencia<br />
                    <span style={{ color: '#FFA600' }}>Responsable</span><br />
                    es de <span style={{ color: '#FFA600' }}>todos</span>
                  </h1>

                  <p className="font-slab text-sm text-white leading-relaxed mb-8 max-w-[420px]">
                    Gestiona reportes, busca fichas animales, infórmate acerca de operativos
                    y adopciones desde una sola plataforma municipal.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <IonButton routerLink="/app/reportar"
                      style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '8px', '--padding-start': '24px', '--padding-end': '24px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}>
                      Reportar Incidente
                    </IonButton>
                    <IonButton routerLink="/app/adopciones"
                      style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '8px', '--padding-start': '24px', '--padding-end': '24px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}>
                      Ver Adopciones
                    </IonButton>
                  </div>
                </RevealWrapper>
              </IonCol>

              {/*columna derecha: 4 kpis de estadísticas en grid 2x2*/}
              <IonCol size="12" sizeLg="7" className="pl-0 lg:pl-12">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    {kpisHero.map((kpi, idx) => (
                      <IonCol size="12" sizeMd="6" key={idx} className="p-2 lg:p-3">
                        <RevealWrapper delay={idx * 80}>
                          <IonCard className="m-0 shadow-sm w-full transition-transform duration-200 hover:scale-[1.02]"
                            style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                            <IonCardContent style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
                              <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#000000', margin: '0 0 4px 0', lineHeight: 1 }}>
                                {kpi.valor}
                              </h2>
                              <p className="font-slab text-xs text-black m-0">{kpi.label}</p>
                            </IonCardContent>
                          </IonCard>
                        </RevealWrapper>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </IonCol>

            </IonRow>
          </IonGrid>
        </div>

        {/*sección 2: mapa de calor de reportes activos en la comuna.
          el mapa es un placeholder por ahora. cuando se integre leaflet o google maps
          este div se reemplaza por el componente de mapa real*/}

        <div className="bg-white py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <RevealWrapper>
              <div style={{ display: 'inline-block', backgroundColor: '#e0f2fe', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px' }}>
                <span className="font-slab font-bold text-[10px] text-[#0369a1] tracking-widest">TIEMPO REAL</span>
              </div>
              <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '8px' }}>
                Mapa de Calor — Reportes Comunales
              </h2>
              <p className="font-slab text-xs text-gray-500 mb-8">
                Distribución geográfica de incidentes activos. Actualizado cada 24 hrs.
              </p>
            </RevealWrapper>

            <RevealWrapper delay={100}>
              <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">

                {/*contenedor del mapa. la imagen es placeholder hasta integrar un mapa real*/}
                <div className="w-full lg:w-[65%] h-[300px] lg:h-full bg-[#e5e7eb] rounded-xl overflow-hidden border border-gray-200">
                  <img src="/assets/mapa-placeholder.png" alt="Mapa de reportes" loading="lazy"
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>

                {/*leyenda de colores y total de incidentes activos*/}
                <div className="w-full lg:w-[35%] bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="font-slab font-bold text-sm text-black mb-6">Tipos de incidentes activos</h3>
                    <ul className="space-y-4">
                      {[
                        { color: '#9d3674', label: 'Abandono de animales'    },
                        { color: '#973a4b', label: 'Mordedura / Agresión'    },
                        { color: '#cca628', label: 'Tenencia irresponsable'  },
                        { color: '#62a1d2', label: 'Solicitud de ayuda'      },
                        { color: '#5da667', label: 'Caso resuelto'           },
                      ].map(({ color, label }) => (
                        <li key={label} className="flex items-center gap-3">
                          <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-slab text-xs text-black">{label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                      <span className="font-slab text-xs text-gray-500">Total incidentes activos:</span>
                      <span className="font-slab font-extrabold text-2xl text-black">38</span>
                    </div>
                    <IonButton expand="block" routerLink="/app/reportar"
                      style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}>
                      Reportar Incidente
                    </IonButton>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          </div>
        </div>

        {/*sección 3: accesos rápidos a los servicios más usados de la plataforma*/}
        <div className="bg-[#2d6aab] py-20 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <RevealWrapper>
              <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 800, fontSize: '36px', color: '#FFFFFF', marginBottom: '8px' }}>
                ¿Qué necesitas hacer hoy?
              </h2>
              <p className="font-slab text-sm text-blue-100 mb-10">Accede a los servicios más usados</p>
            </RevealWrapper>

            <IonGrid className="ion-no-padding">
              <IonRow>
                {accesosRapidos.map((item, idx) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={idx} className="p-3">
                    <RevealWrapper delay={idx * 70}>
                      <IonCard
                        button routerLink={item.ruta}
                        className="m-0 h-full shadow-sm overflow-hidden flex flex-col
                                   transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                        style={{ '--background': '#ffffff', '--border-radius': '8px' }}
                      >
                        <IonCardContent className="p-6">
                          <h3 className="font-slab font-medium text-sm text-black mb-2">{item.titulo}</h3>
                          <p className="font-slab text-xs text-gray-500 leading-relaxed m-0">{item.desc}</p>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/*sección 4: preview de las adopciones disponibles.
          solo muestra 3 animales destacados — el botón lleva a la lista completa*/}

        <div className="bg-white py-20 px-8 md:px-16 lg:px-24 border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto">
            <RevealWrapper>
              <div style={{ display: 'inline-block', backgroundColor: '#e0f2fe', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px' }}>
                <span className="font-slab font-bold text-[10px] text-[#0369a1] tracking-widest">ADOPCIONES</span>
              </div>
              <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '24px', color: '#000000', marginBottom: '40px' }}>
                Mascotas que buscan hogar
              </h2>
            </RevealWrapper>

            <IonGrid className="ion-no-padding">
              <IonRow>
                {animalesDestacados.map((animal, idx) => (
                  <IonCol size="12" sizeMd="4" key={animal.id} className="p-3">
                    <RevealWrapper delay={idx * 100}>
                      <IonCard
                        button routerLink={`/app/adopciones/${animal.id}`}
                        className="m-0 h-full shadow-sm border border-gray-200 flex flex-col
                                   transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '8px' }}
                      >
                        {/*placeholder de imagen — se reemplaza con la foto real del animal*/}
                        <div className="h-[240px] bg-[#f9fafb] w-full border-b border-gray-100" />

                        <IonCardContent className="p-6 bg-white">
                          <h3 className="font-slab font-semibold text-base text-black mb-3">"{animal.nombre}"</h3>

                          <div className="flex gap-3 mb-6">
                            {[animal.raza, animal.edad, animal.sexo].map((dato, i) => (
                              <span key={i} className="font-slab text-xs text-gray-600">{dato}</span>
                            ))}
                          </div>

                          {/*etiquetas de estado del animal*/}
                          <div className="flex gap-2">
                            {animal.etiquetas.map((etiqueta, i) => (
                              <span key={i} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '10px', padding: '4px 12px', borderRadius: '12px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                                {etiqueta}
                              </span>
                            ))}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/*footer con info de contacto, copyright y links legales*/}
        <footer className="bg-[#333333] text-white py-12 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-0">

            <div className="flex flex-col">
              <h4 className="font-slab font-bold text-base text-white m-0 mb-1">
                Bienestar Animal · Municipalidad de Santo Domingo
              </h4>
              <p className="font-slab text-xs text-gray-300 m-0">
                Av. Principal s/n, Santo Domingo · contacto@munisantodomingo.cl
              </p>
              <p className="font-slab text-xs text-gray-500 mt-6 m-0">
                © 2026 Municipalidad de Santo Domingo — Comuna Parque
              </p>
            </div>

            {/*links legales e institucionales*/}
            <div className="flex flex-wrap gap-6">
              {['Política de Privacidad', 'Términos de Uso', 'Transparencia', 'Contacto'].map(link => (
                <a key={link} href="#"
                  className="font-display font-bold text-sm text-white no-underline hover:text-blue-300 transition-colors duration-150">
                  {link}
                </a>
              ))}
            </div>

          </div>
        </footer>

      </IonContent>
    </IonPage>
  );
};

export default Inicio;
