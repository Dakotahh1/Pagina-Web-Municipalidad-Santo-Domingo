import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonToast
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página de detalle de un animal. muestra su foto, información básica, historial médico y notas.
  el componente se llama AdopcionDetalle internamente, pero el archivo es FichaAnimal.tsx.
  se puede renombrar cuando se limpie el proyecto.

  recibe el id del animal por la url (/app/adopciones/:id) y busca al animal en la base de datos local.
  cuando haya api real, esta búsqueda se reemplaza por un fetch o un useEffect con llamada al backend*/

const AdopcionDetalle: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedThumb, setSelectedThumb] = useState<number>(0); //índice de la miniatura seleccionada

  const mostrarToast = (msg: string) => { setToastMsg(msg); setShowToast(true); };

  /*base de datos local de mascotas hardcodeada hasta conectar con el backend.
    cada animal tiene: id, datos básicos, etiquetas, chip, imágenes, info detallada,
    historial médico, notas y el inspector responsable*/
  const baseDatosMascotas = [
    {
      id: 1,
      nombre: 'Camaron',
      tipo: 'Gatos',
      descripcionCorta: 'Gato mestizo',
      edad: '3 años',
      sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      chip: 'ABCD-9999-0000-22222',
      imagenPrincipal: '/assets/camaron.jpg',
      miniaturas: ['/assets/gato2.jpg', '/assets/gato3.jpg'],
      infoDetallada: [
        { clave: 'Especie',         valor: 'Gato'               },
        { clave: 'Raza',            valor: 'Naranjito'          },
        { clave: 'Sexo',            valor: 'Macho'              },
        { clave: 'Edad Estimada',   valor: '3 años'             },
        { clave: 'Tamaño',          valor: 'Mediano'            },
        { clave: 'Color',           valor: 'Naranjo con blanco' },
        { clave: 'Zona de Rescate', valor: 'De casa'            },
      ],
      historial: [
        { fecha: '15 enero 2025',    evento: 'Control veterinario rutinario. Estado general bueno. Sin novedades.' },
        { fecha: '03 noviembre 2024', evento: 'Operativo de esterilización – Sector norte. Castración realizada exitosamente.' },
      ],
      notas: 'Camaron es un gatito lindo que come mucho y no sabe cuando parar de comer.',
      inspector: 'Vicente Palma',
    },
    {
      id: 2,
      nombre: 'Kenai',
      tipo: 'Perros',
      descripcionCorta: 'Perro mestizo',
      edad: '3 años',
      sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      chip: 'KEN-8888-1111-33333',
      imagenPrincipal: '/assets/kenai.jpg',
      miniaturas: ['/assets/kenai_thumb1.jpg', '/assets/kenai_thumb2.jpg'],
      infoDetallada: [
        { clave: 'Especie',         valor: 'Perro'          },
        { clave: 'Raza',            valor: 'Mestizo'        },
        { clave: 'Sexo',            valor: 'Macho'          },
        { clave: 'Edad Estimada',   valor: '3 años'         },
        { clave: 'Tamaño',          valor: 'Grande'         },
        { clave: 'Color',           valor: 'Blanco'         },
        { clave: 'Zona de Rescate', valor: 'Sector Centro'  },
      ],
      historial: [
        { fecha: '10 enero 2025', evento: 'Vacunación séxtuple aplicada.' },
      ],
      notas: 'Kenai es muy juguetón y requiere espacio para correr.',
      inspector: 'Andrea Silva',
    },
    {
      id: 3,
      nombre: 'Leonidas',
      tipo: 'Perros',
      descripcionCorta: 'Perro mestizo',
      edad: '3 años',
      sexo: 'Macho',
      etiquetas: ['Vacunado', 'Castrado'],
      chip: 'LEO-7777-2222-44444',
      imagenPrincipal: '/assets/leonidas.jpg',
      miniaturas: ['/assets/leonidas_thumb1.jpg', '/assets/leonidas_thumb2.jpg'],
      infoDetallada: [
        { clave: 'Especie',         valor: 'Perro'       },
        { clave: 'Raza',            valor: 'Mestizo'     },
        { clave: 'Sexo',            valor: 'Macho'       },
        { clave: 'Edad Estimada',   valor: '3 años'      },
        { clave: 'Tamaño',          valor: 'Mediano'     },
        { clave: 'Color',           valor: 'Negro'       },
        { clave: 'Zona de Rescate', valor: 'Sector Sur'  },
      ],
      historial: [
        { fecha: '05 febrero 2025', evento: 'Ingreso y revisión general.' },
      ],
      notas: 'Un perro muy leal y protector.',
      inspector: 'Carlos Pérez',
    },
  ];

  /*si la id de la url no corresponde a ningún animal, se muestra el primero por defecto.
    esto evita que la app explote si alguien entra a una ruta que no existe*/
  const mascotaId = id ? parseInt(id, 10) : 1;
  const mascota = baseDatosMascotas.find(m => m.id === mascotaId) || baseDatosMascotas[0];

  //copia el link de la ficha al portapapeles y avisa al usuario
  const handleCompartir = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => mostrarToast('enlace de la ficha copiado al portapapeles'))
      .catch(() => mostrarToast('no se pudo copiar el enlace, intenta de nuevo'));
  };

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#d1d5db' }}>

        {/*breadcrumb de navegación: adopciones > tipo > nombre del animal*/}
        <div style={{ backgroundColor: '#e5e7eb', padding: '12px 32px', borderBottom: '1px solid #9ca3af' }}>
          <p className="font-slab font-semibold text-xs text-gray-900 m-0">
            <span className="cursor-pointer hover:underline" onClick={() => history.push('/app/adopciones')}>
              Adopciones
            </span>
            {' › '}{mascota.tipo}{' › '}"{mascota.nombre}"
          </p>
        </div>

        <div className="p-8">
          <IonGrid className="ion-no-padding max-w-[1200px] mx-auto">
            <IonRow>

              {/*columna izquierda: foto principal, datos básicos y botones de acción*/}
              <IonCol size="12" sizeLg="5" className="p-3">
                <RevealWrapper>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-6">

                      {/*imagen principal del animal. loading=lazy para no bloquear el render inicial*/}
                      <div className="w-full h-[240px] bg-gray-200 rounded-lg mb-6 overflow-hidden">
                        <img
                          src={selectedThumb > 0 ? mascota.miniaturas[selectedThumb - 1] : mascota.imagenPrincipal}
                          alt={mascota.nombre}
                          loading="lazy"
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>

                      <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', marginBottom: '8px', lineHeight: '1.2' }}>
                        "{mascota.nombre}"
                      </h1>

                      {/*datos básicos del animal en línea*/}
                      <div className="flex gap-4 mb-4">
                        {[mascota.descripcionCorta, mascota.edad, mascota.sexo].map((dato, i) => (
                          <span key={i} className="font-slab text-sm text-gray-600">{dato}</span>
                        ))}
                      </div>

                      {/*etiquetas de estado (vacunado, castrado, etc.)*/}
                      <div className="flex gap-2 mb-6">
                        {mascota.etiquetas.map((etiqueta, i) => (
                          <span key={i} style={{ backgroundColor: '#e5e7eb', color: '#374151', fontSize: '12px', padding: '6px 16px', borderRadius: '16px', fontFamily: "'Roboto Slab', serif", fontWeight: 500 }}>
                            {etiqueta}
                          </span>
                        ))}
                      </div>

                      {/*chip del animal registrado en el sistema municipal*/}
                      <div style={{ backgroundColor: '#d1d5db', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span className="font-slab font-medium text-xs text-gray-700">Chip Registrado:</span>
                        <span className="font-slab text-xs text-gray-700">{mascota.chip}</span>
                      </div>

                      {/*botón de solicitud que envía la solicitud y notifica al usuario*/}
                      <IonButton
                        expand="block"
                        onClick={() => mostrarToast(`solicitud de adopción para ${mascota.nombre} enviada. pronto recibirás una respuesta`)}
                        style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', marginBottom: '12px' }}
                      >
                        Solicitar Adopción
                      </IonButton>

                      {/*botón de compartir que copia el link de la ficha al portapapeles*/}
                      <IonButton
                        expand="block"
                        onClick={handleCompartir}
                        style={{ '--background': '#000000', '--color': '#ffffff', '--border-radius': '6px', height: '48px', fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px', textTransform: 'none', marginBottom: '24px' }}
                      >
                        Compartir Ficha
                      </IonButton>

                      {/*miniaturas de fotos adicionales. al hacer click cambian la imagen principal*/}
                      <div className="flex gap-4">
                        {[mascota.imagenPrincipal, ...mascota.miniaturas].map((src, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedThumb(i)}
                            className={`w-[80px] h-[80px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer
                                        transition-all duration-200 hover:scale-105
                                        ${selectedThumb === i ? 'ring-2 ring-muni-blue' : 'ring-1 ring-transparent'}`}
                          >
                            <img
                              src={src}
                              alt={`foto ${i + 1}`}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                        ))}
                      </div>

                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>
              </IonCol>

              {/*columna derecha: información detallada, historial médico y notas del inspector*/}
              <IonCol size="12" sizeLg="7" className="p-3 flex flex-col gap-6">

                {/*tabla de información del animal*/}
                <RevealWrapper delay={100}>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-8">
                      <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>
                        Información del Animal
                      </h2>
                      <div className="flex flex-col gap-4">
                        {mascota.infoDetallada.map((item, index) => (
                          <div key={index} className="flex justify-between items-center border-b border-gray-300 pb-3 last:border-0 last:pb-0">
                            <span className="font-slab text-sm text-gray-500">{item.clave}</span>
                            <span className="font-slab font-bold text-sm text-black">{item.valor}</span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

                {/*historial de eventos médicos y veterinarios del animal*/}
                <RevealWrapper delay={200}>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-8">
                      <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '24px' }}>
                        Historial Médico
                      </h2>
                      <div className="flex flex-col gap-6">
                        {mascota.historial.map((item, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <span className="font-slab font-bold text-sm text-gray-600">{item.fecha}</span>
                            <span className="font-slab text-sm text-gray-900 leading-relaxed">{item.evento}</span>
                          </div>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

                {/*notas del inspector responsable del animal*/}
                <RevealWrapper delay={300}>
                  <IonCard className="m-0 shadow-sm" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                    <IonCardContent className="p-8">
                      <h2 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '16px' }}>
                        Notas
                      </h2>
                      <p className="font-slab text-sm text-gray-700 leading-relaxed mb-6">{mascota.notas}</p>

                      <div className="flex items-center gap-3">
                        <div style={{ backgroundColor: '#d1d5db', padding: '6px 12px', borderRadius: '4px' }}>
                          <span className="font-slab font-medium text-xs text-gray-600">Foto</span>
                        </div>
                        <span className="font-slab font-bold text-sm text-black">
                          Inspector {mascota.inspector}
                        </span>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </RevealWrapper>

              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/*toast para confirmaciones de adopción y compartir*/}
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

export default AdopcionDetalle;
