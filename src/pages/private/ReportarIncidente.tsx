import React, { useState, useRef } from 'react';
import {
  IonPage, IonContent,
  IonHeader, IonToolbar, IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*formulario para reportar un incidente de bienestar animal.
  permite al vecino seleccionar el tipo de incidente, ingresar la ubicación,
  adjuntar una foto y enviar el reporte a la unidad municipal.

  el reporte llega directamente a los inspectores: tiempo de respuesta 24-48 hrs hábiles,
  2-4 hrs para casos urgentes.

  estructura:
    - navbar institucional
    - hero rojo con título y descripción del proceso
    - columna izquierda: stepper de pasos + tipo de incidente + ubicación + foto
    - columna derecha: tiempo de respuesta + qué pasa después + emergencia*/

const ReportarIncidente: React.FC = () => {
  const history = useHistory();

  //tipo de incidente seleccionado (requerido para enviar)
  const [tipoIncidente, setTipoIncidente] = useState<string>('Abandono de animal');

  //campos del formulario de ubicación
  const [direccion,  setDireccion]  = useState('');
  const [sector,     setSector]     = useState('');
  const [referencia, setReferencia] = useState('');

  //imagen adjunta del incidente
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //toast de confirmación al enviar
  const [showToast, setShowToast] = useState(false);
  const [toastMsg,  setToastMsg]  = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  //errores de validación del formulario
  const [errores, setErrores] = useState<{ direccion?: string }>({});

  const mostrarToast = (msg: string, color: 'success' | 'danger' = 'success') => {
    setToastMsg(msg); setToastColor(color); setShowToast(true);
  };

  /*tipos de incidente disponibles. cada uno tiene su propia selección visual
    con fondo rosado y borde rojo cuando está activo*/
  const tipos = [
    'Abandono de animal',
    'Mordedura / Agresión',
    'Tenencia irresponsable',
    'Animal herido / Enfermo',
    'Animal muerto en vía pública',
    'Otro / Reclamo'
  ];

  /*stepper visual de los 4 pasos del formulario. está hardcodeado en estado fijo por ahora —
    TODO: hacerlo dinámico según qué campos están completos*/
  const pasos = [
    { numero: 1, titulo: 'Tipo',        estado: 'Completado', bgCirculo: '#16a34a', colorTexto: '#ffffff' },
    { numero: 2, titulo: 'Ubicación',   estado: 'En proceso', bgCirculo: '#1e3aa4', colorTexto: '#ffffff' },
    { numero: 3, titulo: 'Descripción', estado: 'Pendiente',  bgCirculo: '#e5e7eb', colorTexto: '#9ca3af' },
    { numero: 4, titulo: 'Enviar',      estado: 'Pendiente',  bgCirculo: '#e5e7eb', colorTexto: '#9ca3af' },
  ];

  //descripción del proceso interno luego de enviar el reporte
  const pasosProceso = [
    '1. Tu caso llega a la unidad',
    '2. Un inspector evalúa el caso',
    '3. Se asigna una intervención',
    '4. Recibes una notificación del resultado'
  ];

  //maneja la selección de imagen: lee el archivo y genera un preview base64
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  //valida el formulario y envía el reporte si todo está correcto
  const handleEnviar = () => {
    const nuevosErrores: { direccion?: string } = {};
    if (!direccion.trim()) {
      nuevosErrores.direccion = 'la dirección es obligatoria para ubicar el incidente';
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      mostrarToast('completa los campos obligatorios antes de enviar', 'danger');
      return;
    }
    setErrores({});
    //aquí iría la llamada real a la api
    mostrarToast('tu reporte fue enviado. un inspector lo revisará en 24-48 hrs hábiles');
  };

  //estilos reutilizables para el formulario
  const card: React.CSSProperties = { background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: '24px' };
  const labelStyle: React.CSSProperties = { fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '11px', color: '#4b5563', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
  const inputStyle: React.CSSProperties = { width: '100%', backgroundColor: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 14px', fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333', outline: 'none', boxSizing: 'border-box' };
  const serif = "'Roboto Slab', serif";

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>

        {/*hero con fondo rosado-rojo que indica urgencia y acción cívica*/}
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

        {/*contenido principal en dos columnas*/}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 48px' }}>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

            {/*columna izquierda: stepper + tipo + ubicación + foto + envío*/}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/*stepper visual que indica en qué paso del formulario está el vecino*/}
              <RevealWrapper>
                <div style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {pasos.map(paso => (
                      <div key={paso.numero} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: paso.bgCirculo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: serif, fontWeight: 800, fontSize: '16px', color: paso.colorTexto }}>{paso.numero}</span>
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

              {/*selector de tipo de incidente. muestra opciones en grid 2x3 con estado visual activo*/}
              <RevealWrapper delay={80}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                    Tipo de incidente
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {tipos.map((tipo, idx) => {
                      const sel = tipoIncidente === tipo;
                      return (
                        <button key={idx} onClick={() => setTipoIncidente(tipo)} style={{
                          backgroundColor: sel ? '#fdeceb' : '#ffffff',
                          border: sel ? '2px solid #f87171' : '1px solid #d1d5db',
                          borderRadius: '8px', padding: '18px 12px',
                          fontFamily: serif, fontWeight: 600, fontSize: '14px',
                          color: sel ? '#b01717' : '#4b5563',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}>
                          {tipo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </RevealWrapper>

              {/*formulario de ubicación del incidente con dirección, sector, referencia y mapa*/}
              <RevealWrapper delay={160}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                    Ubicación del incidente
                  </h2>

                  {/*dirección-campo obligatorio, muestra error si está vacío al enviar*/}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>Dirección Aproximada *</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={e => { setDireccion(e.target.value); if (errores.direccion) setErrores({}); }}
                      style={{ ...inputStyle, borderColor: errores.direccion ? '#f87171' : '#d1d5db' }}
                    />
                    {errores.direccion && (
                      <p style={{ fontFamily: serif, fontSize: '11px', color: '#b01717', margin: '4px 0 0 0' }}>
                        {errores.direccion}
                      </p>
                    )}
                  </div>

                  {/*sector y referencia en grid de dos columnas*/}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                    <div>
                      <label style={labelStyle}>Sector</label>
                      <input type="text" value={sector} onChange={e => setSector(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Referencia</label>
                      <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  {/*mapa placeholder. reemplazar la url vacía con la ruta real del mapa*/}
                  <div style={{ width: '100%', height: '240px', backgroundColor: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundImage: 'url("/assets/mapa-placeholder.png")', backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '18px' }} />

                  {/*zona de carga de imagen del incidente; permite preview antes de enviar*/}
                  <div>
                    <label style={labelStyle}>Adjuntar imagen del incidente</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb', transition: 'border-color 0.15s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                    >
                      {imagenPreview ? (
                        <img src={imagenPreview} alt="Vista previa" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px', objectFit: 'contain' }} />
                      ) : (
                        <div>
                          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
                          <p style={{ fontFamily: serif, fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Haz clic para seleccionar una imagen</p>
                          <p style={{ fontFamily: serif, fontSize: '11px', color: '#9ca3af', margin: 0 }}>PNG, JPG o WEBP · Máx. 10 MB</p>
                        </div>
                      )}
                    </div>

                    {/*input de archivo oculto, se activa con el click del área de carga*/}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagenChange} style={{ display: 'none' }} />

                    {/*botón para eliminar la imagen si el vecino quiere cambiarla*/}
                    {imagenPreview && (
                      <button
                        onClick={() => { setImagenPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        style={{ marginTop: '8px', background: 'none', border: 'none', fontFamily: serif, fontSize: '12px', color: '#b01717', cursor: 'pointer', padding: 0 }}
                      >
                        Eliminar imagen
                      </button>
                    )}
                  </div>
                </div>
              </RevealWrapper>

              {/*botón final de envío del reporte; valida el formulario antes de procesar*/}
              <RevealWrapper delay={240}>
                <button
                  onClick={handleEnviar}
                  style={{
                    width: '100%', backgroundColor: '#b01717', color: '#ffffff',
                    border: 'none', borderRadius: '8px', padding: '16px',
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px',
                    cursor: 'pointer', transition: 'opacity 0.15s ease',
                    boxShadow: '0 4px 12px rgba(176,23,23,0.25)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Enviar Reporte
                </button>
                <p style={{ fontFamily: serif, fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                  al enviar aceptas que los datos serán usados por la municipalidad para gestionar el caso
                </p>
              </RevealWrapper>

            </div>

            {/*columna derecha: información de proceso y contacto de emergencia*/}
            <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/*tiempos de respuesta según urgencia del caso*/}
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

              {/*descripción del flujo interno de atención del reporte*/}
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

              {/*contacto directo para emergencias que no pueden esperar*/}
              <RevealWrapper delay={300}>
                <div style={card}>
                  <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#000', margin: '0 0 6px 0' }}>¿Emergencia inmediata?</h2>
                  <p style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#4b5563', margin: '0 0 18px 0' }}>
                    Si el animal está en peligro inminente, llámanos.
                  </p>
                  <button
                    style={{ width: '100%', backgroundColor: '#b01717', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(176,23,23,0.3)', transition: 'opacity 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Llamar ahora
                  </button>
                </div>
              </RevealWrapper>

            </div>
          </div>
        </div>

        {/*toast de confirmación o error al enviar el reporte*/}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={4000}
          position="bottom"
          color={toastColor}
        />

      </IonContent>
    </IonPage>
  );
};

export default ReportarIncidente;
