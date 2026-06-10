import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';
import { getPublicaciones, crearPublicacion, getOperativos, ApiError, type Publicacion } from '../../services';
import { useNotifications } from '../../context/useNotifications';

/* Foro vecinal (EF1 — integración real).
   El feed se carga desde GET /api/foro (PostgreSQL) y las publicaciones nuevas se
   crean con POST /api/foro a nombre del usuario en sesión (el backend sanitiza el
   texto). Las categorías del sidebar se calculan con los datos reales del feed. */

// Estilo visual de la etiqueta según la categoría persistida en la BD.
const ETIQUETAS: Record<string, { label: string; bg: string; color: string }> = {
  Abandono: { label: 'Abandono', bg: 'rgba(255, 186, 186, 0.5)', color: '#991b1b' },
  Adopcion: { label: 'Adopción', bg: 'rgba(72, 255, 63, 0.31)', color: '#15803d' },
  Consulta: { label: 'Consulta', bg: 'rgba(215, 215, 215, 0.5)', color: '#374151' },
  Reclamo: { label: 'Reclamo', bg: 'rgba(255, 208, 0, 0.31)', color: '#854d0e' },
  General: { label: 'General', bg: 'rgba(186, 231, 255, 0.5)', color: '#0369a1' },
};

const CATEGORIAS_PUBLICAR = ['General', 'Abandono', 'Adopcion', 'Consulta', 'Reclamo'];

// Convierte la fecha de publicación en un texto relativo legible.
const tiempoRelativo = (iso: string): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const minutos = Math.floor(ms / 60000);
  if (minutos < 1) return 'Recién publicado';
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Foro: React.FC = () => {
  const history = useHistory();
  const { notify } = useNotifications();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  // Formulario de nueva publicación.
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [inputError, setInputError] = useState('');
  const [publicando, setPublicando] = useState(false);

  // Próximos operativos del sidebar (datos reales).
  const [proximosOperativos, setProximosOperativos] = useState<{ fecha: string; titulo: string }[]>([]);

  // Carga el feed y los operativos del sidebar al montar.
  useEffect(() => {
    let activo = true;
    getPublicaciones()
      .then((data) => { if (activo) setPublicaciones(data); })
      .catch((err) => {
        if (activo) setErrorCarga(err instanceof ApiError ? err.message : 'No se pudo cargar el foro.');
      })
      .finally(() => { if (activo) setCargando(false); });

    getOperativos()
      .then((ops) => {
        if (!activo) return;
        setProximosOperativos(
          ops
            .filter((o) => o.estado === 'Programado')
            .slice(0, 3)
            .map((o) => ({
              fecha: new Date(o.fecha_evento).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }),
              titulo: o.titulo,
            })),
        );
      })
      .catch(() => { /* el sidebar de operativos es secundario; se omite si falla */ });

    return () => { activo = false; };
  }, []);

  /* Valida y publica contra el backend; la publicación creada se antepone al feed. */
  const handlePublicar = async () => {
    if (titulo.trim().length < 5) {
      setInputError('el título es muy corto, escribe al menos 5 caracteres');
      return;
    }
    if (contenido.trim().length < 10) {
      setInputError('el contenido es muy corto, escribe al menos 10 caracteres antes de publicar');
      return;
    }
    setInputError('');
    setPublicando(true);
    try {
      const post = await crearPublicacion(titulo.trim(), contenido.trim(), categoria);
      setPublicaciones((prev) => [post, ...prev]);
      setTitulo('');
      setContenido('');
      setCategoria('General');
      notify('Publicación creada', 'Tu mensaje ya está visible en el foro vecinal', 'success');
    } catch (err) {
      notify('No se pudo publicar', err instanceof ApiError ? err.message : 'Error de conexión', 'error');
    } finally {
      setPublicando(false);
    }
  };

  // Categorías del sidebar con conteo real por tipo.
  const categoriasSidebar = CATEGORIAS_PUBLICAR.map((cat) => ({
    nombre: ETIQUETAS[cat].label,
    cantidad: publicaciones.filter((p) => p.categoria === cat).length,
    bg: ETIQUETAS[cat].bg,
    color: ETIQUETAS[cat].color,
  }));

  const esOficial = (post: Publicacion) =>
    post.usuario?.rol?.nombre === 'funcionario' || post.usuario?.rol?.nombre === 'inspector';

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#f8fafc' }}>

        {/*encabezado de la sección*/}
        <div style={{ backgroundColor: '#eef6fc', padding: '48px 32px' }}>
          <RevealWrapper>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
              <span className="font-slab font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
                Comunidad
              </span>
              <h1 className="font-slab font-bold text-4xl text-gray-800 mb-2">
                Foro Vecinal — Bienestar Animal
              </h1>
              <p className="font-slab text-[15px] text-gray-500 m-0">
                Reporta abandonos, coordina adopciones y comunícate con la municipalidad.
              </p>
            </div>
          </RevealWrapper>
        </div>

        <div className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">

                {/*columna principal: formulario de publicación + feed real*/}
                <IonCol size="12" sizeLg="7" sizeXl="8" className="pr-0 lg:pr-8">

                  {/*tarjeta para crear una publicación (POST /api/foro)*/}
                  <RevealWrapper>
                    <IonCard className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <div className="flex gap-4 items-start mb-4">

                          {/*avatar genérico del usuario en sesión*/}
                          <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />

                          <div className="w-full flex flex-col gap-3">
                            <input
                              type="text"
                              value={titulo}
                              onChange={e => { setTitulo(e.target.value); if (inputError) setInputError(''); }}
                              placeholder="Título de tu publicación"
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 outline-none
                                         focus:border-blue-400 transition-colors duration-150"
                              style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333' }}
                            />
                            <textarea
                              value={contenido}
                              onChange={e => { setContenido(e.target.value); if (inputError) setInputError(''); }}
                              placeholder="¿Qué quieres compartir con la comunidad?"
                              rows={3}
                              maxLength={2000}
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 outline-none
                                         focus:border-blue-400 transition-colors duration-150"
                              style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333', resize: 'vertical' }}
                            />

                            {/*selector de categoría de la publicación*/}
                            <div className="flex flex-wrap gap-2">
                              {CATEGORIAS_PUBLICAR.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => setCategoria(cat)}
                                  style={{
                                    backgroundColor: categoria === cat ? ETIQUETAS[cat].bg : '#f3f4f6',
                                    color: categoria === cat ? ETIQUETAS[cat].color : '#6b7280',
                                    border: categoria === cat ? '1px solid currentColor' : '1px solid #e5e7eb',
                                    padding: '4px 14px', borderRadius: '16px', cursor: 'pointer',
                                    fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '12px',
                                  }}
                                >
                                  {ETIQUETAS[cat].label}
                                </button>
                              ))}
                            </div>

                            {/*mensaje de validación del formulario*/}
                            {inputError && (
                              <p className="font-slab text-xs text-red-600 m-0">{inputError}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end items-center">
                          {/*botón de publicar — envía al backend*/}
                          <IonButton
                            onClick={handlePublicar}
                            disabled={publicando}
                            style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '38px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '14px', textTransform: 'none', margin: 0 }}
                          >
                            {publicando ? 'Publicando...' : 'Publicar'}
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*estados de carga y error del feed*/}
                  {cargando && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
                      <p className="font-slab text-sm text-gray-500 m-0">Cargando publicaciones...</p>
                    </div>
                  )}
                  {!cargando && errorCarga && (
                    <p className="font-slab text-sm text-red-600 text-center py-12">{errorCarga}</p>
                  )}
                  {!cargando && !errorCarga && publicaciones.length === 0 && (
                    <p className="font-slab text-sm text-gray-500 text-center py-12">Aún no hay publicaciones. ¡Sé el primero en escribir!</p>
                  )}

                  {/*feed real de publicaciones, de más reciente a más antigua*/}
                  {!cargando && !errorCarga && publicaciones.map((post, idx) => {
                    const etiqueta = esOficial(post)
                      ? { label: 'Oficial', bg: 'rgba(186, 231, 255, 0.5)', color: '#0369a1' }
                      : ETIQUETAS[post.categoria] ?? ETIQUETAS.General;
                    return (
                    <RevealWrapper key={post.id} delay={Math.min(idx, 4) * 100}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '8px' }}
                      >
                        <IonCardContent className="p-6">

                          {/*cabecera: autor, tiempo relativo y etiqueta de categoría*/}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                              <div>
                                <h3 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '16px', color: '#000000', margin: '0 0 2px 0' }}>
                                  {post.usuario?.nombre_completo ?? 'Vecino/a'}
                                </h3>
                                <p style={{ fontFamily: 'Roboto Slab', fontWeight: 400, fontSize: '12px', color: '#64748b', margin: 0 }}>
                                  {tiempoRelativo(post.fecha_publicacion)}
                                </p>
                              </div>
                            </div>

                            <div style={{ backgroundColor: etiqueta.bg, padding: '4px 16px', borderRadius: '16px' }}>
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '12px', color: etiqueta.color }}>
                                {etiqueta.label}
                              </span>
                            </div>
                          </div>

                          <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '12px', lineHeight: '1.3' }}>
                            {post.titulo}
                          </h2>
                          <p style={{ fontFamily: 'Roboto Slab', fontWeight: 400, fontSize: '14px', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                            {post.contenido}
                          </p>

                          {/*pie: en publicaciones de abandono se ofrece el flujo formal de reporte*/}
                          {post.categoria === 'Abandono' && !esOficial(post) && (
                            <div className="flex justify-end items-center mt-2 border-t border-gray-100 pt-4">
                              <div className="flex flex-col items-end gap-1">
                                <IonButton
                                  onClick={() => history.push('/app/reportar')}
                                  style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '32px', fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}
                                >
                                  Reportar a la municipalidad
                                </IonButton>
                                <p className="font-slab text-[11px] text-red-600 m-0 text-right">
                                  abre el formulario oficial de reportes
                                </p>
                              </div>
                            </div>
                          )}

                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                    );
                  })}

                </IonCol>

                {/*barra lateral: categorías reales, línea directa y próximos operativos*/}
                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">

                  {/*categorías con conteo real de publicaciones por tipo*/}
                  <RevealWrapper delay={150}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                          Categorías
                        </h2>
                        <div className="flex flex-col">
                          {categoriasSidebar.map((cat, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 rounded px-1">
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '14px', color: '#475569' }}>
                                {cat.nombre}
                              </span>
                              <div style={{ backgroundColor: cat.bg, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '12px', color: cat.color }}>
                                  {cat.cantidad}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*contacto directo con la municipalidad*/}
                  <RevealWrapper delay={250}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '8px' }}>
                          Línea Directa
                        </h2>
                        <p style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
                          ¿Situación urgente? Contáctanos directamente.
                        </p>
                        <div className="flex flex-col gap-3">
                          <IonButton expand="block" style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '44px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                            Llamar ahora
                          </IonButton>
                          <IonButton expand="block" fill="outline" style={{ '--border-radius': '6px', '--border-color': '#94a3b8', '--border-width': '2px', '--color': '#334155', height: '44px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                            WhatsApp Municipalidad
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*próximos operativos desde la API*/}
                  <RevealWrapper delay={350}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                          Próximos operativos
                        </h2>
                        {proximosOperativos.length === 0 ? (
                          <p className="font-slab text-sm text-gray-500 m-0">No hay operativos programados.</p>
                        ) : (
                        <div className="flex flex-col">
                          {proximosOperativos.map((op, index) => (
                            <div key={index} className="flex gap-4 items-center py-3 border-b border-gray-100 last:border-0">
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '14px', color: '#64748b', minWidth: '55px' }}>
                                {op.fecha}
                              </span>
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                                — {op.titulo}
                              </span>
                            </div>
                          ))}
                        </div>
                        )}
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Foro;
