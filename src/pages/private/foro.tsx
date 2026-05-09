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
import { useHistory } from 'react-router-dom';

const Foro: React.FC = () => {
  const history = useHistory();

  // Datos inventados para nuestro foro
  const publicaciones = [
    {
      id: 1,
      autor: "María González",
      tiempo: "Hace 2 horas",
      ubicacion: "Sector La Parroquia",
      etiqueta: "Abandono",
      colorFondoEtiqueta: "rgba(255, 186, 186, 0.5)", // FFBABA 50%
      colorTextoEtiqueta: "#991b1b",
      titulo: "Perro abandonado frente a la plaza, lleva 3 días en la calle",
      contenido: "Vi esta mañana un perro mediano, color café, que lleva varios días en la plaza de la parroquia en el centro. Parece manso y tiene collar pero sin placa. ¿Alguien sabe si ya fue reportado a la muni?",
      adjunto: "1 Fotografía adjunta - Sector la parroquia",
      likes: 14,
      respuestas: 8,
      mostrarBotonReportar: true
    },
    {
      id: 2,
      autor: "Municipalidad de Santo Domingo",
      tiempo: "Ayer 18:36 hrs",
      ubicacion: "Comunicado oficial",
      etiqueta: "Oficial",
      colorFondoEtiqueta: "rgba(186, 231, 255, 0.5)", // BAE7FF 50%
      colorTextoEtiqueta: "#0369a1",
      titulo: "Operativo de vacunación antirrábica — Sector Norte, 23 de mayo",
      contenido: "Informamos a la comunidad que el sábado 23 de mayo se realizará un operativo gratuito de vacunación antirrábica en el Gimnasio Municipal. Nuestro personal se encontrará de 09:00 a 14:00 hrs. Por favor traer a sus mascotas con correa o transporte.",
      adjunto: null,
      likes: 42,
      respuestas: 5,
      mostrarBotonReportar: false
    },
    {
      id: 3,
      autor: "Ariel Villar",
      tiempo: "Hace 2 días",
      ubicacion: "Sector Huerto las Parcelas",
      etiqueta: "Adopción",
      colorFondoEtiqueta: "rgba(72, 255, 63, 0.31)", // 48FF3F 31%
      colorTextoEtiqueta: "#15803d",
      titulo: "Busco hogar temporal para gatita rescatada",
      contenido: "Encontré una gatita de aproximadamente 2 meses cerca de las parcelas. Lamentablemente no puedo quedármela porque mis perros no la aceptan. ¿Alguien tiene un espacio temporal mientras le buscamos familia definitiva?",
      adjunto: null,
      likes: 27,
      respuestas: 12,
      mostrarBotonReportar: false
    }
  ];

  // Datos de la barra lateral (Sidebar)
  const categorias = [
    { nombre: "Abandono / Rescate", cantidad: 22, bg: "rgba(255, 186, 186, 0.5)", color: "#991b1b" }, // FFBABA 50%
    { nombre: "Adopciones", cantidad: 19, bg: "rgba(72, 255, 63, 0.31)", color: "#15803d" }, // 48FF3F 31%
    { nombre: "Comunicados oficiales", cantidad: 8, bg: "rgba(186, 231, 255, 0.5)", color: "#0369a1" }, // BAE7FF 50%
    { nombre: "Consultas vecinales", cantidad: 30, bg: "rgba(215, 215, 215, 0.5)", color: "#374151" }, // D7D7D7 50%
    { nombre: "Reclamos", cantidad: 2, bg: "rgba(255, 208, 0, 0.31)", color: "#854d0e" }, // FFD000 31%
  ];

  const proximosOperativos = [
    { fecha: "23 May", titulo: "Vacunación gratuita" },
    { fecha: "09 Jun", titulo: "Esterilización gratuita" }
  ];

  const navButtonStyle = {
    '--background': 'transparent',
    '--color': '#ffffff',
    '--border-radius': '6px',
    '--box-shadow': 'none',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    textTransform: 'none' as const,
    margin: '0 4px',
    height: '42px'
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    '--background': 'rgba(255, 255, 255, 0.1)',
    '--border-color': 'rgba(255, 255, 255, 0.2)',
    '--border-style': 'solid',
    '--border-width': '1px',
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border shadow-none">
        <IonToolbar style={{ '--background': '#2d6aab', '--padding-top': '12px', '--padding-bottom': '12px', '--padding-start': '2rem', '--padding-end': '2rem' }}>
          <div className="flex flex-col xl:flex-row justify-between items-center w-full gap-4 xl:gap-0">
            
            <div className="flex items-center gap-4 shrink-0 cursor-pointer" onClick={() => history.push('/app/inicio')}>
              <div className="w-12 h-12 bg-[#7ac29a] flex items-center justify-center overflow-hidden rounded">
                <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className="flex flex-col justify-center">
                <h2 style={{ fontFamily: "Inter", fontWeight: 800, fontSize: '16px', color: '#ffffff', margin: '0 0 2px 0' }}>Bienestar Animal</h2>
                <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: '14px', color: '#ffffff', margin: 0 }}>Municipalidad de Santo Domingo</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center">
              <IonButton fill="solid" routerLink="/app/inicio" style={navButtonStyle}>Inicio</IonButton>
              <IonButton fill="solid" style={navButtonStyle}>Mapa</IonButton>
              <IonButton fill="solid" routerLink="/app/adopciones" style={navButtonStyle}>Adopciones</IonButton>
              <IonButton fill="solid" routerLink="/app/foro" style={activeNavButtonStyle}>Foro</IonButton>
              <IonButton fill="solid" routerLink="/app/operativos" style={navButtonStyle}>Operativos</IonButton>
            </div>

            <div className="flex items-center gap-3">
              <IonButton style={{ '--background': '#ffffff', '--color': '#2d6aab', '--border-radius': '6px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', textTransform: 'none', height: '42px', '--padding-start': '20px', '--padding-end': '20px' }}>
                Mi cuenta
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#f8fafc' }}>
        
        <div style={{ backgroundColor: '#eef6fc', padding: '48px 32px 48px 32px' }}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <span style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              COMUNIDAD
            </span>
            <h1 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '36px', color: '#333333', marginBottom: '8px' }}>
              Foro Vecinal — Bienestar Animal
            </h1>
            <p style={{ fontFamily: "Roboto Slab", fontWeight: 400, fontSize: '15px', color: '#64748b', margin: 0 }}>
              Reporte abandonos, coordina adopciones y comunícate con la municipalidad.
            </p>
          </div>
        </div>

        <div className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">
                
                <IonCol size="12" sizeLg="7" sizeXl="8" className="pr-0 lg:pr-8">
                  
                  <IonCard className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">
                      <div className="flex gap-4 items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
                        <div className="w-full">
                          <input 
                            type="text" 
                            placeholder="¿Qué quieres publicar en el foro?" 
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
                            style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333' }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center ml-16">
                        <div className="flex gap-2">
                          <IonButton fill="outline" style={{ '--border-radius': '20px', '--border-color': '#93c5fd', '--color': '#1e3a8a', '--background': '#eff6ff', height: '36px', fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}>
                            Adjuntar Foto
                          </IonButton>
                          <IonButton fill="outline" style={{ '--border-radius': '20px', '--border-color': '#93c5fd', '--color': '#1e3a8a', '--background': '#eff6ff', height: '36px', fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}>
                            Establecer ubicación
                          </IonButton>
                        </div>
                        <IonButton style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '38px', fontFamily: "Roboto Slab", fontWeight: 600, fontSize: '14px', textTransform: 'none', margin: 0, paddingLeft: '16px', paddingRight: '16px' }}>
                          Publicar
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  {publicaciones.map((post) => (
                    <IonCard key={post.id} className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
                            <div>
                              <h3 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '16px', color: '#000000', margin: '0 0 2px 0' }}>
                                {post.autor}
                              </h3>
                              <p style={{ fontFamily: "Roboto Slab", fontWeight: 400, fontSize: '12px', color: '#64748b', margin: 0 }}>
                                {post.tiempo} • {post.ubicacion}
                              </p>
                            </div>
                          </div>
                          
                          <div style={{ backgroundColor: post.colorFondoEtiqueta, padding: '4px 16px', borderRadius: '16px' }}>
                            <span style={{ fontFamily: "Roboto Slab", fontWeight: 600, fontSize: '12px', color: post.colorTextoEtiqueta }}>
                              {post.etiqueta}
                            </span>
                          </div>
                        </div>

                        <h2 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '12px', lineHeight: '1.3' }}>
                          {post.titulo}
                        </h2>
                        <p style={{ fontFamily: "Roboto Slab", fontWeight: 400, fontSize: '14px', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                          {post.contenido}
                        </p>

                        {post.adjunto && (
                          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center gap-2">
                            <span style={{ fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '13px', color: '#64748b' }}>
                              {post.adjunto}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-4">
                          <span style={{ fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '12px', color: '#64748b' }}>
                            {post.likes} Likes • {post.respuestas} respuestas • Compartir
                          </span>
                          
                          {post.mostrarBotonReportar && (
                            <IonButton style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '32px', fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}>
                              Reportar
                            </IonButton>
                          )}
                        </div>

                      </IonCardContent>
                    </IonCard>
                  ))}

                </IonCol>


                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">
                  
                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">
                      <h2 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                        Categorías
                      </h2>
                      <div className="flex flex-col">
                        {categorias.map((cat, index) => (
                          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                            <span style={{ fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '14px', color: '#475569' }}>
                              {cat.nombre}
                            </span>
                            <div style={{ backgroundColor: cat.bg, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '12px', color: cat.color }}>
                                {cat.cantidad}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">
                      <h2 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '8px' }}>
                        Línea Directa
                      </h2>
                      <p style={{ fontFamily: "Roboto Slab", fontWeight: 500, fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
                        ¿Situación urgente? Contáctanos directamente.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <IonButton expand="block" style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '44px', fontFamily: "Roboto Slab", fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                          Llamar ahora
                        </IonButton>
                        <IonButton expand="block" fill="outline" style={{ '--border-radius': '6px', '--border-color': '#94a3b8', '--border-width': '2px', '--color': '#334155', height: '44px', fontFamily: "Roboto Slab", fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                          WhatsApp Municipalidad
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">
                      <h2 style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                        Próximos operativos
                      </h2>
                      <div className="flex flex-col">
                        {proximosOperativos.map((op, index) => (
                          <div key={index} className="flex gap-4 items-center py-3 border-b border-gray-100 last:border-0">
                            <span style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: '14px', color: '#64748b', minWidth: '55px' }}>
                              {op.fecha}
                            </span>
                            <span style={{ fontFamily: "Roboto Slab", fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                              - &nbsp; {op.titulo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>

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
