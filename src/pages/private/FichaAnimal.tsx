import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonAlert, IonSpinner
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';
import { getAnimalById, solicitarAdopcion, ApiError, type Animal } from '../../services';
import { useNotifications } from '../../context/useNotifications';

/* Ficha de detalle de un animal (EF1 — integración real).
   Recibe el id por la URL (/app/adopciones/:id), carga la mascota desde
   GET /api/animales/:id (PostgreSQL) y permite postular a su adopción
   mediante POST /api/adopciones. */

const FichaAnimal: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { notify } = useNotifications();

  const [mascota, setMascota] = useState<Animal | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [mostrarSolicitud, setMostrarSolicitud] = useState(false);

  // Carga la ficha desde la API según el id de la ruta.
  useEffect(() => {
    let activo = true;
    setCargando(true);
    getAnimalById(parseInt(id, 10))
      .then((data) => { if (activo) setMascota(data); })
      .catch((err) => {
        if (activo) setErrorCarga(err instanceof ApiError ? err.message : 'No se pudo cargar la ficha.');
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [id]);

  // Envía la solicitud de adopción real al backend.
  const enviarSolicitud = async (telefono: string, motivo: string) => {
    if (!mascota) return;
    if (!telefono.trim() || !motivo.trim()) {
      notify('Faltan datos', 'Indica tu teléfono y el motivo de la adopción', 'error');
      return;
    }
    try {
      await solicitarAdopcion(mascota.id, telefono.trim(), motivo.trim());
      notify('Solicitud enviada', `Postulaste a "${mascota.nombre}". El equipo te contactará.`, 'success');
    } catch (err) {
      notify('No se pudo postular', err instanceof ApiError ? err.message : 'Error de conexión', 'error');
    }
  };

  // Copia el enlace de la ficha al portapapeles.
  const handleCompartir = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => notify('Enlace copiado', 'La ficha quedó en tu portapapeles', 'info'))
      .catch(() => notify('Error', 'No se pudo copiar el enlace', 'error'));
  };

  // Pares clave/valor construidos con los campos reales de la base de datos.
  const infoDetallada = mascota
    ? [
        { clave: 'Especie', valor: mascota.especie },
        { clave: 'Raza', valor: mascota.raza },
        { clave: 'Sexo', valor: mascota.sexo },
        { clave: 'Edad Estimada', valor: `${mascota.edad} ${mascota.edad === 1 ? 'año' : 'años'}` },
        { clave: 'Color', valor: mascota.color || '—' },
        { clave: 'Estado', valor: mascota.estado_adopcion },
      ]
    : [];

  const etiquetas = mascota
    ? ([mascota.vacunado && 'Vacunado', mascota.castrado && 'Castrado'].filter(Boolean) as string[])
    : [];

  const imagen = mascota?.imagenes[0] ?? '';

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#d1d5db' }}>

        {/*breadcrumb de navegación: adopciones > especie > nombre del animal*/}
        <div style={{ backgroundColor: '#e5e7eb', padding: '12px 32px', borderBottom: '1px solid #9ca3af' }}>
          <p className="font-slab font-semibold text-xs text-gray-900 m-0">
            <span className="cursor-pointer hover:underline" onClick={() => history.push('/app/adopciones')}>
              Adopciones
            </span>
            {mascota && <>{' › '}{mascota.especie}{' › '}"{mascota.nombre}"</>}
          </p>
        </div>

        {/*estado de carga mientras llega la ficha desde la API*/}
        {cargando && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <IonSpinner name="crescent" style={{ color: '#2d6aab' }} />
            <p className="font-slab text-sm text-gray-600 m-0">Cargando ficha...</p>
          </div>
        )}

        {/*error de carga (id inexistente o servidor caído)*/}
        {!cargando && errorCarga && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="font-slab text-sm text-red-700 m-0">{errorCarga}</p>
            <IonButton onClick={() => history.push('/app/adopciones')} style={{ '--background': '#2d6aab', textTransform: 'none' }}>
              Volver a Adopciones
            </IonButton>
          </div>
        )}

        {!cargando && !errorCarga && mascota && (
        <div className="p-8">
          <IonGrid className="ion-no-padding max-w-[1200px] mx-auto">
            <IonRow>

              {/*columna izquierda: foto, datos básicos y acciones*/}
              <IonCol size="12" sizeLg="5" className="p-3">
                <RevealWrapper>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">

                      {/*imagen principal del animal (si la mascota tiene fotos en la BD)*/}
                      <div className="w-full h-[240px] bg-gray-200 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                        {imagen ? (
                          <img
                            src={imagen}
                            alt={mascota.nombre}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="font-slab text-xs text-gray-500">Sin fotografía registrada</span>
                        )}
                      </div>

                      <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', marginBottom: '8px', lineHeight: '1.2' }}>
                        "{mascota.nombre}"
                      </h1>

                      {/*datos básicos en línea*/}
                      <div className="flex gap-4 mb-4">
                        {[`${mascota.especie} ${mascota.raza}`, `${mascota.edad} ${mascota.edad === 1 ? 'año' : 'años'}`, mascota.sexo].map((dato, i) => (
                          <span key={i} className="font-slab text-sm text-gray-600">{dato}</span>
                        ))}
                      </div>

                      {/*etiquetas de estado sanitario*/}
                      <div className="flex gap-2 mb-6">
                        {etiquetas.map((etiqueta, i) => (
                          <span key={i} style={{ backgroundColor: '#e5e7eb', color: '#374151', fontSize: '12px', padding: '6px 16px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                            {etiqueta}
                          </span>
                        ))}
                      </div>

                      {/*chip del animal registrado en el sistema municipal*/}
                      <div style={{ backgroundColor: '#d1d5db', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span className="font-slab font-medium text-xs text-gray-700">Chip Registrado:</span>
                        <span className="font-slab text-xs text-gray-700">{mascota.chip ?? 'Sin chip'}</span>
                      </div>

                      {/*solicitud de adopción real (POST /api/adopciones)*/}
                      <IonButton
                        expand="block"
                        disabled={mascota.estado_adopcion !== 'Disponible'}
                        onClick={() => setMostrarSolicitud(true)}
                        style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', marginBottom: '12px' }}
                      >
                        {mascota.estado_adopcion === 'Disponible' ? 'Solicitar Adopción' : `No disponible (${mascota.estado_adopcion})`}
                      </IonButton>

                      {/*compartir la ficha copiando el enlace*/}
                      <IonButton
                        expand="block"
                        onClick={handleCompartir}
                        style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                      >
                        Compartir Ficha
                      </IonButton>

                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>
              </IonCol>

              {/*columna derecha: información detallada y notas de la unidad*/}
              <IonCol size="12" sizeLg="7" className="p-3 flex flex-col gap-6">

                {/*tabla de información del animal (campos reales de la BD)*/}
                <RevealWrapper delay={100}>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-8">
                      <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>
                        Información del Animal
                      </h2>
                      <div className="flex flex-col gap-4">
                        {infoDetallada.map((item, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-3 last:border-0 last:pb-0">
                            <span className="font-slab text-sm text-gray-500">{item.clave}</span>
                            <span className="font-slab font-bold text-sm text-black">{item.valor}</span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

                {/*notas y descripción registradas por la unidad de bienestar animal*/}
                <RevealWrapper delay={200}>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-8">
                      <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '16px' }}>
                        Notas de la Unidad
                      </h2>
                      <p className="font-slab text-sm text-gray-700 leading-relaxed m-0">
                        {mascota.descripcion || 'Sin observaciones registradas.'}
                      </p>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        )}

        {/*diálogo de solicitud: pide teléfono y motivo (campos que exige el backend)*/}
        <IonAlert
          isOpen={mostrarSolicitud}
          onDidDismiss={() => setMostrarSolicitud(false)}
          header={`Adoptar a "${mascota?.nombre ?? ''}"`}
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

export default FichaAnimal;
