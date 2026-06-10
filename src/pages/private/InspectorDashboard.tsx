import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonSpinner,
  IonHeader, IonToolbar,
  IonMenu, IonMenuToggle, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  gridOutline, documentTextOutline, pawOutline,
  calendarOutline, hardwareChipOutline, mapOutline,
  callOutline, warningOutline, settingsOutline, menuOutline,
  trashOutline, refreshOutline
} from 'ionicons/icons';
import RevealWrapper from '../../components/RevealWrapper';
import { useAuth } from '../../context/useAuth';
import { useNotifications } from '../../context/useNotifications';
import { getReportes, actualizarEstadoReporte, eliminarReporte, type Reporte } from '../../services/reportesService';
import { ApiError } from '../../services/api';

/*panel de gestión para inspectores municipales.
  usa IonMenu (EP 1.6) como sidebar de navegación lateral en lugar de un div estático.
  IonMenu se integra con el sistema de gestos de ionic para abrir/cerrar con swipe.

  estructura:
    - IonMenu: sidebar lateral con las secciones del panel
    - header: logo + perfil del inspector + botón de cierre de sesión
    - contenido: kpis del mes + tabla de reportes recientes + banner operativo*/

const InspectorDashboard: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const { notify } = useNotifications();

  // Reportes reales desde el backend (EF1 — CRUD: Read/Update/Delete).
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const cargarReportes = () => {
    setCargando(true);
    setErrorCarga('');
    getReportes()
      .then(setReportes)
      .catch((e) => setErrorCarga(e instanceof ApiError ? e.message : 'No se pudieron cargar los reportes'))
      .finally(() => setCargando(false));
  };
  useEffect(() => { cargarReportes(); }, []);

  // PATCH — cambia el estado de un reporte.
  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const actualizado = await actualizarEstadoReporte(id, estado);
      setReportes((prev) => prev.map((r) => (r.id === id ? actualizado : r)));
      notify('Reporte actualizado', `Caso #${id} → ${estado}`, 'success');
    } catch (e) {
      notify('Error', e instanceof ApiError ? e.message : 'No se pudo actualizar', 'error');
    }
  };

  // DELETE — elimina un reporte (con confirmación).
  const borrarReporte = async (id: number) => {
    if (!window.confirm(`¿Eliminar el reporte #${id}? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarReporte(id);
      setReportes((prev) => prev.filter((r) => r.id !== id));
      notify('Reporte eliminado', `Caso #${id} eliminado`, 'info');
    } catch (e) {
      notify('Error', e instanceof ApiError ? e.message : 'No se pudo eliminar', 'error');
    }
  };

  // Color del badge según el estado del reporte.
  const estadoColor = (estado: string): { bg: string; color: string } => {
    switch (estado) {
      case 'Pendiente':  return { bg: '#fecaca', color: '#991b1b' };
      case 'En proceso': return { bg: '#fef08a', color: '#854d0e' };
      case 'Resuelto':   return { bg: '#bbf7d0', color: '#166534' };
      case 'Cerrado':    return { bg: '#e5e7eb', color: '#374151' };
      default:           return { bg: '#e5e7eb', color: '#374151' };
    }
  };

  const reportesActivos = reportes.filter((r) => r.estado !== 'Resuelto' && r.estado !== 'Cerrado').length;

  const kpis = [
    { titulo: 'Reportes Activos',   valor: String(reportesActivos),    subtitulo: `${reportes.length} en total`,    colorValor: '#dc2626' },
    { titulo: 'Fichas de Animales', valor: '32', subtitulo: '+12 este mes',          colorValor: '#000000' },
    { titulo: 'Chips Registrados',  valor: '65', subtitulo: '73.25% cobertura',      colorValor: '#000000' },
    { titulo: 'Multas Emitidas',    valor: '14', subtitulo: '-2 vs el mes anterior', colorValor: '#d97706' },
  ];

  const menuItems = [
    { label: 'Dashboard',          icon: gridOutline,         active: true  },
    { label: 'Reportes',           icon: documentTextOutline, active: false },
    { label: 'Fichas de animales', icon: pawOutline,          active: false },
    { label: 'Operativos',         icon: calendarOutline,     active: false },
    { label: 'Control de chips',   icon: hardwareChipOutline, active: false },
    { label: 'Mapa de casos',      icon: mapOutline,          active: false },
    { label: 'Directorio',         icon: callOutline,         active: false },
    { label: 'Multas emitidas',    icon: warningOutline,      active: false },
    { label: 'Configuraciones',    icon: settingsOutline,     active: false },
  ];

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <>
      {/*IonMenu: sidebar lateral del panel de gestión (EP 1.6).
        contentId vincula el menú con el contenido principal.
        en móvil se abre con swipe o con el botón hamburguesa*/}
      <IonMenu contentId="admin-content" side="start" type="overlay" style={{ '--background': '#255c99' }}>
        <IonContent style={{ '--background': '#255c99' }}>

          <div className="p-8 border-b border-white/20">
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#e0f2fe', margin: '0 0 24px 0' }}>
              Bienvenido/a, Vicente
            </p>
            <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#fff', margin: '0 0 4px 0' }}>
              Inspector Municipal
            </h2>
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#93c5fd', margin: 0 }}>
              Unidad Bienestar Animal
            </p>
          </div>

          <IonList lines="none" style={{ '--background': 'transparent', background: 'transparent' }}>
            {menuItems.map((item, idx) => (
              <IonMenuToggle key={idx} autoHide={false}>
                <IonItem
                  button
                  style={{
                    '--background': item.active ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '--color': '#ffffff',
                    '--padding-start': '24px',
                  }}
                >
                  <IonIcon icon={item.icon} slot="start" style={{ color: '#e2e8f0', fontSize: '18px' }} />
                  <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: item.active ? 700 : 500, fontSize: '14px' }}>
                    {item.label}
                  </IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="admin-content">

        <IonHeader className="ion-no-border shadow-none">
          <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '8px', '--padding-bottom': '8px', '--padding-start': '1rem', '--padding-end': '2rem' }}>
            <div className="flex justify-between items-center w-full">

              <div className="flex items-center gap-4">
                {/*botón hamburguesa para abrir IonMenu en móvil*/}
                <IonMenuToggle>
                  <IonButton fill="clear" style={{ '--color': '#ffffff' }}>
                    <IonIcon icon={menuOutline} slot="icon-only" />
                  </IonButton>
                </IonMenuToggle>

                <div className="flex items-center gap-3 shrink-0">
                  <img src="/assets/logo.png" alt="Logo" loading="lazy" className="w-12 h-12 object-contain"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <div className="flex flex-col justify-center">
                    <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '12px', color: '#fff', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '11px', color: '#fff', margin: 0 }}>Municipalidad de Santo Domingo</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                  <img src="/assets/perfil-vicente.jpg" alt="Perfil" loading="lazy" className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = 'https://ionicframework.com/docs/img/demos/avatar.svg'; }} />
                </div>
                <div style={{ backgroundColor: '#94a3b8', padding: '6px 24px', borderRadius: '4px' }}>
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>
                    V. Palma Lucero
                  </span>
                </div>
                <IonButton onClick={handleLogout}
                  style={{ '--background': '#000', '--color': '#fff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', textTransform: 'none', height: '36px', margin: 0 }}>
                  Cerrar Sesión
                </IonButton>
              </div>

            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="bg-white">
          <div className="flex h-full w-full">

            {/*sidebar visible en escritorio — réplica estática del IonMenu para pantallas grandes.
              en móvil se oculta y se usa IonMenu con swipe*/}
            <div className="w-[260px] bg-[#255c99] shrink-0 hidden lg:flex flex-col h-full border-r border-gray-200 overflow-y-auto">
              <div className="p-8 border-b border-white/20">
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: '#e0f2fe', margin: '0 0 24px 0' }}>
                  Bienvenido/a, Vicente
                </p>
                <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#fff', margin: '0 0 4px 0' }}>
                  Inspector Municipal
                </h2>
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#93c5fd', margin: 0 }}>
                  Unidad Bienestar Animal
                </p>
              </div>
              <nav className="flex-1 py-6 flex flex-col gap-1">
                {menuItems.map((item, idx) => (
                  <div key={idx}
                    className={`flex items-center gap-4 px-8 py-3 cursor-pointer transition-colors duration-150 ${item.active ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <IonIcon icon={item.icon} style={{ color: '#e2e8f0', fontSize: '18px' }} />
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: item.active ? 700 : 500, fontSize: '14px', color: '#fff' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </nav>
            </div>

            {/*contenido principal*/}
            <div className="flex-1 bg-white p-10 overflow-y-auto">
              <div className="max-w-[1000px]">

                <RevealWrapper>
                  <div className="mb-8">
                    <h1 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '28px', color: '#000', marginBottom: '8px' }}>
                      Dashboard — Mayo 2026
                    </h1>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '16px', color: '#9ca3af', margin: 0 }}>
                      Resumen de actividad de la unidad
                    </p>
                  </div>
                </RevealWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {kpis.map((kpi, idx) => (
                    <RevealWrapper key={idx} delay={idx * 80}>
                      <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
                        <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '11px', color: '#3b82f6', marginBottom: '12px', textTransform: 'uppercase' }}>
                          {kpi.titulo}
                        </h3>
                        <div style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '32px', color: kpi.colorValor, lineHeight: '1', marginBottom: '8px' }}>
                          {kpi.valor}
                        </div>
                        <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#6b7280', margin: 0 }}>
                          {kpi.subtitulo}
                        </p>
                      </div>
                    </RevealWrapper>
                  ))}
                </div>

                <RevealWrapper delay={150}>
                  <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ padding: '20px 24px', background: '#f0f0f0', borderBottom: '1px solid #d1d5db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#374151', margin: 0 }}>
                        Reportes ciudadanos
                      </h2>
                      {/*recarga manual del listado*/}
                      <button onClick={cargarReportes} title="Actualizar" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#2d6aab', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                        <IonIcon icon={refreshOutline} style={{ fontSize: '18px' }} /> Actualizar
                      </button>
                    </div>

                    {/*estados de carga / error / vacío*/}
                    {cargando && (
                      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
                        <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#6b7280' }}>Cargando reportes...</span>
                      </div>
                    )}
                    {!cargando && errorCarga && (
                      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#dc2626' }}>{errorCarga}</div>
                    )}
                    {!cargando && !errorCarga && reportes.length === 0 && (
                      <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#9ca3af' }}>No hay reportes registrados.</div>
                    )}

                    {!cargando && !errorCarga && reportes.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f0f0f0', borderBottom: '1px solid #d1d5db' }}>
                          <tr>
                            {['ID', 'Tipo', 'Sector', 'Fecha', 'Estado', 'Acción'].map(col => (
                              <th key={col} style={{ padding: '14px 24px', textAlign: 'left', fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reportes.map((r, idx) => {
                            const ec = estadoColor(r.estado);
                            return (
                            <tr key={r.id}
                              style={{ borderBottom: idx < reportes.length - 1 ? '1px solid #e5e7eb' : 'none', background: '#fff' }}
                              className="transition-colors duration-100 hover:bg-gray-50">
                              <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap' }}>
                                #{r.id}{r.urgente && <span style={{ color: '#dc2626', fontWeight: 700 }}> ·urgente</span>}
                              </td>
                              <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563' }}>{r.tipo_incidente}</td>
                              <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563' }}>{r.sector}</td>
                              <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap' }}>
                                {new Date(r.fecha_creacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                <span style={{ display: 'inline-block', backgroundColor: ec.bg, color: ec.color, fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '12px', padding: '5px 16px', borderRadius: '9999px', minWidth: '90px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                  {r.estado}
                                </span>
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {/*PATCH: cambiar estado del reporte*/}
                                  <select
                                    value={r.estado}
                                    onChange={(e) => cambiarEstado(r.id, e.target.value)}
                                    style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '7px 10px', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#111827', cursor: 'pointer', background: '#fff' }}
                                  >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Resuelto">Resuelto</option>
                                    <option value="Cerrado">Cerrado</option>
                                  </select>
                                  {/*DELETE: eliminar el reporte*/}
                                  <button
                                    onClick={() => borrarReporte(r.id)}
                                    title="Eliminar reporte"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                                  >
                                    <IonIcon icon={trashOutline} style={{ fontSize: '18px' }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    )}
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={200}>
                  <div style={{ marginTop: '32px', background: '#e0f2fe', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '14px', color: '#1e3a8a' }}>Próximo operativo</span>
                        <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>—</span>
                        <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>02 mayo 2026</span>
                      </div>
                      <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#475569', margin: 0 }}>
                        Vacunación antirrábica — Gimnasio Municipal — 09:00 a 14:00 hrs
                      </p>
                    </div>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '14px', color: '#60a5fa' }}>
                      V. Palma Lucero
                    </span>
                  </div>
                </RevealWrapper>

              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default InspectorDashboard;
