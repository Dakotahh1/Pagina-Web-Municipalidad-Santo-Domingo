import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonToast
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página de operativos municipales. muestra los próximos eventos veterinarios
  (vacunación, esterilización, educación) y un historial de los ya realizados.

  estructura:
    - hero con título de la sección
    - columna izquierda: próximos operativos + finalizados con filtro por tipo
    - columna derecha: mapa de zonas de enfoque + resumen estadístico del año*/

const Operativos: React.FC = () => {
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');
  const [showToast, setShowToast]       = useState(false);
  const [toastMsg, setToastMsg]         = useState('');

  const mostrarToast = (msg: string) => { setToastMsg(msg); setShowToast(true); };

  //categorías disponibles para filtrar la lista de operativos
  const filtros = ['Todos', 'Vacunacion', 'Esterilizacion', 'Educacion'];

  /*operativos programados próximamente. cada uno tiene fecha, cupos, equipo,
    costo y etiquetas de estado (inscripción abierta, cupos limitados, etc.)*/
  const proximosOperativos = [
    {
      id: 1,
      dia: '25', mes: 'may',
      titulo: 'Operativo vacunacion antirabica - Sector Norte',
      locacion: 'Calle Vicente Palma con Luces 043',
      cupos: 67, equipo: '3 veterinarios', costo: 'Gratuito',
      etiquetas: [
        { texto: 'Caninos y felinos',  bg: '#cffafe', color: '#0891b2' },
        { texto: 'Inscripcion abierta', bg: '#dcfce7', color: '#16a34a' }
      ],
      botonTexto: 'Inscribirse',
      botonEstilo: { '--background': '#1e3a8a', '--color': '#ffffff' }
    },
    {
      id: 2,
      dia: '25', mes: 'may',
      titulo: 'Jornada esterilizacion gratuita',
      locacion: 'Calle Vicente Palma con Luces 043',
      cupos: 67, equipo: '3 veterinarios', costo: 'Gratuito',
      etiquetas: [
        { texto: 'Solo Felinos',    bg: '#e0f2fe', color: '#0284c7' },
        { texto: 'Cupos limitados', bg: '#fef08a', color: '#854d0e' }
      ],
      botonTexto: 'Ver detalles',
      botonEstilo: { '--background': 'transparent', '--color': '#1e3a8a', '--border-color': '#1e3a8a', '--border-style': 'solid', '--border-width': '1px' }
    }
  ];

  /*operativos ya realizados. muestran el resultado (familias alcanzadas, chips implantados, etc.)
    TODO: los valores de detalleFondo deberían venir de la api*/
  const operativosFinalizados = [
    { id: 3, dia: '25', mes: 'may', titulo: 'Campaña Educativa - Flora y Fauna de Santo Domingo', locacion: 'Calle Vicente Palma con Luces 043', detalleFondo: 'Alcance: 50 Familias'     },
    { id: 4, dia: '25', mes: 'may', titulo: 'Jornada de Chips para animales domesticos',          locacion: 'Calle Vicente Palma con Luces 043', detalleFondo: 'Chips Implantados: 15'  }
  ];

  /*resumen estadístico del año. los valores están en '01' como placeholder.
    reemplazar con datos reales cuando estén disponibles desde la api*/
  const resumen2025 = [
    { label: 'Operativos Realizados', valor: '01' },
    { label: 'Animales Adoptados',    valor: '01' },
    { label: 'Chips Instalados',      valor: '01' },
    { label: 'Vacunas realizadas',    valor: '01' },
    { label: 'Esterilizaciones',      valor: '01' },
  ];

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>

        {/*hero con título de la sección. fondo azul claro diferente al muni-blue*/}
        <div style={{ backgroundColor: '#8ab4f8', padding: '48px 32px' }}>
          <RevealWrapper>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
              <div style={{ backgroundColor: '#ffffff', display: 'inline-block', padding: '6px 12px', borderRadius: '4px', marginBottom: '16px' }}>
                <span className="font-slab font-bold text-xs text-gray-800">Municipalidad de Santo Domingo</span>
              </div>
              <h1 style={{ fontFamily: 'Roboto Serif', fontWeight: 700, fontSize: '36px', color: '#ffffff', margin: 0 }}>
                Operativos de tenencia responsable
              </h1>
            </div>
          </RevealWrapper>
        </div>

        {/*contenido principal en dos columnas: lista de operativos + sidebar*/}
        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">

                {/*columna izquierda: próximos operativos con filtros y finalizados*/}
                <IonCol size="12" sizeLg="7" sizeXl="7" className="pr-0 lg:pr-8">

                  {/*cabecera con título y filtros por tipo de operativo*/}
                  <RevealWrapper>
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                      <h2 className="font-slab font-bold text-xl text-black m-0">Proximos operativos</h2>
                      <div className="flex flex-wrap gap-2">
                        {filtros.map(filtro => (
                          <button
                            key={filtro}
                            onClick={() => setFiltroActivo(filtro)}
                            className="transition-all duration-150"
                            style={{
                              backgroundColor: filtroActivo === filtro ? '#bae6fd' : '#e0f2fe',
                              color: '#0369a1',
                              padding: '6px 16px', borderRadius: '16px', border: 'none',
                              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                              fontWeight: 500, fontSize: '12px'
                            }}
                          >
                            {filtro}
                          </button>
                        ))}
                      </div>
                    </div>
                  </RevealWrapper>

                  {/*tarjetas de operativos próximos con fecha, detalles y botón de inscripción*/}
                  {proximosOperativos.map((op, idx) => (
                    <RevealWrapper key={op.id} delay={idx * 100}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '12px' }}
                      >
                        <IonCardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-6 items-start">

                            {/*bloque de fecha (día + mes) con fondo celeste*/}
                            <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#bae6fd', padding: '12px' }}>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#0369a1', lineHeight: '1' }}>{op.dia}</span>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#0369a1' }}>{op.mes}</span>
                            </div>

                            <div className="flex-1 w-full">
                              <div className="flex justify-between items-start mb-2 w-full gap-4">
                                <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: 0 }}>
                                  {op.titulo}
                                </h3>

                                {/*botón de acción: "inscribirse" muestra toast, "ver detalles" también*/}
                                <IonButton
                                  onClick={() => mostrarToast(
                                    op.botonTexto === 'Inscribirse'
                                      ? `inscripción confirmada para "${op.titulo}". recibirás un correo de confirmación`
                                      : `mostrando detalles de "${op.titulo}"`
                                  )}
                                  style={{ ...op.botonEstilo, '--border-radius': '4px', height: '32px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', textTransform: 'none', margin: 0 }}
                                >
                                  {op.botonTexto}
                                </IonButton>
                              </div>

                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                                <span style={{ fontWeight: 700, color: '#333333' }}>Locación: </span>{op.locacion}
                              </p>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 12px 0' }}>
                                <span style={{ fontWeight: 700, color: '#333333' }}>Cupos: </span>{op.cupos} mascotas &nbsp;
                                <span style={{ fontWeight: 700, color: '#333333' }}>Equipo: </span>{op.equipo} &nbsp;
                                <span style={{ fontWeight: 700, color: '#333333' }}>Costo: </span>{op.costo}
                              </p>

                              {/*etiquetas de especie y estado de inscripción*/}
                              <div className="flex gap-2 flex-wrap">
                                {op.etiquetas.map((etiq, i) => (
                                  <span key={i} style={{ backgroundColor: etiq.bg, color: etiq.color, padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '11px' }}>
                                    {etiq.texto}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                  ))}

                  <hr className="my-8 border-gray-300" />

                  {/*listado de operativos ya realizados con su resultado*/}
                  <RevealWrapper>
                    <h2 className="font-slab font-bold text-xl text-black mb-6">Operativos Finalizados</h2>
                  </RevealWrapper>

                  {operativosFinalizados.map((op, idx) => (
                    <RevealWrapper key={op.id} delay={idx * 80}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '12px' }}
                      >
                        <IonCardContent className="p-6">
                          <div className="flex gap-6 items-start">

                            {/*fecha con fondo verde para indicar que está completado*/}
                            <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#a7f3d0', padding: '12px' }}>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#047857', lineHeight: '1' }}>{op.dia}</span>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#047857' }}>{op.mes}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                              <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: '0 0 4px 0' }}>{op.titulo}</h3>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#64748b', margin: '0 0 2px 0' }}>{op.locacion}</p>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#334155', margin: 0 }}>{op.detalleFondo}</p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                  ))}

                </IonCol>

                {/*columna derecha: mapa de zonas y resumen estadístico*/}
                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">

                  {/*mapa de zonas de enfoque. los círculos CSS son un placeholder
                    hasta integrar un mapa real (leaflet o google maps)*/}
                  <RevealWrapper delay={150}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <h2 className="font-slab font-bold text-lg text-black mb-4">Zonas de enfoque</h2>

                        {/*contenedor del mapa. para agregar imagen real, reemplazar la url vacía*/}
                        <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#9ca3af', borderRadius: '12px', marginBottom: '24px', backgroundImage: 'url("")', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: '35%', left: '15%', width: '70px', height: '70px', backgroundColor: '#DE1010', borderRadius: '50%', opacity: 0.8 }} />
                          <div style={{ position: 'absolute', top: '20%', right: '25%', width: '30px', height: '30px', backgroundColor: '#E1EF15', borderRadius: '50%', opacity: 0.8 }} />
                          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '40px', height: '40px', backgroundColor: '#2600FC', borderRadius: '50%', opacity: 0.8 }} />
                        </div>

                        {/*leyenda de colores por zona*/}
                        <div className="flex flex-col gap-3">
                          {[
                            { color: '#E1EF15', label: 'Zona Norte'  },
                            { color: '#DE1010', label: 'Zona Sur'    },
                            { color: '#2600FC', label: 'La Parroquia' },
                          ].map(({ color, label }) => (
                            <div key={label} className="flex items-center gap-3">
                              <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '50%' }} />
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*resumen estadístico del año. valores placeholder, actualizar con api*/}
                  <RevealWrapper delay={250}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <h2 className="font-slab font-bold text-lg text-black mb-6">Resumen 2025</h2>
                        <div className="flex flex-col">
                          {resumen2025.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0 last:pb-0">
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: '#1e3a8a' }}>{item.label}</span>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '18px', color: '#000000' }}>{item.valor}</span>
                            </div>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/*toast de confirmación para inscripciones*/}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={3500}
          position="bottom"
          color="success"
        />

      </IonContent>
    </IonPage>
  );
};

export default Operativos;
