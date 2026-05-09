import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton,
  IonHeader,
  IonToolbar
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const InspectorDashboard: React.FC = () => {
  const history = useHistory();

  const kpis = [
    { titulo: 'REPORTES ACTIVOS', valor: '80', subtitulo: '3 nuevos hoy', colorValor: '#dc2626' },
    { titulo: 'FICHAS DE ANIMALES', valor: '32', subtitulo: '+12 este mes', colorValor: '#000000' },
    { titulo: 'CHIPS REGISTRADOS', valor: '65', subtitulo: '73.25% cobertura', colorValor: '#000000' },
    { titulo: 'MULTAS EMITIDAS', valor: '14', subtitulo: '-2 vs el mes anterior', colorValor: '#d97706' }
  ];

  const reportes = [
    { id: 'G-xxxx-xx36', tipo: 'Abandono', sector: 'La parroquia', fecha: 'Hoy 09:36', estado: 'Abierto',    bgEstado: '#fecaca', colorEstado: '#991b1b', accion: 'Atender' },
    { id: 'G-xxxx-xx37', tipo: 'Abandono', sector: 'La parroquia', fecha: 'Hoy 09:36', estado: 'Cerrado',    bgEstado: '#bbf7d0', colorEstado: '#166534', accion: 'Ver' },
    { id: 'G-xxxx-xx38', tipo: 'Abandono', sector: 'La parroquia', fecha: 'Hoy 09:36', estado: 'Abierto',    bgEstado: '#fecaca', colorEstado: '#991b1b', accion: 'Atender' },
    { id: 'G-xxxx-xx39', tipo: 'Abandono', sector: 'La parroquia', fecha: 'Hoy 09:36', estado: 'Cerrado',    bgEstado: '#bbf7d0', colorEstado: '#166534', accion: 'Ver' },
    { id: 'G-xxxx-xx40', tipo: 'Abandono', sector: 'La parroquia', fecha: 'Hoy 09:36', estado: 'En proceso', bgEstado: '#fef08a', colorEstado: '#854d0e', accion: 'Atender' }
  ];

  const menuItems = [
    { label: 'Dashboard',            active: true  },
    { label: 'Reportes',             active: false },
    { label: 'Fichas de animales',   active: false },
    { label: 'Operativos',           active: false },
    { label: 'Control de chips',     active: false },
    { label: 'Mapa de casos',        active: false },
    { label: 'Directorio',           active: false },
    { label: 'Multas emitidas',      active: false },
    { label: 'Configuraciones',      active: false }
  ];

  const handleLogout = () => { history.push('/login'); };

  return (
    <IonPage>
      {/* ── HEADER ── */}
      <IonHeader className="ion-no-border shadow-none">
        <IonToolbar style={{
          '--background': '#2d6aab',
          '--padding-top': '8px', '--padding-bottom': '8px',
          '--padding-start': '2rem', '--padding-end': '2rem'
        }}>
          <div className="flex justify-between items-center w-full">

            {/* Logo + título */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-10 h-10 bg-[#7ac29a] flex items-center justify-center overflow-hidden rounded">
                <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '12px', color: '#fff', margin: '0 0 2px 0' }}>
                  Bienestar Animal
                </h2>
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '11px', color: '#fff', margin: 0 }}>
                  Municipalidad de Santo Domingo
                </p>
              </div>
            </div>

            {/* Perfil + logout */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                <img src="/assets/perfil-vicente.jpg" alt="Perfil" className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://ionicframework.com/docs/img/demos/avatar.svg' }} />
              </div>
              <div style={{ backgroundColor: '#94a3b8', padding: '6px 24px', borderRadius: '4px' }}>
                <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '13px', color: '#1e3a8a' }}>
                  V. Palma Lucero
                </span>
              </div>
              <IonButton onClick={handleLogout}
                style={{ '--background': '#000', '--color': '#fff', '--border-radius': '6px',
                  fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px',
                  textTransform: 'none', height: '36px', margin: 0 }}>
                Cerrar Sesión
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-white">
        <div className="flex h-full w-full">

          {/* ── SIDEBAR ── */}
          <div className="w-[260px] bg-[#255c99] shrink-0 flex flex-col h-full border-r border-gray-200 overflow-y-auto">
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
            <nav className="flex-1 py-6 flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                <div key={idx}
                  className={`flex items-center gap-4 px-8 py-3 cursor-pointer transition-colors ${item.active ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  <div className="w-3 h-3 bg-[#e2e8f0] rounded-full opacity-80" />
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: item.active ? 700 : 500, fontSize: '14px', color: '#fff' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* ── CONTENIDO PRINCIPAL ── */}
          <div className="flex-1 bg-white p-10 overflow-y-auto">
            <div className="max-w-[1000px]">

              {/* Título */}
              <div className="mb-8">
                <h1 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '28px', color: '#000', marginBottom: '8px' }}>
                  Dashboard — Mayo 2026
                </h1>
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '16px', color: '#9ca3af', margin: 0 }}>
                  Resumen de actividad de la unidad
                </p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-sm">
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
                ))}
              </div>

              {/* ── TABLA DE REPORTES ── */}
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                {/* Header del cuadro */}
                <div style={{ padding: '20px 24px', background: '#f0f0f0', borderBottom: '1px solid #d1d5db' }}>
                  <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '18px', color: '#374151', margin: 0 }}>
                    Reportes recientes
                  </h2>
                </div>

                {/* Tabla con overflow scroll horizontal */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f0f0f0', borderBottom: '1px solid #d1d5db' }}>
                      <tr>
                        {['ID', 'TIPO', 'SECTOR', 'FECHA', 'ESTADO', 'ACCIÓN'].map((col) => (
                          <th key={col} style={{
                            padding: '14px 24px',
                            textAlign: 'left',
                            fontFamily: "'Roboto Slab', serif",
                            fontWeight: 700,
                            fontSize: '12px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap'
                          }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportes.map((row, idx) => (
                        <tr key={idx} style={{
                          borderBottom: idx < reportes.length - 1 ? '1px solid #e5e7eb' : 'none',
                          background: '#fff'
                        }}>
                          {/* ID */}
                          <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap' }}>
                            {row.id}
                          </td>
                          {/* Tipo */}
                          <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563' }}>
                            {row.tipo}
                          </td>
                          {/* Sector */}
                          <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563' }}>
                            {row.sector}
                          </td>
                          {/* Fecha */}
                          <td style={{ padding: '16px 24px', fontFamily: "'Roboto Slab', serif", fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap' }}>
                            {row.fecha}
                          </td>
                          {/* Estado — badge nativo */}
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              display: 'inline-block',
                              backgroundColor: row.bgEstado,
                              color: row.colorEstado,
                              fontFamily: "'Roboto Slab', serif",
                              fontWeight: 700,
                              fontSize: '12px',
                              padding: '5px 16px',
                              borderRadius: '9999px',
                              minWidth: '90px',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              {row.estado}
                            </span>
                          </td>
                          {/* Acción — botón nativo */}
                          <td style={{ padding: '16px 24px' }}>
                            <button style={{
                              backgroundColor: row.accion === 'Atender' ? '#241b5c' : '#d7d8e2',
                              color: row.accion === 'Atender' ? '#ffffff' : '#111827',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 20px',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              fontSize: '13px',
                              cursor: 'pointer',
                              minWidth: '90px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                              transition: 'opacity 0.15s ease'
                            }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                              {row.accion}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Banner Inferior */}
              <div style={{
                marginTop: '32px',
                background: '#e0f2fe',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '14px', color: '#1e3a8a' }}>Próximo operativo</span>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>—</span>
                    <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>02 mayo 2026</span>
                  </div>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#475569', margin: 0 }}>
                    Vacunación antirrábica - Gimnasio Municipal - 09:00 - 14:00 hrs
                  </p>
                </div>
                <div style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '14px', color: '#60a5fa' }}>
                  V. Palma Lucero
                </div>
              </div>

            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default InspectorDashboard;