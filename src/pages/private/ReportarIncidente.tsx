import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';
import ImageUploader from '../../components/ImageUploader';
import { crearReporte } from '../../services/reportesService';
import { ApiError } from '../../services/api';
import { useNotifications } from '../../context/useNotifications';
import { useLocalStorage } from '../../hooks/useLocalStorage';

/* Formulario para reportar un incidente de bienestar animal (EF1 — CRUD: Create).
   El vecino selecciona el tipo, ubica el incidente, lo describe y lo envía al backend
   (POST /api/reportes). Características:
   - Autoguardado del borrador en localStorage (sobrevive recargas o navegación).
   - Notificación al enviar (sistema de notificaciones global).
   - Validación visual de los campos obligatorios. */

// Mapea las etiquetas del formulario a los tipos canónicos que valida el backend.
const TIPO_MAP: Record<string, string> = {
  'Abandono de animal': 'Abandono',
  'Mordedura / Agresión': 'Mordedura',
  'Tenencia irresponsable': 'Tenencia irresponsable',
  'Animal herido / Enfermo': 'Animal herido',
  'Animal muerto en vía pública': 'Animal muerto',
  'Otro / Reclamo': 'Otro',
};

// Coordenadas aproximadas de Santo Domingo (no hay selector de mapa real en esta versión).
const COORD_SANTO_DOMINGO = { lat: -33.6437, lng: -71.6311 };

interface ReporteForm {
  tipoIncidente: string;
  direccion: string;
  sector: string;
  referencia: string;
  descripcion: string;
  urgente: boolean;
}

const DRAFT_INICIAL: ReporteForm = {
  tipoIncidente: 'Abandono de animal',
  direccion: '',
  sector: '',
  referencia: '',
  descripcion: '',
  urgente: false,
};

const ReportarIncidente: React.FC = () => {
  const { notify } = useNotifications();

  // Borrador del formulario persistido en localStorage (autoguardado).
  const [form, setForm] = useLocalStorage<ReporteForm>('bienestar.reporteDraft', DRAFT_INICIAL);
  const setField = <K extends keyof ReporteForm>(campo: K, valor: ReporteForm[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  // URL pública de la foto del incidente, ya alojada en Cloudinary (EF5).
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const [errores, setErrores] = useState<{ direccion?: string; descripcion?: string }>({});
  const [enviando, setEnviando] = useState(false);

  const tipos = [
    'Abandono de animal',
    'Mordedura / Agresión',
    'Tenencia irresponsable',
    'Animal herido / Enfermo',
    'Animal muerto en vía pública',
    'Otro / Reclamo',
  ];

  // Stepper dinámico según el avance real del formulario.
  const completos = {
    tipo: Boolean(form.tipoIncidente),
    ubic: Boolean(form.direccion.trim()),
    desc: Boolean(form.descripcion.trim()),
  };
  const pasoEstado = (hecho: boolean, activo: boolean) =>
    hecho
      ? { estado: 'Completado', bg: '#16a34a', color: '#ffffff' }
      : activo
        ? { estado: 'En proceso', bg: '#1e3aa4', color: '#ffffff' }
        : { estado: 'Pendiente', bg: '#e5e7eb', color: '#9ca3af' };
  const pasos = [
    { numero: 1, titulo: 'Tipo',        ...pasoEstado(completos.tipo, true) },
    { numero: 2, titulo: 'Ubicación',   ...pasoEstado(completos.ubic, completos.tipo) },
    { numero: 3, titulo: 'Descripción', ...pasoEstado(completos.desc, completos.ubic) },
    { numero: 4, titulo: 'Enviar',      ...pasoEstado(false, completos.desc) },
  ];

  const pasosProceso = [
    '1. Tu caso llega a la unidad',
    '2. Un inspector evalúa el caso',
    '3. Se asigna una intervención',
    '4. Recibes una notificación del resultado',
  ];

  // Valida y envía el reporte al backend.
  const handleEnviar = async () => {
    const nuevosErrores: { direccion?: string; descripcion?: string } = {};
    if (!form.direccion.trim()) nuevosErrores.direccion = 'la dirección es obligatoria para ubicar el incidente';
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'describe brevemente lo que observaste';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      notify('Faltan datos', 'Completa los campos obligatorios antes de enviar', 'error');
      return;
    }
    setErrores({});
    setEnviando(true);
    try {
      const sector = form.sector.trim() || form.direccion.trim();
      const descripcion =
        `${form.descripcion.trim()}` +
        (form.referencia.trim() ? ` (Referencia: ${form.referencia.trim()})` : '') +
        ` — Dirección: ${form.direccion.trim()}`;

      const reporte = await crearReporte({
        tipo: TIPO_MAP[form.tipoIncidente] ?? 'Otro',
        descripcion,
        ubicacion: { ...COORD_SANTO_DOMINGO, sector },
        urgente: form.urgente,
        fotos: fotoUrl ? [fotoUrl] : [],
      });

      notify('Reporte enviado', `Caso #${reporte.id} registrado. Un inspector lo revisará.`, 'success');

      // Limpia el borrador y resetea el formulario.
      setForm(DRAFT_INICIAL);
      setFotoUrl(null);
    } catch (err) {
      notify('No se pudo enviar', err instanceof ApiError ? err.message : 'Error de conexión con el servidor', 'error');
    } finally {
      setEnviando(false);
    }
  };

  // Estilos reutilizables.
  const card: React.CSSProperties = { background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '24px' };
  const labelStyle: React.CSSProperties = { fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
  const inputStyle: React.CSSProperties = { width: '100%', backgroundColor: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333', outline: 'none', boxSizing: 'border-box' };
  const serif = "'Roboto Slab', serif";

  return (
    <IonPage>

      <NavBar />

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>

        {/*hero que indica urgencia y acción cívica*/}
        <RevealWrapper>
          <div style={{ backgroundColor: '#fae8e8', padding: '32px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
              <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '30px', color: '#b01717', margin: '0 0 10px 0' }}>
                Reportar Incidente
              </h1>
              <p style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#8a6565', margin: 0 }}>
                Tu reporte llega directamente a la Unidad de Bienestar Animal de la Municipalidad de Santo Domingo.
                Respuesta en 24-48 hrs hábiles.
              </p>
            </div>
          </div>
        </RevealWrapper>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 48px' }}>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/*columna izquierda: stepper + tipo + ubicación + descripción + envío*/}
            <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/*stepper dinámico según el avance del formulario*/}
              <RevealWrapper>
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {pasos.map((paso) => (
                      <div key={paso.numero} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: paso.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: serif, fontWeight: 800, fontSize: '16px', color: paso.color }}>{paso.numero}</span>
                        </div>
                        <div>
                          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: '14px', color: '#111827', lineHeight: '1.2' }}>{paso.titulo}</div>
                          <div style={{ fontFamily: serif, fontWeight: 400, fontSize: '12px', color: '#6b7280' }}>{paso.estado}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealWrapper>

              {/*selector de tipo de incidente*/}
              <RevealWrapper delay={80}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                    Tipo de incidente
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {tipos.map((tipo, idx) => {
                      const sel = form.tipoIncidente === tipo;
                      return (
                        <button key={idx} onClick={() => setField('tipoIncidente', tipo)} style={{
                          backgroundColor: sel ? '#fdeceb' : '#ffffff',
                          border: sel ? '2px solid #f87171' : '1px solid #d1d5db',
                          borderRadius: '8px', padding: '18px 12px',
                          fontFamily: serif, fontWeight: 600, fontSize: '14px',
                          color: sel ? '#b01717' : '#4b5563',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                        }}>
                          {tipo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </RevealWrapper>

              {/*ubicación del incidente*/}
              <RevealWrapper delay={160}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                    Ubicación del incidente
                  </h2>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Dirección Aproximada *</label>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => { setField('direccion', e.target.value); if (errores.direccion) setErrores((x) => ({ ...x, direccion: undefined })); }}
                      style={{ ...inputStyle, borderColor: errores.direccion ? '#f87171' : '#d1d5db' }}
                    />
                    {errores.direccion && (
                      <p style={{ fontFamily: serif, fontSize: '11px', color: '#b01717', margin: '4px 0 0 0' }}>{errores.direccion}</p>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                    <div>
                      <label style={labelStyle}>Sector</label>
                      <input type="text" value={form.sector} onChange={(e) => setField('sector', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Referencia</label>
                      <input type="text" value={form.referencia} onChange={(e) => setField('referencia', e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  {/*subida real de la foto del incidente a Cloudinary (EF5).
                    La foto es opcional: si Cloudinary no está configurado, el
                    reporte se envía igualmente sin imagen.*/}
                  <div>
                    <label style={labelStyle}>Adjuntar imagen del incidente (opcional)</label>
                    <ImageUploader folder="reportes" label="Seleccionar imagen" onUploaded={setFotoUrl} />
                    {fotoUrl && (
                      <p style={{ fontFamily: serif, fontSize: '12px', color: '#16a34a', margin: '6px 0 0 0' }}>
                        ✓ Imagen adjuntada correctamente
                      </p>
                    )}
                  </div>
                </div>
              </RevealWrapper>

              {/*descripción del incidente (paso 3) + marca de urgencia*/}
              <RevealWrapper delay={200}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                    Descripción
                  </h2>
                  <label style={labelStyle}>¿Qué observaste? *</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => { setField('descripcion', e.target.value); if (errores.descripcion) setErrores((x) => ({ ...x, descripcion: undefined })); }}
                    rows={4}
                    maxLength={1000}
                    placeholder="Describe el incidente: cuántos animales, su estado, hace cuánto, etc."
                    style={{ ...inputStyle, resize: 'vertical', borderColor: errores.descripcion ? '#f87171' : '#d1d5db' }}
                  />
                  {errores.descripcion && (
                    <p style={{ fontFamily: serif, fontSize: '11px', color: '#b01717', margin: '4px 0 0 0' }}>{errores.descripcion}</p>
                  )}

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.urgente} onChange={(e) => setField('urgente', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#b01717' }} />
                    <span style={{ fontFamily: serif, fontWeight: 600, fontSize: '13px', color: '#b01717' }}>
                      Marcar como urgente (animal en peligro inminente)
                    </span>
                  </label>
                </div>
              </RevealWrapper>

              {/*botón de envío real*/}
              <RevealWrapper delay={240}>
                <button
                  onClick={handleEnviar}
                  disabled={enviando}
                  style={{
                    width: '100%', backgroundColor: '#b01717', color: '#ffffff',
                    border: 'none', borderRadius: '8px', padding: '16px',
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px',
                    cursor: enviando ? 'default' : 'pointer', opacity: enviando ? 0.7 : 1,
                    transition: 'opacity 0.15s ease', boxShadow: '0 4px 12px rgba(176,23,23,0.25)',
                  }}
                >
                  {enviando ? 'Enviando...' : 'Enviar Reporte'}
                </button>
                <p style={{ fontFamily: serif, fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                  al enviar aceptas que los datos serán usados por la municipalidad para gestionar el caso
                </p>
              </RevealWrapper>

            </div>

            {/*columna derecha: información de proceso y contacto*/}
            <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <RevealWrapper delay={100}>
                <div style={{ backgroundColor: '#fae8e8', border: '1px solid #f87171', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#b01717', margin: '0 0 14px 0' }}>
                    Tiempo de respuesta
                  </h2>
                  <div style={{ borderBottom: '1px solid #fca5a5', paddingBottom: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: serif, fontSize: '13px', color: '#7f5656' }}>Casos urgentes:</span>
                    <span style={{ fontFamily: serif, fontWeight: 700, fontSize: '13px', color: '#111827' }}>2-4 horas</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: serif, fontSize: '13px', color: '#7f5656' }}>Otros casos:</span>
                    <span style={{ fontFamily: serif, fontWeight: 700, fontSize: '13px', color: '#111827' }}>24-48 horas hábiles</span>
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={200}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#000', margin: '0 0 16px 0' }}>¿Qué pasa después?</h2>
                  {pasosProceso.map((texto, idx) => (
                    <div key={idx} style={{ padding: '10px 0', borderBottom: idx < pasosProceso.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <span style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#374151' }}>{texto}</span>
                    </div>
                  ))}
                </div>
              </RevealWrapper>

              <RevealWrapper delay={300}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#000', margin: '0 0 6px 0' }}>¿Emergencia inmediata?</h2>
                  <p style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#4b5563', margin: '0 0 18px 0' }}>
                    Si el animal está en peligro inminente, llámanos.
                  </p>
                  <button
                    style={{ width: '100%', backgroundColor: '#b01717', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(176,23,23,0.3)', transition: 'opacity 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Llamar ahora
                  </button>
                </div>
              </RevealWrapper>

            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default ReportarIncidente;
