import React from 'react';
import {
  IonPage, IonContent,
  IonCard, IonCardContent,
  IonGrid, IonRow, IonCol
} from '@ionic/react';
import NavBar from '../../components/NavBar';
import RevealWrapper from '../../components/RevealWrapper';

/*página del directorio de contactos institucionales (RF06).
  muestra los contactos de clínicas veterinarias, la municipalidad y organismos de zoonosis.
  los datos están hardcodeados hasta conectar con el backend en EP2*/

const Directorio: React.FC = () => {

  const contactos = [
    { nombre: 'Unidad de Bienestar Animal',       telefono: '+56 9 1234 5678', horario: 'Lun-Vie 08:30 – 17:30', tipo: 'Municipal' },
    { nombre: 'Clínica Veterinaria Santo Domingo', telefono: '+56 9 8765 4321', horario: 'Lun-Sáb 09:00 – 19:00', tipo: 'Veterinaria' },
    { nombre: 'Servicio Agrícola y Ganadero (SAG)', telefono: '600 600 0526',   horario: 'Lun-Vie 09:00 – 14:00', tipo: 'Zoonosis' },
    { nombre: 'Carabineros — Tenencia responsable', telefono: '133',            horario: '24 horas',              tipo: 'Emergencias' },
    { nombre: 'Oficina de Medio Ambiente',          telefono: '+56 9 1111 2222', horario: 'Lun-Vie 08:30 – 14:00', tipo: 'Municipal' },
    { nombre: 'Hospital Veterinario PUCV',          telefono: '+56 32 227 4590', horario: 'Lun-Vie 08:00 – 18:00', tipo: 'Veterinaria' },
  ];

  const coloresTipo: Record<string, { bg: string; color: string }> = {
    'Municipal':   { bg: '#dbeafe', color: '#1e40af' },
    'Veterinaria': { bg: '#dcfce7', color: '#166534' },
    'Zoonosis':    { bg: '#fef9c3', color: '#854d0e' },
    'Emergencias': { bg: '#fecaca', color: '#991b1b' },
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen style={{ '--background': '#f8fafc' }}>
        <div style={{ backgroundColor: '#eef6fc', padding: '48px 32px' }}>
          <RevealWrapper>
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
              <span className="font-slab font-bold text-[11px] text-gray-500 uppercase tracking-widest block mb-2">
                Recursos
              </span>
              <h1 className="font-slab font-bold text-4xl text-gray-800 mb-2">
                Directorio de Contactos
              </h1>
              <p className="font-slab text-[15px] text-gray-500 m-0">
                Contactos institucionales para consultas sobre bienestar animal en la comuna.
              </p>
            </div>
          </RevealWrapper>
        </div>

        <div className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <IonGrid className="ion-no-padding">
              <IonRow>
                {contactos.map((contacto, idx) => {
                  const colorInfo = coloresTipo[contacto.tipo] || { bg: '#e5e7eb', color: '#374151' };
                  return (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={idx} className="p-3">
                      <RevealWrapper delay={idx * 80}>
                        <IonCard className="m-0 h-full shadow-sm border border-gray-200" style={{ '--background': '#ffffff', '--border-radius': '12px' }}>
                          <IonCardContent className="p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-slab font-bold text-base text-gray-800 m-0 flex-1 pr-2">
                                {contacto.nombre}
                              </h3>
                              <span style={{
                                backgroundColor: colorInfo.bg, color: colorInfo.color,
                                padding: '4px 12px', borderRadius: '16px',
                                fontFamily: "'Roboto Slab', serif", fontWeight: 600, fontSize: '11px',
                                whiteSpace: 'nowrap'
                              }}>
                                {contacto.tipo}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 mt-auto">
                              <p className="font-slab text-sm text-gray-600 m-0">
                                <span className="font-bold">Tel:</span> {contacto.telefono}
                              </p>
                              <p className="font-slab text-sm text-gray-600 m-0">
                                <span className="font-bold">Horario:</span> {contacto.horario}
                              </p>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </RevealWrapper>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Directorio;
