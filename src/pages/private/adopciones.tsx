import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonAlert, IonSpinner
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';
import { getAnimales, toCard, solicitarAdopcion, ApiError, type AnimalCard } from '../../services';
import { useNotifications } from '../../context/useNotifications';

/* Página de adopciones (EP 2.4 / EF1 — integración real).
   Obtiene el catálogo de animales en vivo desde el backend (GET /api/animales,
   que lee desde PostgreSQL) y permite postular a una adopción mediante
   POST /api/adopciones (la solicitud queda en lista de espera del funcionario). */

const Adopciones: React.FC = () => {
  const { notify } = useNotifications();
  const [animales, setAnimales] = useState<AnimalCard[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const [filtroActivo, setFiltroActivo] = useState<string>('Todos');
  // Animal para el que se está completando la solicitud (abre el diálogo).
  const [animalSolicitud, setAnimalSolicitud] = useState<AnimalCard | null>(null);

  // Envía la solicitud real al backend con los datos del diálogo.
  const enviarSolicitud = async (telefono: string, motivo: string) => {
    if (!animalSolicitud) return;
    if (!telefono.trim() || !motivo.trim()) {
      notify('Faltan datos', 'Indica tu teléfono y el motivo de la adopción', 'error');
      return;
    }
    try {
      await solicitarAdopcion(animalSolicitud.id, telefono.trim(), motivo.trim());
      notify('Solicitud enviada', `Postulaste a "${animalSolicitud.nombre}". El equipo te contactará.`, 'success');
    } catch (err) {
      notify('No se pudo postular', err instanceof ApiError ? err.message : 'Error de conexión', 'error');
    }
  };

  // Carga el catálogo desde la API al montar la vista.
  useEffect(() => {
    let activo = true;
    getAnimales()
      .then(data => { if (activo) setAnimales(data.map(toCard)); })
      .catch(err => {
        if (activo) setErrorCarga(err instanceof ApiError ? err.message : 'Error al cargar el catálogo.');
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  /*filtros disponibles. "todos" muestra todo, los demás filtran por especie o urgencia.*/
  const filtros = [
    { label: 'Todos',   count: animales.length },
    { label: 'Perros',  count: animales.filter(a => a.tipo === 'Perro').length },
    { label: 'Gatos',   count: animales.filter(a => a.tipo === 'Gato').length },
    { label: 'Urgente', count: animales.filter(a => a.urgente).length },
  ];

  //aplica el filtro activo al array de animales
  const animalesFiltrados = animales.filter(a => {
    if (filtroActivo === 'Perros')  return a.tipo === 'Perro';
    if (filtroActivo === 'Gatos')   return a.tipo === 'Gato';
    if (filtroActivo === 'Urgente') return a.urgente;
    return true; // "Todos"
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
                      {`${filtro.label} (${filtro.count})`}
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

            {/*estado de carga mientras llega la respuesta del backend*/}
            {cargando && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
                <p className="font-slab text-sm text-gray-500 m-0">Cargando catálogo...</p>
              </div>
            )}

            {/*estado de error de red o servidor caído*/}
            {!cargando && errorCarga && (
              <div className="text-center py-20">
                <p className="font-slab text-sm text-red-600 m-0">{errorCarga}</p>
              </div>
            )}

            {/*catálogo vacío*/}
            {!cargando && !errorCarga && animalesFiltrados.length === 0 && (
              <div className="text-center py-20">
                <p className="font-slab text-sm text-gray-500 m-0">No hay animales que coincidan con el filtro.</p>
              </div>
            )}

            {!cargando && !errorCarga && animalesFiltrados.length > 0 && (
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
                              border: animal.urgente ? '2px solid #3b82f6' : 'none',
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

                                {/*adoptar abre el diálogo de solicitud real (POST /api/adopciones)*/}
                                <IonButton
                                  className="m-0 flex-1"
                                  onClick={() => setAnimalSolicitud(animal)}
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
            )}
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

        {/*diálogo de solicitud de adopción: pide teléfono y motivo (campos del backend)*/}
        <IonAlert
          isOpen={Boolean(animalSolicitud)}
          onDidDismiss={() => setAnimalSolicitud(null)}
          header={`Adoptar a "${animalSolicitud?.nombre ?? ''}"`}
          message="Déjanos tus datos y el equipo municipal evaluará tu solicitud."
          inputs={[
            { name: 'telefono', type: 'tel', placeholder: 'Teléfono de contacto (+56 9 ...)' },
            { name: 'motivo', type: 'textarea', placeholder: '¿Por qué quieres adoptarlo?' },
          ]}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Enviar solicitud', handler: (data) => { enviarSolicitud(data.telefono ?? '', data.motivo ?? ''); } },
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Adopciones;
