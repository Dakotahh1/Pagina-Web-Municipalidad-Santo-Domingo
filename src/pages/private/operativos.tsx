import React, { useState } from 'react';
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

const Operativos: React.FC = () => {
  const history = useHistory();
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');

  const filtros = ['Todos', 'Vacunacion', 'Esterilizacion', 'Educacion'];

  const proximosOperativos = [
    {
      id: 1,
      dia: '25',
      mes: 'may',
      titulo: 'Operativo vacunacion antirabica - Sector Norte',
      locacion: 'Calle Vicente Palma con Luces 043',
      cupos: 67,
      equipo: '3 veterinarios',
      costo: 'Gratuito',
      etiquetas: [
        { texto: 'Caninos y felinos', bg: '#cffafe', color: '#0891b2' },
        { texto: 'Inscripcion abierta', bg: '#dcfce7', color: '#16a34a' }
      ],
      botonTexto: 'Inscribirse',
      botonEstilo: { '--background': '#1e3a8a', '--color': '#ffffff' }
    },
    {
      id: 2,
      dia: '25',
      mes: 'may',
      titulo: 'Jornada esterilizacion gratuita',
      locacion: 'Calle Vicente Palma con Luces 043',
      cupos: 67,
      equipo: '3 veterinarios',
      costo: 'Gratuito',
      etiquetas: [
        { texto: 'Solo Felinos', bg: '#e0f2fe', color: '#0284c7' },
        { texto: 'Cupos limitados', bg: '#fef08a', color: '#854d0e' }
      ],
      botonTexto: 'Ver detalles',
      botonEstilo: { '--background': 'transparent', '--color': '#1e3a8a', '--border-color': '#1e3a8a', '--border-style': 'solid', '--border-width': '1px' }
    }
  ];

  const operativosFinalizados = [
    {
      id: 3,
      dia: '25',
      mes: 'may',
      titulo: 'Campaña Educativa - Flora y Fauna de Santo Domingo',
      locacion: 'Calle Vicente Palma con Luces 043',
      detalleFondo: 'Alcance: 50 Familias'
    },
    {
      id: 4,
      dia: '25',
      mes: 'may',
      titulo: 'Jornada de Chips para animales domesticos',
      locacion: 'Calle Vicente Palma con Luces 043',
      detalleFondo: 'Chips Implantados: 15'
    }
  ];

  const resumen2025 = [
    { label: 'Operativos Realizados', valor: '01' },
    { label: 'Animales Adoptados', valor: '01' },
    { label: 'Chips Instalados', valor: '01' },
    { label: 'Vacunas realizadas', valor: '01' },
    { label: 'Esterilizaciones', valor: '01' }
  ];

  const navButtonStyle = {
    '--background': 'transparent',
    '--color': '#ffffff',
    '--border-radius': '6px',
    '--box-shadow': 'none',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    textTransform: 'none' as const,
    margin: '0 4px',
    height: '42px'
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    '--background': '#ffffff',
    '--color': '#000000',
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border shadow-none">
        <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
          <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">
            
            <div className="flex items-center gap-4 shrink-0 cursor-pointer" onClick={() => history.push('/app/inicio')}>
              <div className="w-12 h-12 bg-[#7ac29a] flex items-center justify-center overflow-hidden rounded">
                <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: '16px', color: '#ffffff', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
                <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: '14px', color: '#ffffff', margin: 0 }}>Municipalidad de Santo Domingo</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center">
              <IonButton fill="solid" routerLink="/app/inicio" style={navButtonStyle}>Inicio</IonButton>
              <IonButton fill="solid" style={navButtonStyle}>Mapa de Reportes</IonButton>
              <IonButton fill="solid" routerLink="/app/adopciones" style={navButtonStyle}>Adopciones</IonButton>
              <IonButton fill="solid" routerLink="/app/foro" style={navButtonStyle}>Foro Vecinal</IonButton>
              <IonButton fill="solid" routerLink="/app/operativos" style={activeNavButtonStyle}>Operativos</IonButton>
            </div>

            <div className="flex items-center gap-3">
              <IonButton style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}>
                Registrarse
              </IonButton>
              <IonButton style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}>
                Iniciar Sesión
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>
        
        {/* HERO SECTION */}
        <div style={{ backgroundColor: '#8ab4f8', padding: '48px 32px' }}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div style={{ backgroundColor: '#ffffff', display: 'inline-block', padding: '6px 12px', borderRadius: '4px', marginBottom: '16px' }}>
              <span style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '12px', color: '#333333' }}>
                Municipalidad de Santo Domingo
              </span>
            </div>

            <h1 style={{ fontFamily: "Roboto Serif", fontWeight: 700, fontSize: '36px', color: '#ffffff', margin: 0 }}>
              Operativos de tenencia responsable
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">
                
                {/* COLUMNA IZQUIERDA: LISTA DE OPERATIVOS */}
                <IonCol size="12" sizeLg="7" sizeXl="7" className="pr-0 lg:pr-8">
                  
                  {/* Cabecera Próximos Operativos */}
                  <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '20px', color: '#000000', margin: 0 }}>
                      Proximos operativos
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {filtros.map(filtro => (
                        <button 
                          key={filtro}
                          onClick={() => setFiltroActivo(filtro)}
                          style={{
                            backgroundColor: filtroActivo === filtro ? '#bae6fd' : '#e0f2fe',
                            color: '#0369a1',
                            padding: '6px 16px',
                            borderRadius: '16px',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: '12px'
                          }}
                        >
                          {filtro}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista Próximos */}
                  {proximosOperativos.map(op => (
                    <IonCard key={op.id} className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          
                          <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#bae6fd', padding: '12px' }}>
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#0369a1', lineHeight: '1' }}>{op.dia}</span>
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#0369a1' }}>{op.mes}</span>
                          </div>
                          
                          <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-2 w-full gap-4">
                              <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: 0 }}>
                                {op.titulo}
                              </h3>
                              <IonButton 
                                style={{ ...op.botonEstilo, '--border-radius': '4px', height: '32px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', textTransform: 'none', margin: 0 }}
                              >
                                {op.botonTexto}
                              </IonButton>
                            </div>
                            
                            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: 700, color: '#333333' }}>Locacion: </span>{op.locacion}
                            </p>
                            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 12px 0' }}>
                              <span style={{ fontWeight: 700, color: '#333333' }}>Cupos: </span>{op.cupos} mascotas &nbsp;
                              <span style={{ fontWeight: 700, color: '#333333' }}>Equipo: </span>{op.equipo} &nbsp;
                              <span style={{ fontWeight: 700, color: '#333333' }}>Costo: </span>{op.costo}
                            </p>

                            <div className="flex gap-2">
                              {op.etiquetas.map((etiq, idx) => (
                                <span key={idx} style={{ backgroundColor: etiq.bg, color: etiq.color, padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '11px' }}>
                                  {etiq.texto}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}

                  <hr className="my-8 border-gray-300" />

                  {/* Cabecera Finalizados */}
                  <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>
                    Operativos Finalizados
                  </h2>

                  {/* Lista Finalizados */}
                  {operativosFinalizados.map(op => (
                    <IonCard key={op.id} className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <div className="flex gap-6 items-start">
                          
                          <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#a7f3d0', padding: '12px' }}>
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#047857', lineHeight: '1' }}>{op.dia}</span>
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#047857' }}>{op.mes}</span>
                          </div>
                          
                          <div className="flex-1 w-full flex flex-col justify-center">
                            <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: '0 0 4px 0' }}>
                              {op.titulo}
                            </h3>
                            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#64748b', margin: '0 0 2px 0' }}>
                              {op.locacion}
                            </p>
                            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#334155', margin: 0 }}>
                              {op.detalleFondo}
                            </p>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}

                </IonCol>

                {/* COLUMNA DERECHA: MAPA Y RESUMEN */}
                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">
                  
                  {/* Tarjeta Zonas de enfoque */}
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                    <IonCardContent className="p-6">
                      <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '16px' }}>
                        Zonas de enfoque
                      </h2>
                      
                      {/* Contenedor del Mapa: Permite backgroundImage dinámica */}
                      <div 
                        style={{ 
                          position: 'relative', 
                          width: '100%', 
                          height: '220px', 
                          backgroundColor: '#9ca3af', 
                          borderRadius: '12px', 
                          marginBottom: '24px',
                          backgroundImage: 'url("")', // Para poner imagen de fondo, insertar ruta aquí, ej: url("/assets/mapa.png")
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Círculo Rojo */}
                        <div style={{ position: 'absolute', top: '35%', left: '15%', width: '70px', height: '70px', backgroundColor: '#DE1010', borderRadius: '50%', opacity: 0.8 }}></div>
                        {/* Círculo Amarillo */}
                        <div style={{ position: 'absolute', top: '20%', right: '25%', width: '30px', height: '30px', backgroundColor: '#E1EF15', borderRadius: '50%', opacity: 0.8 }}></div>
                        {/* Círculo Azul */}
                        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '40px', height: '40px', backgroundColor: '#2600FC', borderRadius: '50%', opacity: 0.8 }}></div>
                      </div>

                      {/* Leyenda */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#E1EF15', borderRadius: '50%' }}></div>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>Zona Norte</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#DE1010', borderRadius: '50%' }}></div>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>Zona Sur</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#2600FC', borderRadius: '50%' }}></div>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>La Parroquia</span>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  {/* Tarjeta Resumen 2025 */}
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                    <IonCardContent className="p-6">
                      <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '24px' }}>
                        Resumen 2025
                      </h2>
                      
                      <div className="flex flex-col">
                        {resumen2025.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0 last:pb-0">
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: '#1e3a8a' }}>
                              {item.label}
                            </span>
                            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '18px', color: '#000000' }}>
                              {item.valor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>

                </IonCol>

              </IonRow>
            </IonGrid>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Operativos;