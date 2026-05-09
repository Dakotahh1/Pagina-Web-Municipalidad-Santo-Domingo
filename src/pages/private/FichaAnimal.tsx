import React from 'react';
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
import { useHistory, useParams } from 'react-router-dom';

const AdopcionDetalle: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  // Base de datos simulada }
  const baseDatosMascotas = [
    {
      id: 1,
      nombre: "Camaron",
      tipo: "Gatos",
      descripcionCorta: "Gato mestizo",
      edad: "3 años",
      sexo: "Macho",
      etiquetas: ["Vacunado", "Castrado"],
      chip: "ABCD-9999-0000-22222",
      imagenPrincipal: "/assets/camaron.jpg",
      miniaturas: ["/assets/gato2.jpg", "/assets/gato3.jpg"],
      infoDetallada: [
        { clave: "Especie", valor: "Gato" },
        { clave: "Raza", valor: "Naranjito" },
        { clave: "Sexo", valor: "Macho" },
        { clave: "Edad Estimada", valor: "3 años" },
        { clave: "Tamaño", valor: "Mediano" },
        { clave: "Color", valor: "Naranjo con blanco" },
        { clave: "Zona de Rescate", valor: "De casa" },
      ],
      historial: [
        { fecha: "15 enero 2025", evento: "Control veterinario rutinario. Estado general bueno. Sin novedades." },
        { fecha: "03 noviembre 2024", evento: "Operativo de esterilización – Sector norte. Castración realizada exitosamente." },
      ],
      notas: "Camaron es un gatito lindo que come mucho y no sabe cuando parar de comer.",
      inspector: "Vicente Palma"
    },
    {
      id: 2,
      nombre: "Kenai",
      tipo: "Perros",
      descripcionCorta: "Perro mestizo",
      edad: "3 años",
      sexo: "Macho",
      etiquetas: ["Vacunado", "Castrado"],
      chip: "KEN-8888-1111-33333",
      imagenPrincipal: "/assets/kenai.jpg",
      miniaturas: ["/assets/kenai_thumb1.jpg", "/assets/kenai_thumb2.jpg"],
      infoDetallada: [
        { clave: "Especie", valor: "Perro" },
        { clave: "Raza", valor: "Mestizo" },
        { clave: "Sexo", valor: "Macho" },
        { clave: "Edad Estimada", valor: "3 años" },
        { clave: "Tamaño", valor: "Grande" },
        { clave: "Color", valor: "Blanco" },
        { clave: "Zona de Rescate", valor: "Sector Centro" },
      ],
      historial: [
        { fecha: "10 enero 2025", evento: "Vacunación séxtuple aplicada." },
      ],
      notas: "Kenai es muy juguetón y requiere espacio para correr.",
      inspector: "Andrea Silva"
    },
    {
      id: 3,
      nombre: "Leonidas",
      tipo: "Perros",
      descripcionCorta: "Perro mestizo",
      edad: "3 años",
      sexo: "Macho",
      etiquetas: ["Vacunado", "Castrado"],
      chip: "LEO-7777-2222-44444",
      imagenPrincipal: "/assets/leonidas.jpg",
      miniaturas: ["/assets/leonidas_thumb1.jpg", "/assets/leonidas_thumb2.jpg"],
      infoDetallada: [
        { clave: "Especie", valor: "Perro" },
        { clave: "Raza", valor: "Mestizo" },
        { clave: "Sexo", valor: "Macho" },
        { clave: "Edad Estimada", valor: "3 años" },
        { clave: "Tamaño", valor: "Mediano" },
        { clave: "Color", valor: "Negro" },
        { clave: "Zona de Rescate", valor: "Sector Sur" },
      ],
      historial: [
        { fecha: "05 febrero 2025", evento: "Ingreso y revisión general." },
      ],
      notas: "Un perro muy leal y protector.",
      inspector: "Carlos Pérez"
    },
    // Añadir el resto de animales
  ];

  // Buscamos el animal por ID. Si alguien entra a una ruta que no existe, mostramos Camaron (1) por defecto para no romper la app.
  const mascotaId = id ? parseInt(id, 10) : 1;
  const mascota = baseDatosMascotas.find(m => m.id === mascotaId) || baseDatosMascotas[0];

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

      <IonContent fullscreen style={{ '--background': '#d1d5db' }}>
        <div style={{ backgroundColor: '#e5e7eb', padding: '12px 32px', borderBottom: '1px solid #9ca3af' }}>
          <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '12px', color: '#111827', margin: 0 }}>
            <span className="cursor-pointer hover:underline" onClick={() => history.push('/app/adopciones')}>Adopciones</span> &gt; {mascota.tipo} &gt; "{mascota.nombre}"
          </p>
        </div>

        <div className="p-8">
          <IonGrid className="ion-no-padding max-w-[1200px] mx-auto">
            <IonRow>
              {/* COLUMNA IZQUIERDA */}
              <IonCol size="12" sizeLg="5" className="p-3">
                <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                  <IonCardContent className="p-6">
                    <div className="w-full h-[240px] bg-gray-200 rounded-lg mb-6 overflow-hidden">
                      <img src={mascota.imagenPrincipal} alt={mascota.nombre} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>

                    <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', marginBottom: '8px', lineHeight: '1.2' }}>
                      "{mascota.nombre}"
                    </h1>
                    
                    <div className="flex gap-4 mb-4">
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#4b5563' }}>{mascota.descripcionCorta}</span>
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#4b5563' }}>{mascota.edad}</span>
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#4b5563' }}>{mascota.sexo}</span>
                    </div>

                    <div className="flex gap-2 mb-6">
                      {mascota.etiquetas.map((etiqueta, i) => (
                        <span key={i} style={{ backgroundColor: '#e5e7eb', color: '#374151', fontSize: '12px', padding: '6px 16px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                          {etiqueta}
                        </span>
                      ))}
                    </div>

                    <div style={{ backgroundColor: '#d1d5db', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#374151' }}>Chip Registrado:</span>
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#374151' }}>{mascota.chip}</span>
                    </div>

                    <IonButton expand="block" style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', marginBottom: '12px' }}>
                      Solicitar Adopción
                    </IonButton>
                    <IonButton expand="block" style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', marginBottom: '24px' }}>
                      Compartir Ficha
                    </IonButton>

                    <div className="flex gap-4">
                      {mascota.miniaturas.map((thumb, i) => (
                        <div key={i} className="w-[100px] h-[100px] bg-gray-200 rounded-lg overflow-hidden">
                           <img src={thumb} alt={`Miniatura ${i}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* COLUMNA DERECHA */}
              <IonCol size="12" sizeLg="7" className="p-3 flex flex-col gap-6">
                
                <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                  <IonCardContent className="p-8">
                    <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Información del Animal</h2>
                    <div className="flex flex-col gap-4">
                      {mascota.infoDetallada.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-3 last:border-0 last:pb-0">
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#6b7280' }}>{item.clave}</span>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#000000' }}>{item.valor}</span>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>

                <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                  <IonCardContent className="p-8">
                    <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>Historial Médico</h2>
                    <div className="flex flex-col gap-6">
                      {mascota.historial.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#4b5563' }}>{item.fecha}</span>
                          <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#111827', lineHeight: '1.5' }}>{item.evento}</span>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>

                <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                  <IonCardContent className="p-8">
                    <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '16px' }}>Notas</h2>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#374151', lineHeight: '1.5', marginBottom: '24px' }}>{mascota.notas}</p>
                    
                    <div className="flex items-center gap-3">
                      <div style={{ backgroundColor: '#d1d5db', padding: '6px 12px', borderRadius: '4px' }}>
                        <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#4b5563' }}>Foto</span>
                      </div>
                      <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 700, fontSize: '14px', color: '#000000' }}>
                        Inspector {mascota.inspector}
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>

              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdopcionDetalle;