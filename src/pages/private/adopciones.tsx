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

const Adopciones: React.FC = () => {
  const history = useHistory();
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');

  const animales = [
    { 
      id: 1, 
      nombre: "Camaron", 
      detalles: "Gato mestizo   3 años   Macho", 
      etiquetas: ["Vacunado", "Castrado"], 
      imagen: "/assets/camaron.jpg", 
      bordeAzul: false
    },
    { 
      id: 2, 
      nombre: "Kenai", 
      detalles: "Perro mestizo   3 años   Macho", 
      etiquetas: ["Vacunado", "Castrado"], 
      imagen: "/assets/kenai.jpg", 
      bordeAzul: false
    },
    { 
      id: 3, 
      nombre: "Leonidas", 
      detalles: "Perro mestizo   3 años   Macho", 
      etiquetas: ["Vacunado", "Castrado"], 
      imagen: "/assets/leonidas.jpg", 
      bordeAzul: true 
    },
    { 
      id: 4, 
      nombre: "Yuumi", 
      detalles: "Gata Tuxedo / 3 Meses / Hembra", 
      etiquetas: ["Vacunado"], 
      imagen: "/assets/yuumi.jpg", 
      bordeAzul: false
    },
    { 
      id: 5, 
      nombre: "Pana Miguel", 
      detalles: "Gato mestizo / 3 años / Macho", 
      etiquetas: ["Vacunado", "Castrado"], 
      imagen: "/assets/panamiguel.jpg", 
      bordeAzul: false
    },
    { 
      id: 6, 
      nombre: "Meperdonas", 
      detalles: "Gato mestizo   3 años   Macho", 
      etiquetas: ["Vacunado", "Castrado"], 
      imagen: "/assets/meperdonas.jpg", 
      bordeAzul: false
    }
  ];

  const filtros = [
    { label: "Todos", count: 42 },
    { label: "Perros", count: 28 },
    { label: "Gatos", count: 14 },
    { label: "Pequeño", count: null },
    { label: "Adulto", count: null },
    { label: "Urgente", count: null },
  ];

  const navButtonStyle = {
    '--background': '#ffffff',
    '--color': '#000000',
    '--border-radius': '6px',
    '--box-shadow': '0 2px 4px rgba(0,0,0,0.05)',
    '--border-color': '#e5e7eb',
    '--border-style': 'solid',
    '--border-width': '1px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    textTransform: 'none' as const,
    margin: '0 4px',
    height: '42px'
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    '--background': '#000000',
    '--color': '#ffffff',
    '--border-color': '#000000',
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border shadow-none border-b border-gray-300">
        <IonToolbar style={{ '--background': '#ffffff', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
          <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">
            <div className="flex items-center gap-4 shrink-0 cursor-pointer" onClick={() => history.push('/app/inicio')}>
              <div className="w-12 h-12 bg-[#7ac29a] flex items-center justify-center overflow-hidden rounded">
                <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: '16px', color: '#000000', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
                <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: '14px', color: '#000000', margin: 0 }}>Municipalidad de Santo Domingo</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center">
              <IonButton fill="solid" routerLink="/app/inicio" style={navButtonStyle}>Inicio</IonButton>
              <IonButton fill="solid" style={navButtonStyle}>Mapa</IonButton>
              <IonButton fill="solid" routerLink="/app/adopciones" style={activeNavButtonStyle}>Adopciones</IonButton>
              <IonButton fill="solid" routerLink="/app/foro" style={navButtonStyle}>Foro</IonButton>
              <IonButton fill="solid" routerLink="/app/operativos" style={navButtonStyle}>Operativos</IonButton>
            </div>

            <div className="flex items-center gap-3">
              <IonButton style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}>
                Mi Cuenta
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#dcdfe4' }}>
        <div className="px-8 md:px-16 lg:px-24 pt-12 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Adopción Responsable</span>
            <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', marginBottom: '8px' }}>Encuentra a tu compañero ideal</h1>
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Todos los animales están vacunados, desparasitados y con chip integrado</p>

            <div className="flex flex-wrap gap-3">
              {filtros.map((filtro, idx) => {
                const isActive = filtroActivo === filtro.label;
                const texto = filtro.count !== null ? `${filtro.label} (${filtro.count})` : filtro.label;
                return (
                  <button key={idx} onClick={() => setFiltroActivo(filtro.label)} style={{ backgroundColor: isActive ? '#e5e7eb' : '#f3f4f6', border: isActive ? '1px solid #9ca3af' : '1px solid #d1d5db', color: '#000000', padding: '8px 20px', borderRadius: '24px', fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s ease-in-out' }}>{texto}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-400 opacity-30 mb-8"></div>

        <div className="px-8 md:px-16 lg:px-24 pb-16">
          <div className="max-w-[1400px] mx-auto">
            <IonGrid className="ion-no-padding">
              <IonRow>
                {animales.map((animal) => {
                  const tieneImagen = animal.imagen !== null;
                  const textColor = tieneImagen ? '#ffffff' : '#000000';
                  const tagBg = tieneImagen ? 'rgba(255,255,255,0.8)' : '#e5e7eb';
                  const tagText = tieneImagen ? '#000000' : '#4b5563';
                  const borderStyle = animal.bordeAzul ? '2px solid #3b82f6' : 'none';

                  return (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={animal.id} className="p-3">
                      <IonCard 
                        className="m-0 shadow-md relative overflow-hidden h-[320px] flex flex-col justify-end"
                        style={{ 
                          '--background': tieneImagen ? 'transparent' : '#ffffff', 
                          '--border-radius': '12px',
                          border: borderStyle,
                          backgroundImage: tieneImagen ? `url(${animal.imagen})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {tieneImagen && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0"></div>
                        )}

                        <IonCardContent className="p-6 relative z-10 w-full">
                          <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '20px', color: textColor, marginBottom: '4px' }}>"{animal.nombre}"</h3>
                          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: tieneImagen ? '#e5e7eb' : '#6b7280', marginBottom: '12px' }}>{animal.detalles}</p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {animal.etiquetas.map((etiqueta, i) => (
                              <span key={i} style={{ backgroundColor: tagBg, color: tagText, fontSize: '11px', padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>{etiqueta}</span>
                            ))}
                          </div>

                          <div className="flex gap-3 mt-auto">
                            <IonButton 
                              routerLink={`/app/adopciones/${animal.id}`} 
                              className="m-0 flex-1" 
                              style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '38px', '--box-shadow': 'none', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', textTransform: 'none' }}
                            >
                              Ver Ficha
                            </IonButton>
                            <IonButton 
                              className="m-0 flex-1" 
                              style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '38px', '--box-shadow': 'none', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', textTransform: 'none' }}
                            >
                              Adoptar
                            </IonButton>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-400 opacity-30 mt-8 mb-6"></div>
        <div className="px-8 md:px-16 lg:px-24 pb-8">
          <div className="max-w-[1400px] mx-auto text-left">
            <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#4b5563', margin: 0 }}>© 2026 Municipalidad de Santo Domingo — Comuna Parque</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Adopciones;