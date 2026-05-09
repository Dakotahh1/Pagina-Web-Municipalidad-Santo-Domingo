import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardContent,
  IonHeader,
  IonToolbar
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Inicio: React.FC = () => {
  const history = useHistory();

  const animalesDestacados = [
    { id: 1, nombre: 'Camaron', raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
    { id: 2, nombre: 'Kenai', raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
    { id: 3, nombre: 'Leonidas', raza: 'Perro mestizo', edad: '3 años', sexo: 'Macho', etiquetas: ['Vacunado', 'Castrado'] },
  ];

  const accesosRapidos = [
    { titulo: 'Dar en Adopción', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '/app/adopciones' },
    { titulo: 'Ver Estadísticas', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '/admin/dashboard' },
    { titulo: 'Reportar Incidente', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '/app/reportar' },
    { titulo: 'Foro Vecinal', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '/app/foro' },
    { titulo: 'Parque Animal', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '#' },
    { titulo: 'Directorio', desc: 'Distribución geográfica de incidentes activos.\nActualizado cada 24 hrs.', ruta: '#' },
  ];

  // Estilo base para los botones de la barra de navegación 
  const navButtonStyle = {
    '--background': '#255c99',
    '--color': '#ffffff',
    '--border-radius': '6px',
    '--box-shadow': 'none',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '16px',
    textTransform: 'none' as const,
    margin: '0 4px',
    height: '42px'
  };

  return (
    <IonPage>
      {/* =========================================
          NAVBAR SUPERIOR
         ========================================= */}
      <IonHeader className="ion-no-border shadow-none">
        <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
          <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">
            
            {/* Logo y Título */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 bg-[#7ac29a] flex items-center justify-center overflow-hidden">
                <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: '16px', color: '#FFFFFF', margin: '0 0 2px 0' }}>
                  Bienestar Animal
                </h2>
                <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                  Municipalidad de Santo Domingo
                </p>
              </div>
            </div>

            {/* Enlaces de Navegación */}
            <div className="flex flex-wrap justify-center items-center">
              <IonButton fill="solid" onClick={() => history.push('/app/inicio')} style={navButtonStyle}>
                Inicio
              </IonButton>
              <IonButton fill="solid" style={navButtonStyle}>
                Mapa de Reportes
              </IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/adopciones')} style={navButtonStyle}>
                Adopciones
              </IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/foro')} style={navButtonStyle}>
                Foro Vecinal
              </IonButton>
              <IonButton fill="solid" onClick={() => history.push('/app/operativos')} style={navButtonStyle}>
                Operativos
              </IonButton>
            </div>

            {/* Botones de Autenticación */}
            <div className="flex items-center gap-3">
              <IonButton 
                onClick={() => history.push('/registro')}
                style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}
              >
                Registrarse
              </IonButton>
              <IonButton 
                onClick={() => history.push('/login')}
                style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}
              >
                Iniciar Sesión
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-white">
        
        {/* =========================================
            SECCIÓN 1: HERO & KPIs
           ========================================= */}
        <div className="bg-[#2d6aab] pt-12 pb-24 px-8 md:px-16 lg:px-24">
          <IonGrid className="ion-no-padding max-w-[1400px] mx-auto">
            <IonRow className="items-center">
              
              {/* Textos Izquierda */}
              <IonCol size="12" sizeLg="5" className="pr-0 lg:pr-12 mb-12 lg:mb-0">
                <div style={{ backgroundColor: '#ffffff', display: 'inline-block', padding: '6px 16px', borderRadius: '4px', marginBottom: '32px' }}>
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '12px', color: '#000000' }}>
                    Municipalidad de Santo Domingo
                  </span>
                </div>
                
                {/* Título Hero */}
                <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 800, fontSize: '40px', lineHeight: '1.1', marginBottom: '24px', color: '#FFFFFF' }}>
                  Tenencia<br />
                  <span style={{ color: '#FFA600' }}>Responsable</span><br />
                  es de <span style={{ color: '#FFA600' }}>todos</span>
                </h1>

                {/* Párrafo */}
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', maxWidth: '420px', lineHeight: '1.6', marginBottom: '32px' }}>
                  Gestiona reportes, busca fichas animales, infórmate acerca de operativos y adopciones desde una sola plataforma municipal.
                </p>

                {/* Botones de Acción Hero */}
                <div className="flex flex-wrap gap-4">
                  <IonButton 
                    routerLink="/app/reportar"
                    style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '8px', '--padding-start': '24px', '--padding-end': '24px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                  >
                    Reportar Incidente
                  </IonButton>
                  <IonButton 
                    routerLink="/app/adopciones"
                    style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '8px', '--padding-start': '24px', '--padding-end': '24px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                  >
                    Ver Adopciones
                  </IonButton>
                </div>
              </IonCol>

              {/* KPIs DERECHA */}
              <IonCol size="12" sizeLg="7" className="pl-0 lg:pl-12">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    {/* Tarjeta 1 */}
                    <IonCol size="12" sizeMd="6" className="p-2 lg:p-3">
                      <IonCard className="m-0 shadow-sm w-full" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                        <IonCardContent style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
                          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#000000', margin: '0 0 4px 0', lineHeight: 1 }}>
                            30
                          </h2>
                          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000', margin: 0 }}>
                            Animales Registrados
                          </p>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>

                    {/* Tarjeta 2 */}
                    <IonCol size="12" sizeMd="6" className="p-2 lg:p-3">
                      <IonCard className="m-0 shadow-sm w-full" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                        <IonCardContent style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
                          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#000000', margin: '0 0 4px 0', lineHeight: 1 }}>
                            124
                          </h2>
                          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000', margin: 0 }}>
                            Adoptados este mes
                          </p>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>

                    {/* Tarjeta 3 */}
                    <IonCol size="12" sizeMd="6" className="p-2 lg:p-3">
                      <IonCard className="m-0 shadow-sm w-full" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                        <IonCardContent style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
                          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#000000', margin: '0 0 4px 0', lineHeight: 1 }}>
                            38
                          </h2>
                          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000', margin: 0 }}>
                            Operativos realizados
                          </p>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>

                    {/* Tarjeta 4 */}
                    <IonCol size="12" sizeMd="6" className="p-2 lg:p-3">
                      <IonCard className="m-0 shadow-sm w-full" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                        <IonCardContent style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
                          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#000000', margin: '0 0 4px 0', lineHeight: 1 }}>
                            96%
                          </h2>
                          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000', margin: 0 }}>
                            Casos gestionados
                          </p>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

            </IonRow>
          </IonGrid>
        </div>

        {/* =========================================
            SECCIÓN 2: MAPA DE CALOR
           ========================================= */}
        <div className="bg-white py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <div style={{ display: 'inline-block', backgroundColor: '#e0f2fe', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px' }}>
              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '10px', color: '#0369a1', letterSpacing: '1px' }}>
                TIEMPO REAL
              </span>
            </div>
            
            {/* Título Mapa */}
            <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '8px' }}>
              Mapa de Calor - Reportes Comunales
            </h2>
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#6b7280', marginBottom: '32px' }}>
              Distribución geográfica de incidentes activos. Actualizado cada 24 hrs.
            </p>

            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">
              <div className="w-full lg:w-[65%] h-[300px] lg:h-full bg-[#e5e7eb] rounded-xl overflow-hidden border border-gray-200">
                <img src="/assets/mapa-placeholder.png" alt="Mapa" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              
              <div className="w-full lg:w-[35%] bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col justify-between">
                <div>
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#000000', marginBottom: '24px' }}>Tipos de incidentes activos</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#9d3674]"></span> 
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>Abandono de animales</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#973a4b]"></span> 
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>Mordedura/Agresión</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#cca628]"></span> 
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>Tenencia irresponsable</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#62a1d2]"></span> 
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>Solicitud de ayuda</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-[#5da667]"></span> 
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>Caso resuelto</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 flex flex-col justify-end">
                  <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#6b7280' }}>Total incidentes activos:</span>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#000000' }}>38</span>
                  </div>
                  <IonButton 
                    expand="block"
                    routerLink="/app/reportar"
                    style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                  >
                    Reportar Incidente
                  </IonButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            SECCIÓN 3: ACCESOS RÁPIDOS
           ========================================= */}
        <div className="bg-[#2d6aab] py-20 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 800, fontSize: '36px', color: '#FFFFFF', marginBottom: '8px' }}>
              ¿Qué necesitas hacer hoy?
            </h2>
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#e0f2fe', marginBottom: '40px' }}>
              Accede a los servicios más usados
            </p>

            <IonGrid className="ion-no-padding">
              <IonRow>
                {accesosRapidos.map((item, idx) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={idx} className="p-3">
                    <IonCard 
                      button 
                      routerLink={item.ruta} 
                      className="m-0 h-full shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col" 
                      style={{ '--background': '#ffffff', '--border-radius': '8px' }}
                    >
                      <IonCardContent className="p-6">
                        {/* Título Accesos Rápidos */}
                        <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: '#000000', marginBottom: '8px' }}>
                          {item.titulo}
                        </h3>
                        <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#6b7280', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                          {item.desc}
                        </p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* =========================================
            SECCIÓN 4: ADOPCIONES
           ========================================= */}
        <div className="bg-white py-20 px-8 md:px-16 lg:px-24 border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto">
            <div style={{ display: 'inline-block', backgroundColor: '#e0f2fe', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px' }}>
              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '10px', color: '#0369a1', letterSpacing: '1px' }}>
                ADOPCIONES
              </span>
            </div>
            
            {/* Título Mascotas */}
            <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '24px', color: '#000000', marginBottom: '40px' }}>
              Mascotas que buscan hogar
            </h2>

            <IonGrid className="ion-no-padding">
              <IonRow>
                {animalesDestacados.map((animal) => (
                  <IonCol size="12" sizeMd="4" key={animal.id} className="p-3">
                    <IonCard className="m-0 h-full shadow-sm border border-gray-200 flex flex-col" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      
                      <div className="h-[240px] bg-[#f9fafb] w-full border-b border-gray-100"></div>
                      
                      <IonCardContent className="p-6 bg-white">
                        {/* Nombre Mascota */}
                        <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '16px', color: '#000000', marginBottom: '12px' }}>
                          "{animal.nombre}"
                        </h3>
                        
                        <div className="flex gap-3 mb-6">
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#4b5563' }}>{animal.raza}</span>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#4b5563' }}>{animal.edad}</span>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#4b5563' }}>{animal.sexo}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {animal.etiquetas.map((etiqueta, i) => (
                            <span key={i} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '10px', padding: '4px 12px', borderRadius: '12px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                              {etiqueta}
                            </span>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/* =========================================
            FOOTER
           ========================================= */}
        <footer className="bg-[#333333] text-white py-12 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-0">
            
            <div className="flex flex-col">
              {/* Título Footer */}
              <h4 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '16px', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                Bienestar Animal · Municipalidad de Santo Domingo
              </h4>
              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#d1d5db', margin: 0 }}>
                Av. Principal s/n, Santo Domingo · contacto@munisantodomingo.cl
              </p>
              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
                © 2026 Municipalidad de Santo Domingo — Comuna Parque
              </p>
            </div>
            
            {/* Links Footer */}
            <div className="flex flex-wrap gap-6">
              <a href="#" style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '14px', color: '#FFFFFF', textDecoration: 'none' }}>Política de Privacidad</a>
              <a href="#" style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '14px', color: '#FFFFFF', textDecoration: 'none' }}>Términos de Uso</a>
              <a href="#" style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '14px', color: '#FFFFFF', textDecoration: 'none' }}>Transparencia</a>
              <a href="#" style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '14px', color: '#FFFFFF', textDecoration: 'none' }}>Contacto</a>
            </div>

          </div>
        </footer>

      </IonContent>
    </IonPage>
  );
};

export default Inicio;