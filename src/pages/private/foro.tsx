import React, { useState } from 'react';
import {
  IonPage, IonContent, IonButton,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonToast
} from '@ionic/react';

import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página del foro vecinal. permite a los vecinos publicar avisos, reportar animales abandonados
  y leer comunicados oficiales de la municipalidad.

  tiene dos columnas: la principal con el feed de publicaciones y una barra lateral
  con categorías, línea directa y próximos operativos*/

const Foro: React.FC = () => {
  const [contenido, setContenido]   = useState('');
  const [inputError, setInputError] = useState(''); //mensaje de validación del campo de texto
  const [showToast, setShowToast]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const mostrarToast = (msg: string, color: 'success' | 'danger' = 'success') => {
    setToastMsg(msg);
    setToastColor(color);
    setShowToast(true);
  };

  /*valida que el campo no esté vacío antes de publicar.
    si pasa la validación, limpia el input y muestra confirmación*/
  const handlePublicar = () => {
    if (contenido.trim().length < 10) {
      setInputError('el texto es muy corto, escribe al menos 10 caracteres antes de publicar');
      return;
    }
    setInputError('');
    setContenido('');
    mostrarToast('tu publicación fue enviada al foro vecinal');
  };

  //notifica al usuario que el reporte fue recibido por la municipalidad
  const handleReportar = () => {
    mostrarToast('tu reporte fue enviado. el personal municipal lo revisará en 24-48 hrs');
  };

  /*publicaciones del foro. cada una tiene autor, tiempo, ubicación, etiqueta con color,
    título, contenido, adjunto opcional y contadores de likes y respuestas.
    las publicaciones con mostrarBotonReportar=true son las que tienen contenido reportable*/
  const publicaciones = [
    {
      id: 1,
      autor: 'María González',
      tiempo: 'Hace 2 horas',
      ubicacion: 'Sector La Parroquia',
      etiqueta: 'Abandono',
      colorFondoEtiqueta: 'rgba(255, 186, 186, 0.5)',
      colorTextoEtiqueta: '#991b1b',
      titulo: 'Perro abandonado frente a la plaza, lleva 3 días en la calle',
      contenido: 'Vi esta mañana un perro mediano, color café, que lleva varios días en la plaza de la parroquia en el centro. Parece manso y tiene collar pero sin placa. ¿Alguien sabe si ya fue reportado a la muni?',
      adjunto: '1 Fotografía adjunta - Sector la parroquia',
      likes: 14,
      respuestas: 8,
      mostrarBotonReportar: true,
    },
    {
      id: 2,
      autor: 'Municipalidad de Santo Domingo',
      tiempo: 'Ayer 18:36 hrs',
      ubicacion: 'Comunicado oficial',
      etiqueta: 'Oficial',
      colorFondoEtiqueta: 'rgba(186, 231, 255, 0.5)',
      colorTextoEtiqueta: '#0369a1',
      titulo: 'Operativo de vacunación antirrábica — Sector Norte, 23 de mayo',
      contenido: 'Informamos a la comunidad que el sábado 23 de mayo se realizará un operativo gratuito de vacunación antirrábica en el Gimnasio Municipal. Nuestro personal se encontrará de 09:00 a 14:00 hrs. Por favor traer a sus mascotas con correa o transporte.',
      adjunto: null,
      likes: 42,
      respuestas: 5,
      mostrarBotonReportar: false,
    },
    {
      id: 3,
      autor: 'Ariel Villar',
      tiempo: 'Hace 2 días',
      ubicacion: 'Sector Huerto las Parcelas',
      etiqueta: 'Adopción',
      colorFondoEtiqueta: 'rgba(72, 255, 63, 0.31)',
      colorTextoEtiqueta: '#15803d',
      titulo: 'Busco hogar temporal para gatita rescatada',
      contenido: 'Encontré una gatita de aproximadamente 2 meses cerca de las parcelas. Lamentablemente no puedo quedármela porque mis perros no la aceptan. ¿Alguien tiene un espacio temporal mientras le buscamos familia definitiva?',
      adjunto: null,
      likes: 27,
      respuestas: 12,
      mostrarBotonReportar: false,
    },
  ];

  /*categorías de la barra lateral con su cantidad de publicaciones.
    los colores coinciden con los colores de etiqueta del feed*/
  const categorias = [
    { nombre: 'Abandono / Rescate',    cantidad: 22, bg: 'rgba(255, 186, 186, 0.5)', color: '#991b1b' },
    { nombre: 'Adopciones',            cantidad: 19, bg: 'rgba(72, 255, 63, 0.31)',  color: '#15803d' },
    { nombre: 'Comunicados oficiales', cantidad: 8,  bg: 'rgba(186, 231, 255, 0.5)', color: '#0369a1' },
    { nombre: 'Consultas vecinales',   cantidad: 30, bg: 'rgba(215, 215, 215, 0.5)', color: '#374151' },
    { nombre: 'Reclamos',              cantidad: 2,  bg: 'rgba(255, 208, 0, 0.31)',  color: '#854d0e' },
  ];

  //operativos próximos que se muestran en la sidebar como recordatorio
  const proximosOperativos = [
    { fecha: '23 May', titulo: 'Vacunación gratuita'    },
    { fecha: '09 Jun', titulo: 'Esterilización gratuita' },
  ];

  return (
    <IonPage>

      {/*barra de navegación institucional*/}
      <NavBar />

      <IonContent fullscreen style={{ '--background': '#f8fafc' }}>

        {/*encabezado de la sección con fondo celeste suave*/}
        <div style={{ backgroundColor: '#eef6fc', padding: '48px 32px' }}>
          <RevealWrapper>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
              <span className="font-slab font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
                Comunidad
              </span>
              <h1 className="font-slab font-bold text-4xl text-gray-800 mb-2">
                Foro Vecinal — Bienestar Animal
              </h1>
              <p className="font-slab text-[15px] text-gray-500 m-0">
                Reporte abandonos, coordina adopciones y comunícate con la municipalidad.
              </p>
            </div>
          </RevealWrapper>
        </div>

        {/*contenido principal del foro: feed de publicaciones y barra lateral*/}
        <div className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow className="justify-between">

                {/*columna principal: formulario de nueva publicación + feed de posts*/}
                <IonCol size="12" sizeLg="7" sizeXl="8" className="pr-0 lg:pr-8">

                  {/*tarjeta para crear una nueva publicación en el foro*/}
                  <RevealWrapper>
                    <IonCard className="m-0 mb-6 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <div className="flex gap-4 items-start mb-4">

                          {/*avatar placeholder del usuario — en producción mostraría la foto del vecino*/}
                          <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />

                          <div className="w-full">
                            <input
                              type="text"
                              value={contenido}
                              onChange={e => {
                                setContenido(e.target.value);
                                if (inputError) setInputError('');
                              }}
                              placeholder="¿Qué quieres publicar en el foro?"
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 outline-none
                                         focus:border-blue-400 transition-colors duration-150"
                              style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: '#333' }}
                            />

                            {/*mensaje de error si el campo está vacío al intentar publicar*/}
                            {inputError && (
                              <p className="font-slab text-xs text-red-600 mt-1.5 m-0">{inputError}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center ml-16">
                          <div className="flex gap-2">
                            <IonButton fill="outline" style={{ '--border-radius': '20px', '--border-color': '#93c5fd', '--color': '#1e3a8a', '--background': '#eff6ff', height: '36px', fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}>
                              Adjuntar Foto
                            </IonButton>
                            <IonButton fill="outline" style={{ '--border-radius': '20px', '--border-color': '#93c5fd', '--color': '#1e3a8a', '--background': '#eff6ff', height: '36px', fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}>
                              Establecer ubicación
                            </IonButton>
                          </div>

                          {/*botón de publicar — valida antes de enviar*/}
                          <IonButton
                            onClick={handlePublicar}
                            style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '38px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '14px', textTransform: 'none', margin: 0 }}
                          >
                            Publicar
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*feed de publicaciones del foro, ordenadas de más reciente a más antigua*/}
                  {publicaciones.map((post, idx) => (
                    <RevealWrapper key={post.id} delay={idx * 100}>
                      <IonCard
                        className="m-0 mb-6 shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md"
                        style={{ '--background': '#ffffff', '--border-radius': '8px' }}
                      >
                        <IonCardContent className="p-6">

                          {/*cabecera del post: avatar, autor, tiempo, ubicación y etiqueta de categoría*/}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                              <div>
                                <h3 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '16px', color: '#000000', margin: '0 0 2px 0' }}>
                                  {post.autor}
                                </h3>
                                <p style={{ fontFamily: 'Roboto Slab', fontWeight: 400, fontSize: '12px', color: '#64748b', margin: 0 }}>
                                  {post.tiempo} • {post.ubicacion}
                                </p>
                              </div>
                            </div>

                            {/*etiqueta de categoría con color según el tipo de publicación*/}
                            <div style={{ backgroundColor: post.colorFondoEtiqueta, padding: '4px 16px', borderRadius: '16px' }}>
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '12px', color: post.colorTextoEtiqueta }}>
                                {post.etiqueta}
                              </span>
                            </div>
                          </div>

                          <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '20px', color: '#000000', marginBottom: '12px', lineHeight: '1.3' }}>
                            {post.titulo}
                          </h2>
                          <p style={{ fontFamily: 'Roboto Slab', fontWeight: 400, fontSize: '14px', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                            {post.contenido}
                          </p>

                          {/*adjunto de foto si la publicación tiene uno*/}
                          {post.adjunto && (
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '13px', color: '#64748b' }}>
                                {post.adjunto}
                              </span>
                            </div>
                          )}

                          {/*pie de post: likes, respuestas y botón de reporte si aplica*/}
                          <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-4">
                            <span style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '12px', color: '#64748b' }}>
                              {post.likes} Likes • {post.respuestas} respuestas • Compartir
                            </span>

                            {/*el botón reportar solo aparece en publicaciones ciudadanas, no en las oficiales.
                              incluye una aclaración en rojo de qué implica reportar*/}
                            {post.mostrarBotonReportar && (
                              <div className="flex flex-col items-end gap-1">
                                <IonButton
                                  onClick={() => handleReportar()}
                                  style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '32px', fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '13px', textTransform: 'none', margin: 0 }}
                                >
                                  Reportar
                                </IonButton>
                                <p className="font-slab text-[11px] text-red-600 m-0 text-right">
                                  notificará a los moderadores municipales
                                </p>
                              </div>
                            )}
                          </div>

                        </IonCardContent>
                      </IonCard>
                    </RevealWrapper>
                  ))}

                </IonCol>

                {/*barra lateral con categorías, línea directa y próximos operativos*/}
                <IonCol size="12" sizeLg="5" sizeXl="4" className="flex flex-col gap-6">

                  {/*categorías disponibles con contador de publicaciones por tipo*/}
                  <RevealWrapper delay={150}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                          Categorías
                        </h2>
                        <div className="flex flex-col">
                          {categorias.map((cat, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors duration-150 rounded px-1">
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '14px', color: '#475569' }}>
                                {cat.nombre}
                              </span>
                              <div style={{ backgroundColor: cat.bg, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '12px', color: cat.color }}>
                                  {cat.cantidad}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*contacto directo con la municipalidad para situaciones urgentes*/}
                  <RevealWrapper delay={250}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '8px' }}>
                          Línea Directa
                        </h2>
                        <p style={{ fontFamily: 'Roboto Slab', fontWeight: 500, fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
                          ¿Situación urgente? Contáctanos directamente.
                        </p>
                        <div className="flex flex-col gap-3">
                          <IonButton expand="block" style={{ '--background': '#B01717', '--color': '#ffffff', '--border-radius': '6px', height: '44px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                            Llamar ahora
                          </IonButton>
                          <IonButton expand="block" fill="outline" style={{ '--border-radius': '6px', '--border-color': '#94a3b8', '--border-width': '2px', '--color': '#334155', height: '44px', fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '15px', textTransform: 'none', margin: 0 }}>
                            WhatsApp Municipalidad
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                  {/*calendario de los próximos operativos veterinarios en la comuna*/}
                  <RevealWrapper delay={350}>
                    <IonCard className="m-0 shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '8px' }}>
                      <IonCardContent className="p-6">
                        <h2 style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '18px', color: '#000000', marginBottom: '20px' }}>
                          Próximos operativos
                        </h2>
                        <div className="flex flex-col">
                          {proximosOperativos.map((op, index) => (
                            <div key={index} className="flex gap-4 items-center py-3 border-b border-gray-100 last:border-0">
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 700, fontSize: '14px', color: '#64748b', minWidth: '55px' }}>
                                {op.fecha}
                              </span>
                              <span style={{ fontFamily: 'Roboto Slab', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                                — {op.titulo}
                              </span>
                            </div>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </RevealWrapper>

                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>

        {/*toast para confirmaciones de publicación y reporte*/}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={3500}
          position="bottom"
          color={toastColor}
        />

      </IonContent>
    </IonPage>
  );
};

export default Foro;
