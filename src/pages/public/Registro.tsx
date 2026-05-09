import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonInput,
  IonButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '', rut: '', correo: '', password: '', confirmPassword: '', region: '', comuna: '', terminos: false, novedades: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const history = useHistory();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Esto sera la lógica de registro dsps
    history.push('/login');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Estilo base para inputs 
  const inputStyle = {
    '--background': '#f3f4f6', '--padding-start': '16px', '--padding-end': '16px', '--border-radius': '6px',
    '--border-color': '#d1d5db', '--border-width': '1px', '--border-style': 'solid', '--color': '#000000',
    minHeight: '45px', fontFamily: "'Roboto Slab', serif", fontSize: '16px'
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-no-padding h-screen">
          <IonRow className="w-full h-full">
            
            {/* =======================================================
                COLUMNA IZQUIERDA: HERO Y ESTADÍSTICAS (Igual a Login)
            ======================================================= */}
            <IonCol size="0" sizeMd="5" sizeLg="6" className="bg-[#2d6aab] hidden md:flex flex-col justify-between p-12 h-full sticky top-0">
              
              {/* Header / Logo */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#7ac29a] flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.src = 'https://ionicframework.com/docs/img/demos/avatar.svg' }} />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '16px', color: '#FFFFFF', margin: '0 0 2px 0' }}>
                    Bienestar Animal
                  </h2>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                    Municipalidad de Santo Domingo
                  </p>
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="mt-6">
                <h1 style={{ 
                  fontFamily: "'Roboto Serif', serif", 
                  fontWeight: 800, 
                  fontSize: '48px', 
                  color: '#FFFFFF', 
                  lineHeight: '1.1', 
                  marginBottom: '24px' 
                }}>
                  La tenencia<br />
                  responsable<br />
                  <span style={{ color: '#FFA600', fontStyle: 'italic' }}>empieza aquí.</span>
                </h1>
                
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '16px', color: '#FFFFFF', maxWidth: '420px', lineHeight: '1.6', margin: 0 }}>
                  Gestiona reportes, busca fichas animales, infórmate acerca de operativos y adopciones desde una sola plataforma municipal.
                </p>
              </div>

              {/* KPIs / Cuadros Inferiores (Usando datos de ejemplo para registro) */}
              <div className="flex gap-4 mt-8 w-full max-w-[600px]">
                <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-5 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '42px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    1.2K
                  </h3>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                    Usuarios Activos
                  </p>
                </div>
                <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-5 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '42px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    500+
                  </h3>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                    Reportes Gestionados
                  </p>
                </div>
                <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-5 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '42px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    100%
                  </h3 >
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                    Cobertura Comunal
                  </p>
                </div>
              </div>
            </IonCol>

            {/* =======================================================
                COLUMNA DERECHA: FORMULARIO DE REGISTRO
            ======================================================= */}
            <IonCol size="12" sizeMd="7" sizeLg="6" className="bg-white flex flex-col h-full overflow-y-auto p-6 lg:p-12">
              <div className="w-full max-w-[460px] m-auto flex flex-col pt-4 pb-8">
                
                {/* Saludo */}
                <div className="mb-8 text-left">
                  <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', margin: '0 0 8px 0' }}>
                    Bienvenido/a
                  </h1>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#000000', margin: 0 }}>
                    Completa tus datos para registrarte como vecino/a
                  </p>
                </div>

                {/* Contenedor del Formulario */}
                <form onSubmit={handleRegister} className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  
                  {/* Nombre Completo */}
                  <div className="mb-4">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Nombre de Usuario / Alias
                    </IonLabel>
                    <IonInput type="text" value={formData.nombre} onIonChange={e => handleChange('nombre', e.detail.value!)} required style={inputStyle} />
                  </div>

                  {/* RUT */}
                  <div className="mb-4">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      RUT
                    </IonLabel>
                    <IonInput type="text" value={formData.rut} onIonChange={e => handleChange('rut', e.detail.value!)} required style={inputStyle} />
                  </div>

                  {/* Correo Electrónico */}
                  <div className="mb-4">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Correo Electrónico
                    </IonLabel>
                    <IonInput type="email" value={formData.correo} onIonChange={e => handleChange('correo', e.detail.value!)} required style={inputStyle} />
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4 relative">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Contraseña
                    </IonLabel>
                    <div className="relative">
                      <IonInput type={showPassword ? 'text' : 'password'} value={formData.password} onIonChange={e => handleChange('password', e.detail.value!)} required style={{...inputStyle, '--padding-end': '75px'}} />
                      <button type="button" onClick={togglePasswordVisibility} style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: 'rgba(22, 87, 172, 0.72)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10, padding: 0 }}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="mb-4 relative">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Confirmar Contraseña
                    </IonLabel>
                    <div className="relative">
                      <IonInput type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onIonChange={e => handleChange('confirmPassword', e.detail.value!)} required style={{...inputStyle, '--padding-end': '75px'}} />
                      <button type="button" onClick={toggleConfirmPasswordVisibility} style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: 'rgba(22, 87, 172, 0.72)', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10, padding: 0 }}>
                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>

                  {/* Región (Ejemplo simple) */}
                  <div className="mb-4">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Región
                    </IonLabel>
                    <div className="bg-[#f3f4f6] border border-[#d1d5db] rounded-lg px-4 flex items-center min-h-[45px]">
                      <IonSelect value={formData.region} onIonChange={e => handleChange('region', e.detail.value)} interface="popover" placeholder="Seleccionar..." className="w-full text-sm text-gray-900 font-['Roboto_Slab']" style={{ fontFamily: "'Roboto Slab', serif" }}>
                        <IonSelectOption value="metropolitana">Región Metropolitana</IonSelectOption>
                        <IonSelectOption value="valparaiso">Región de Valparaíso</IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>

                  {/* Comuna (Ejemplo simple) */}
                  <div className="mb-6">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      Comuna
                    </IonLabel>
                    <div className="bg-[#f3f4f6] border border-[#d1d5db] rounded-lg px-4 flex items-center min-h-[45px]">
                      <IonSelect value={formData.comuna} onIonChange={e => handleChange('comuna', e.detail.value)} interface="popover" placeholder="Seleccionar..." className="w-full text-sm text-gray-900 font-['Roboto_Slab']" style={{ fontFamily: "'Roboto Slab', serif" }}>
                        <IonSelectOption value="santo-domingo">Santo Domingo</IonSelectOption>
                        <IonSelectOption value="san-antonio">San Antonio</IonSelectOption>
                      </IonSelect>
                    </div>
                  </div>

                  {/* Checkboxes de Términos */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center">
                      <IonCheckbox checked={formData.terminos} onIonChange={e => handleChange('terminos', e.detail.checked)} className="mr-3" style={{ '--size': '18px', '--border-radius': '4px', '--checkbox-background-checked': '#2d6aab', '--border-color': '#d1d5db' }} />
                      <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#000000' }}>
                        Acepto los términos y condiciones de uso
                      </IonLabel>
                    </div>
                    <div className="flex items-start">
                      <IonCheckbox checked={formData.novedades} onIonChange={e => handleChange('novedades', e.detail.checked)} className="mr-3 mt-1" style={{ '--size': '18px', '--border-radius': '4px', '--checkbox-background-checked': '#2d6aab', '--border-color': '#d1d5db' }} />
                      <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#000000', lineHeight: 1.5 }}>
                        Deseo recibir novedades y notificaciones en mi correo electrónico
                      </IonLabel>
                    </div>
                  </div>

                  {/* Botón de Registro */}
                  <IonButton 
                    expand="block" 
                    type="submit" 
                    disabled={!formData.terminos} 
                    className="h-12 shadow-none mb-3"
                    style={{ '--background': '#2d6aab', '--border-radius': '6px', '--box-shadow': 'none', fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                  >
                    Registrarse
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    fill="outline" 
                    className="h-12 shadow-none"
                    style={{ '--color': '#000000', '--border-color': '#d1d5db', '--border-radius': '6px', '--border-width': '1px', fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
                  >
                    Registrarse con clave única
                  </IonButton>
                </form>

                {/* Enlace de volver a Login */}
                <div className="text-center mt-8 mb-8">
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#000000' }}>
                    ¿Ya tienes una cuenta?{' '}
                  </span>
                  <a href="/login" style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: 'rgba(27, 68, 151, 0.72)', textDecoration: 'none' }}>
                    Inicia sesión aquí
                  </a>
                </div>

                {/* Cuadro de Advertencia */}
                <div style={{ backgroundColor: '#eef6ff', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '13px', color: 'rgba(13, 52, 125, 0.52)', margin: 0, lineHeight: '1.6' }}>
                    Si usted es funcionario o administrador y no cuenta con sus datos de ingreso, contacte al administrador del sitio.
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="pt-2 pb-6 text-center w-full">
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#000000', margin: 0 }}>
                  © 2026 Municipalidad de Santo Domingo
                </p>
              </div>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Registro;