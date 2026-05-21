import React from 'react';
import {
  IonPage, IonContent,
  IonCard, IonCardContent
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página del mapa de reportes. muestra un mapa de calor de la comuna con los
  incidentes reportados por los vecinos, diferenciados por tipo y urgencia.

  el mapa interactivo real se integrará en la entrega parcial 2 con leaflet o google maps.
  por ahora se muestra un placeholder visual con las zonas de enfoque*/

const MapaReportes: React.FC = () => {

  const zonas = [
    { nombre: 'Zona Norte — Sector Huertos',    reportes: 12, color: '#E1EF15', nivel: 'Bajo'   },
    { nombre: 'Zona Sur — La Parroquia',         reportes: 34, color: '#DE1010', nivel: 'Alto'   },
    { nombre: 'Zona Centro — Casco Histórico',   reportes: 18, color: '#2600FC', nivel: 'Medio'  },
  ];

  const reportesRecientes = [
    { id: 'R-001', tipo: 'Abandono',          sector: 'La Parroquia',  tiempo: 'Hace 2 horas' },
    { id: 'R-002', tipo: 'Animal herido',     sector: 'Sector Norte',  tiempo: 'Hace 5 horas' },
    { id: 'R-003', tipo: 'Tenencia irresponsable', sector: 'Centro',   tiempo: 'Ayer'         },
    { id: 'R-004', tipo: 'Mordedura',         sector: 'La Parroquia',  tiempo: 'Hace 2 días'  },
  ];

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen style={{ '--background': '#f8fafc' }}>

        <div style={{ backgroundColor: '#eef6fc', padding: '48px 32px' }}>
          <RevealWrapper>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
              <span className="font-slab font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
                Visualización Comunal
              </span>
              <h1 className="font-slab font-bold text-4xl text-gray-800 mb-2">
                Mapa de Reportes
              </h1>
              <p className="font-slab text-[15px] text-gray-500 m-0">
                Visualiza los incidentes reportados por la comunidad en el territorio de Santo Domingo.
              </p>
            </div>
          </RevealWrapper>
        </div>

        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/*mapa placeholder — se reemplazará con Leaflet o Google Maps en EP2*/}
              <div className="flex-1">
                <RevealWrapper>
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                    <IonCardContent className="p-6">
                      <h2 className="font-slab font-bold text-lg text-black mb-4">Mapa de calor comunal</h2>
                      <div style={{
                        position: 'relative', width: '100%', height: '400px',
                        backgroundColor: '#d1d5db', borderRadius: '12px',
                        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '100px', height: '100px', backgroundColor: '#DE1010', borderRadius: '50%', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', top: '15%', right: '30%', width: '50px', height: '50px', backgroundColor: '#E1EF15', borderRadius: '50%', opacity: 0.6 }} />
                        <div style={{ position: 'absolute', bottom: '25%', right: '20%', width: '70px', height: '70px', backgroundColor: '#2600FC', borderRadius: '50%', opacity: 0.6 }} />
                        <p className="font-slab text-sm text-gray-500 z-10 bg-white/80 px-4 py-2 rounded">
                          Mapa interactivo disponible en EP2
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-6">
                        {zonas.map((zona) => (
                          <div key={zona.nombre} className="flex items-center gap-3">
                            <div style={{ width: '14px', height: '14px', backgroundColor: zona.color, borderRadius: '50%' }} />
                            <div>
                              <span className="font-slab font-semibold text-sm text-gray-800 block">{zona.nombre}</span>
                              <span className="font-slab text-xs text-gray-500">{zona.reportes} reportes · Nivel {zona.nivel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>
              </div>

              {/*sidebar con reportes recientes*/}
              <div className="w-full lg:w-[360px] flex flex-col gap-6">
                <RevealWrapper delay={100}>
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                    <IonCardContent className="p-6">
                      <h2 className="font-slab font-bold text-lg text-black mb-4">Reportes recientes</h2>
                      <div className="flex flex-col">
                        {reportesRecientes.map((r) => (
                          <div key={r.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <span className="font-slab font-semibold text-sm text-gray-800 block">{r.tipo}</span>
                              <span className="font-slab text-xs text-gray-500">{r.sector} · {r.tiempo}</span>
                            </div>
                            <span className="font-slab text-xs text-gray-400">{r.id}</span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

                <RevealWrapper delay={200}>
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                    <IonCardContent className="p-6 text-center">
                      <h2 className="font-slab font-bold text-2xl text-black mb-1">64</h2>
                      <p className="font-slab text-sm text-gray-500 m-0">Total reportes activos en la comuna</p>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>
              </div>
            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default MapaReportes;
