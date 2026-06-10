import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonSpinner
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';
import { getOperativos, inscribirseOperativo, ApiError, type Operativo } from '../../services';
import { useNotifications } from '../../context/useNotifications';

/* Página de operativos municipales (EF1 — integración real).
   Carga los operativos desde GET /api/operativos (PostgreSQL) y permite al vecino
   inscribirse mediante POST /api/operativos/:id/inscribir: el backend decrementa
   los cupos de forma atómica y rechaza inscripciones duplicadas o sin cupos (RF-04). */

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const Operativos: React.FC = () => {
  const { notify } = useNotifications();

  const [operativos, setOperativos] = useState<Operativo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');
  // id del operativo cuya inscripción está en curso (deshabilita su botón).
  const [inscribiendo, setInscribiendo] = useState<number | null>(null);

  // Carga el listado real al montar la vista.
  useEffect(() => {
    let activo = true;
    getOperativos()
      .then((data) => { if (activo) setOperativos(data); })
      .catch((err) => {
        if (activo) setErrorCarga(err instanceof ApiError ? err.message : 'No se pudieron cargar los operativos.');
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  // Inscripción real: el backend descuenta el cupo y devuelve los restantes.
  const handleInscribirse = async (op: Operativo) => {
    setInscribiendo(op.id);
    try {
      const { cupos_disponibles } = await inscribirseOperativo(op.id);
      setOperativos((prev) => prev.map((o) => (o.id === op.id ? { ...o, cupos_disponibles } : o)));
      notify('Inscripción confirmada', `Quedaste inscrito en "${op.titulo}". Cupos restantes: ${cupos_disponibles}`, 'success');
    } catch (err) {
      notify('No se pudo inscribir', err instanceof ApiError ? err.message : 'Error de conexión', 'error');
    } finally {
      setInscribiendo(null);
    }
  };

  // Filtros por tipo (coinciden con los tipos válidos del backend).
  const filtros = ['Todos', 'Vacunación', 'Esterilización', 'Chipeo', 'Mixto'];

  const proximos = operativos.filter(
    (o) => o.estado === 'Programado' && (filtroActivo === 'Todos' || o.tipo === filtroActivo),
  );
  const finalizados = operativos.filter((o) => o.estado === 'Finalizado');

  // Resumen derivado de los datos reales del backend.
  const resumen = [
    { label: 'Operativos programados', valor: operativos.filter((o) => o.estado === 'Programado').length },
    { label: 'Operativos finalizados', valor: finalizados.length },
    { label: 'Cupos disponibles', valor: operativos.reduce((s, o) => s + o.cupos_disponibles, 0) },
    { label: 'Vecinos inscritos', valor: operativos.reduce((s, o) => s + (o.cupos_totales - o.cupos_disponibles), 0) },
  ];

  // Descompone la fecha del evento en día y mes para el bloque visual.
  const fechaBloque = (iso: string) => {
    const f = new Date(iso);
    return { dia: String(f.getDate()).padStart(2, '0'), mes: MESES[f.getMonth()] };
  };

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>

        {/*hero con título de la sección*/}
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

        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">

            {/*estados de carga y error de la API*/}
            {cargando && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
                <p className="font-slab text-sm text-gray-500 m-0">Cargando operativos...</p>
              </div>
            )}
            {!cargando && errorCarga && (
              <div className="text-center py-20">
                <p className="font-slab text-sm text-red-600 m-0">{errorCarga}</p>
              </div>
            )}

            {!cargando && !errorCarga && (
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">

                {/*columna izquierda: próximos operativos con filtros + finalizados*/}
                <IonCol size="12" sizeLg="7" sizeXl="7" className="pr-0 lg:pr-8">

                  <RevealWrapper>
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                      <h2 className="font-slab font-bold text-xl text-black m-0">Próximos operativos</h2>
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

                  {proximos.length === 0 && (
                    <p className="font-slab text-sm text-gray-500">No hay operativos programados para este filtro.</p>
                  )}

                  {/*tarjetas de operativos próximos con inscripción real*/}
                  {proximos.map((op, idx) => {
                    const { dia, mes } = fechaBloque(op.fecha_evento);
                    const sinCupos = op.cupos_disponibles <= 0;
                    return (
                    <RevealWrapper key={op.id} delay={idx * 100}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '12px' }}
                      >
                        <IonCardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-6 items-start">

                            {/*bloque de fecha del evento*/}
                            <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#bae6fd', padding: '12px' }}>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#0369a1', lineHeight: '1' }}>{dia}</span>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#0369a1' }}>{mes}</span>
                            </div>

                            <div className="flex-1 w-full">
                              <div className="flex justify-between items-start mb-2 w-full gap-4">
                                <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: 0 }}>
                                  {op.titulo}
                                </h3>

                                {/*inscripción real: bloqueada al llegar a 0 cupos (RF-04)*/}
                                <IonButton
                                  disabled={sinCupos || inscribiendo === op.id}
                                  onClick={() => handleInscribirse(op)}
                                  style={{ '--background': sinCupos ? '#9ca3af' : '#1e3a8a', '--color': '#ffffff', '--border-radius': '4px', height: '32px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', textTransform: 'none', margin: 0 }}
                                >
                                  {sinCupos ? 'Sin cupos' : inscribiendo === op.id ? 'Inscribiendo...' : 'Inscribirse'}
                                </IonButton>
                              </div>

                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 4px 0' }}>
                                <span style={{ fontWeight: 700, color: '#333333' }}>Locación: </span>{op.ubicacion} · {op.hora} hrs
                              </p>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#475569', margin: '0 0 12px 0' }}>
                                <span style={{ fontWeight: 700, color: '#333333' }}>Cupos disponibles: </span>{op.cupos_disponibles} de {op.cupos_totales}
                              </p>
                              {op.descripcion && (
                                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
                                  {op.descripcion}
                                </p>
                              )}

                              {/*etiquetas: tipo del operativo + estado de inscripción*/}
                              <div className="flex gap-2 flex-wrap">
                                <span style={{ backgroundColor: '#cffafe', color: '#0891b2', padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '11px' }}>
                                  {op.tipo}
                                </span>
                                <span style={{ backgroundColor: sinCupos ? '#fecaca' : '#dcfce7', color: sinCupos ? '#991b1b' : '#16a34a', padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '11px' }}>
                                  {sinCupos ? 'Cupos agotados' : 'Inscripción abierta'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                    );
                  })}

                  <hr className="my-8 border-gray-300" />

                  {/*listado de operativos ya realizados*/}
                  <RevealWrapper>
                    <h2 className="font-slab font-bold text-xl text-black mb-6">Operativos Finalizados</h2>
                  </RevealWrapper>

                  {finalizados.length === 0 && (
                    <p className="font-slab text-sm text-gray-500">Aún no hay operativos finalizados.</p>
                  )}

                  {finalizados.map((op, idx) => {
                    const { dia, mes } = fechaBloque(op.fecha_evento);
                    return (
                    <RevealWrapper key={op.id} delay={idx * 80}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '12px' }}
                      >
                        <IonCardContent className="p-6">
                          <div className="flex gap-6 items-start">

                            {/*fecha con fondo verde para indicar evento completado*/}
                            <div className="flex flex-col items-center justify-center rounded-lg min-w-[80px]" style={{ backgroundColor: '#a7f3d0', padding: '12px' }}>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '24px', color: '#047857', lineHeight: '1' }}>{dia}</span>
                              <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#047857' }}>{mes}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                              <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#000000', margin: '0 0 4px 0' }}>{op.titulo}</h3>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#64748b', margin: '0 0 2px 0' }}>{op.ubicacion}</p>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#334155', margin: 0 }}>
                                Asistentes inscritos: {op.cupos_totales - op.cupos_disponibles}
                              </p>
                            </div>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                    );
                  })}

                </IonCol>

                {/*columna derecha: zonas de enfoque + resumen con datos reales*/}
                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">

                  {/*mapa esquemático de zonas de enfoque de la comuna*/}
                  <RevealWrapper delay={150}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <h2 className="font-slab font-bold text-lg text-black mb-4">Zonas de enfoque</h2>

                        <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#9ca3af', borderRadius: '12px', marginBottom: '24px', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: '35%', left: '15%', width: '70px', height: '70px', backgroundColor: '#DE1010', borderRadius: '50%', opacity: 0.8 }} />
                          <div style={{ position: 'absolute', top: '20%', right: '25%', width: '30px', height: '30px', backgroundColor: '#E1EF15', borderRadius: '50%', opacity: 0.8 }} />
                          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '40px', height: '40px', backgroundColor: '#2600FC', borderRadius: '50%', opacity: 0.8 }} />
                        </div>

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

                  {/*resumen calculado con los datos reales del backend*/}
                  <RevealWrapper delay={250}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                      <IonCardContent className="p-6">
                        <h2 className="font-slab font-bold text-lg text-black mb-6">Resumen</h2>
                        <div className="flex flex-col">
                          {resumen.map((item, index) => (
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
            )}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Operativos;
