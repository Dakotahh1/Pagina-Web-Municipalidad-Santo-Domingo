import React, { useState, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const ReportarIncidente: React.FC = () => {
  const history = useHistory();
  const [tipoIncidente, setTipoIncidente] = useState<string>('Abandono de animal');
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tipos = [
    'Abandono de animal',
    'Mordedura / Agresión',
    'Tenencia irresponsable',
    'Animal herido / Enfermo',
    'Animal muerto en vía pública',
    'Otro / Reclamo'
  ];

  const pasos = [
    { numero: 1, titulo: 'Tipo',        estado: 'Completado', bgCirculo: '#16a34a', colorTexto: '#ffffff' },
    { numero: 2, titulo: 'Ubicación',   estado: 'En proceso', bgCirculo: '#1e3aa4', colorTexto: '#ffffff' },
    { numero: 3, titulo: 'Descripción', estado: 'Pendiente',  bgCirculo: '#e5e7eb', colorTexto: '#9ca3af' },
    { numero: 4, titulo: 'Enviar',      estado: 'Pendiente',  bgCirculo: '#e5e7eb', colorTexto: '#9ca3af' }
  ];

  const pasosProceso = [
    '1. Tu caso llega a la unidad',
    '2. Un inspector evalúa el caso',
    '3. Se asigna una intervención',
    '4. Recibes una notificación del resultado'
  ];

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ─── Estilos reutilizables ───────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    padding: '24px'
  };

  const label: React.CSSProperties = {
    fontFamily: "'Roboto Slab', serif",
    fontWeight: 700,
    fontSize: '11px',
    color: '#4b5563',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px'
  };

  const input: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e5e7eb',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '10px 14px',
    fontFamily: "'Roboto Slab', serif",
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const serif = "'Roboto Slab', serif";

  return (
    <IonPage>
      {/* ── HEADER ── */}
      <IonHeader className="ion-no-border" style={{ borderBottom: '1px solid #205187' }}>
        <IonToolbar style={{
          '--background': '#2d6aab',
          '--padding-top': '10px', '--padding-bottom': '10px',
          '--padding-start': '2rem', '--padding-end': '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => history.push('/app/inicio')}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#7ac29a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/assets/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div>
                <div style={{ fontFamily: serif, fontWeight: 800, fontSize: '10px', color: '#fff', lineHeight: '1.3' }}>Bienestar Animal</div>
                <div style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#fff', lineHeight: '1.3' }}>Municipalidad de Santo Domingo</div>
              </div>
            </div>

            <button style={{
              backgroundColor: '#ffffff', color: '#2d6aab',
              border: 'none', borderRadius: '6px',
              padding: '8px 22px',
              fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px',
              cursor: 'pointer'
            }}>
              Mi cuenta
            </button>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#ffffff' }}>

        {/* ── HERO ── */}
        <div style={{ backgroundColor: '#fae8e8', padding: '32px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
            <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '30px', color: '#b01717', margin: '0 0 10px 0' }}>
              Reportar Incidente
            </h1>
            <p style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#8a6565', margin: 0 }}>
              Tu reporte llega directamente a la Unidad de Bienestar Animal de la Municipalidad de Santo Domingo. Respuesta en 24-48 hrs hábiles.
            </p>
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 48px' }}>
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

            {/* ══ COLUMNA IZQUIERDA ══ */}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* STEPPER */}
              <div style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  {pasos.map((paso) => (
                    <div key={paso.numero} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: paso.bgCirculo,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontFamily: serif, fontWeight: 800, fontSize: '16px', color: paso.colorTexto }}>
                          {paso.numero}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: '14px', color: '#111827', lineHeight: '1.2' }}>{paso.titulo}</div>
                        <div style={{ fontFamily: serif, fontWeight: 400, fontSize: '12px', color: '#6b7280' }}>{paso.estado}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPO DE INCIDENTE */}
              <div style={{ ...card }}>
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
                        borderRadius: '8px',
                        padding: '18px 12px',
                        fontFamily: serif,
                        fontWeight: 600,
                        fontSize: '14px',
                        color: sel ? '#b01717' : '#4b5563',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}>
                        {tipo}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UBICACIÓN DEL INCIDENTE */}
              <div style={{ ...card }}>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '16px', color: '#000', margin: '0 0 18px 0' }}>
                  Ubicación del incidente
                </h2>

                {/* Dirección */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={label}>Dirección Aproximada</label>
                  <input type="text" style={input} />
                </div>

                {/* Sector + Referencia */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                  <div>
                    <label style={label}>Sector</label>
                    <input type="text" style={input} />
                  </div>
                  <div>
                    <label style={label}>Referencia</label>
                    <input type="text" style={input} />
                  </div>
                </div>

                {/* Mapa placeholder */}
                <div style={{
                  width: '100%', height: '240px',
                  backgroundColor: '#e5e7eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundImage: 'url("/assets/mapa-placeholder.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '18px'
                }} />

                {/* ── ADJUNTAR IMAGEN ── */}
                <div>
                  <label style={label}>Adjuntar imagen del incidente</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#f9fafb',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#9ca3af')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
                  >
                    {imagenPreview ? (
                      <img
                        src={imagenPreview}
                        alt="Vista previa"
                        style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
                        <p style={{ fontFamily: serif, fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                          Haz clic para seleccionar una imagen
                        </p>
                        <p style={{ fontFamily: serif, fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                          PNG, JPG o WEBP · Máx. 10 MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    style={{ display: 'none' }}
                  />
                  {imagenPreview && (
                    <button
                      onClick={() => { setImagenPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      style={{
                        marginTop: '8px', background: 'none', border: 'none',
                        fontFamily: serif, fontSize: '12px', color: '#b01717',
                        cursor: 'pointer', padding: 0
                      }}
                    >
                      Eliminar imagen
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* ══ COLUMNA DERECHA ══ */}
            <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Tiempo de respuesta */}
              <div style={{
                backgroundColor: '#fae8e8',
                border: '1px solid #f87171',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }}>
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

              {/* ¿Qué pasa después? */}
              <div style={{ ...card }}>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#000', margin: '0 0 16px 0' }}>
                  ¿Qué pasa después?
                </h2>
                {pasosProceso.map((texto, idx) => (
                  <div key={idx} style={{
                    padding: '10px 0',
                    borderBottom: idx < pasosProceso.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <span style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#374151' }}>
                      {texto}
                    </span>
                  </div>
                ))}
              </div>

              {/* Emergencia */}
              <div style={{ ...card }}>
                <h2 style={{ fontFamily: serif, fontWeight: 700, fontSize: '15px', color: '#000', margin: '0 0 6px 0' }}>
                  ¿Emergencia inmediata?
                </h2>
                <p style={{ fontFamily: serif, fontWeight: 500, fontSize: '13px', color: '#4b5563', margin: '0 0 18px 0' }}>
                  Si el animal está en peligro inminente, llámanos.
                </p>
                <button style={{
                  width: '100%',
                  backgroundColor: '#b01717',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(176,23,23,0.3)',
                  transition: 'opacity 0.15s ease'
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Llamar ahora
                </button>
              </div>

            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default ReportarIncidente;