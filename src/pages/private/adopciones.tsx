import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonToast
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página de adopciones. muestra un grid de animales disponibles con filtros por tipo y estado.
  los datos de los animales están hardcodeados por ahora — cuando haya una api real,
  el array `animales` se reemplaza por una llamada a fetch o un hook personalizado*/

const Adopciones: React.FC = () => {
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const mostrarToast = (msg: string) => { setToastMsg(msg); setShowToast(true); };

  /*cada animal tiene un campo `tipo` para el filtrado y `urgente` que activa el borde azul.
    los campos de tamaño y etapa se pueden agregar después para los filtros "pequeño" y "adulto"*/
  const animales = [
    {
      id: 1, nombre: 'Camaron', tipo: 'Gato', urgente: false,
      detalles: 'Gato mestizo   3 años   Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      imagen: '/assets/camaron.jpg',
      bordeAzul: false
    },
    {
      id: 2, nombre: 'Kenai', tipo: 'Perro', urgente: false,
      detalles: 'Perro mestizo   3 años   Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      imagen: '/assets/kenai.jpg',
      bordeAzul: false
    },
    {
      id: 3, nombre: 'Leonidas', tipo: 'Perro', urgente: true,
      detalles: 'Perro mestizo   3 años   Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      imagen: '/assets/leonidas.jpg',
      bordeAzul: true
    },
    {
      id: 4, nombre: 'Yuumi', tipo: 'Gato', urgente: false,
      detalles: 'Gata Tuxedo / 3 Meses / Hembra',
      etiquetas: ['Vacunado'],
      imagen: '/assets/yuumi.jpg',
      bordeAzul: false
    },
    {
      id: 5, nombre: 'Pana Miguel', tipo: 'Gato', urgente: false,
      detalles: 'Gato mestizo / 3 años / Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      imagen: '/assets/panamiguel.jpg',
      bordeAzul: false
    },
    {
      id: 6, nombre: 'Meperdonas', tipo: 'Gato', urgente: false,
      detalles: 'Gato mestizo   3 años   Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      imagen: '/assets/meperdonas.jpg',
      bordeAzul: false
    },
  ];

  /*filtros disponibles. "todos" muestra todo, los demás filtran por tipo de animal o urgencia.
    los filtros "pequeño" y "adulto" quedan como visual hasta que se agreguen esos campos a los datos*/
  const filtros = [
    { label: 'Todos',    count: animales.length },
    { label: 'Perros',   count: animales.filter(a => a.tipo === 'Perro').length },
    { label: 'Gatos',    count: animales.filter(a => a.tipo === 'Gato').length  },
    { label: 'Pequeño',  count: null }, //TODO: necesita campo tamano en los datos
    { label: 'Adulto',   count: null }, //TODO: necesita campo etapa en los datos
    { label: 'Urgente',  count: animales.filter(a => a.urgente).length },
  ];

  //aplica el filtro activo al array de animales
  const animalesFiltrados = animales.filter(a => {
    if (filtroActivo === 'Todos')   return true;
    if (filtroActivo === 'Perros')  return a.tipo === 'Perro';
    if (filtroActivo === 'Gatos')   return a.tipo === 'Gato';
    if (filtroActivo === 'Urgente') return a.urgente;
    return true; //filtros sin lógica aún (pequeño, adulto) muestran todos
  });

  return (
    <IonPage>

      {/*barra de navegación institucional reutilizable*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#dcdfe4' }}>

        {/*sección de encabezado con título, descripción y filtros de búsqueda*/}
        <div className="px-8 md:px-16 lg:px-24 pt-12 pb-8">
          <div className="max-w-[1400px] mx-auto">

            <RevealWrapper>
              <span className="font-slab font-bold text-[10px] text-gray-500 uppercase tracking-widest block mb-2">
                Adopción Responsable
              </span>
              <h1 className="font-display font-bold text-3xl text-black mb-2">
                Encuentra a tu compañero ideal
              </h1>
              <p className="font-slab text-sm text-gray-500 mb-6">
                Todos los animales están vacunados, desparasitados y con chip integrado
              </p>
            </RevealWrapper>

            {/*pills de filtro. hover invierte los colores para indicar que son clickeables*/}
            <RevealWrapper delay={100}>
              <div className="flex flex-wrap gap-3">
                {filtros.map((filtro, idx) => {
                  const isActive = filtroActivo === filtro.label;
                  const texto = filtro.count !== null ? `${filtro.label} (${filtro.count})` : filtro.label;
                  return (
                    <button
                      key={idx}
                      onClick={() => setFiltroActivo(filtro.label)}
                      className={`px-5 py-2 rounded-full text-[13px] font-slab font-medium cursor-pointer
                                  transition-all duration-200 shadow-sm border
                                  ${isActive
                                    ? 'bg-[#e5e7eb] border-[#9ca3af] text-black'
                                    : 'bg-[#f3f4f6] border-[#d1d5db] text-black hover:bg-[#1a2b4a] hover:text-white hover:border-[#1a2b4a]'
                                  }`}
                    >
                      {texto}
                    </button>
                  );
                })}
              </div>
            </RevealWrapper>
          </div>
        </div>

        <div className="w-full h-px bg-gray-400 opacity-30 mb-8" />

        {/*grid principal de tarjetas de animales*/}
        <div className="px-8 md:px-16 lg:px-24 pb-16">
          <div className="max-w-[1400px] mx-auto">
            <IonGrid className="ion-no-padding">
              <IonRow>
                {animalesFiltrados.map((animal, idx) => {
                  const tieneImagen = Boolean(animal.imagen);
                  const textColor = tieneImagen ? '#ffffff' : '#000000';
                  const tagBg     = tieneImagen ? 'rgba(255,255,255,0.8)' : '#e5e7eb';
                  const tagText   = tieneImagen ? '#000000' : '#4b5563';

                  return (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={animal.id} className="p-3">

                      {/*cada tarjeta tiene reveal escalonado (delay aumenta con el índice).
                        el wrapper también maneja el hover de escala y sombra*/}
                      <RevealWrapper delay={idx * 80} className="h-full">
                        <div className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                                        cursor-pointer rounded-xl h-full">
                          <IonCard
                            className="m-0 shadow-md relative overflow-hidden h-[320px] flex flex-col justify-end"
                            style={{
                              '--background': tieneImagen ? 'transparent' : '#ffffff',
                              '--border-radius': '12px',
                              border: animal.bordeAzul ? '2px solid #3b82f6' : 'none',
                              backgroundImage: tieneImagen ? `url(${animal.imagen})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            {/*gradiente oscuro sobre la imagen para que el texto sea legible*/}
                            {tieneImagen && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
                            )}

                            {/*si el animal es urgente se muestra un badge en la esquina superior*/}
                            {animal.urgente && (
                              <div className="absolute top-4 right-4 z-10 bg-red-600 text-white
                                              text-[11px] font-slab font-bold px-3 py-1 rounded-full">
                                Urgente
                              </div>
                            )}

                            <IonCardContent className="p-6 relative z-10 w-full">
                              <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '20px', color: textColor, marginBottom: '4px' }}>
                                "{animal.nombre}"
                              </h3>
                              <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '13px', color: tieneImagen ? '#e5e7eb' : '#6b7280', marginBottom: '12px' }}>
                                {animal.detalles}
                              </p>

                              {/*etiquetas de estado (vacunado, castrado, etc.)*/}
                              <div className="flex flex-wrap gap-2 mb-6">
                                {animal.etiquetas.map((etiqueta, i) => (
                                  <span key={i} style={{ backgroundColor: tagBg, color: tagText, fontSize: '11px', padding: '4px 12px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                                    {etiqueta}
                                  </span>
                                ))}
                              </div>

                              <div className="flex gap-3 mt-auto">
                                {/*ver ficha lleva al detalle del animal*/}
                                <IonButton
                                  routerLink={`/app/adopciones/${animal.id}`}
                                  className="m-0 flex-1"
                                  style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '38px', '--box-shadow': 'none', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', textTransform: 'none' }}
                                >
                                  Ver Ficha
                                </IonButton>

                                {/*adoptar muestra un toast de confirmación*/}
                                <IonButton
                                  className="m-0 flex-1"
                                  onClick={() => mostrarToast(`solicitud de adopción para "${animal.nombre}" enviada. el equipo se pondrá en contacto contigo`)}
                                  style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '38px', '--box-shadow': 'none', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', textTransform: 'none' }}
                                >
                                  Adoptar
                                </IonButton>
                              </div>
                            </IonCardContent>
                          </IonCard>
                        </div>
                      </RevealWrapper>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/*pie de página*/}
        <div className="w-full h-px bg-gray-400 opacity-30 mt-8 mb-6" />
        <div className="px-8 md:px-16 lg:px-24 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <p className="font-slab text-xs text-gray-500 m-0">
              © 2026 Municipalidad de Santo Domingo — Comuna Parque
            </p>
          </div>
        </div>

        {/*toast de confirmación para acciones del usuario*/}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={3500}
          position="bottom"
          color="success"
        />

      </IonContent>
    </IonPage>
  );
};

export default Adopciones;
