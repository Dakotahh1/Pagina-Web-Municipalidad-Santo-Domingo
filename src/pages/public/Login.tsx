import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonInput,
  IonButton,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rolAcceso, setRolAcceso] = useState<'vecino' | 'funcionario'>('vecino');
  
  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    if (rolAcceso === 'funcionario') {
      history.push('/admin/dashboard');
    } else {
      history.push('/app/inicio');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-no-padding h-screen">
          <IonRow className="w-full h-full">
            
            {/* =======================================================
                COLUMNA IZQUIERDA: HERO Y ESTADÍSTICAS
            ======================================================= */}
            <IonCol size="0" sizeMd="5" sizeLg="6" className="bg-[#2d6aab] hidden md:flex flex-col justify-between p-12 h-full">
              
              {/* Header / Logo */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#7ac29a] flex items-center justify-center overflow-hidden">
                  <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div className="flex flex-col">
                  <h2 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '16px', color: '#FFFFFF', margin: '0 0 2px 0' }}>
                    Bienestar Animal
                  </h2>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                    Municipalidad de Santo Domingo
                  </p>
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="mt-4">
                <h1 style={{ 
                  fontFamily: "'Roboto Serif', serif", 
                  fontWeight: 800, 
                  fontSize: '40px', 
                  color: '#FFFFFF', 
                  lineHeight: '1.1', 
                  marginBottom: '24px' 
                }}>
                  La tenencia<br />
                  responsable<br />
                  <span style={{ color: '#FFA600', fontStyle: 'italic' }}>empieza aquí.</span>
                </h1>
                
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '14px', color: '#FFFFFF', maxWidth: '380px', lineHeight: '1.6' }}>
                  Gestiona reportes, busca fichas animales, infórmate acerca de operativos y adopciones desde una sola plataforma municipal.
                </p>
              </div>

              {/* KPIs / Cuadros Inferiores */}
              <div className="flex gap-4 mt-8 w-full max-w-[550px]">
                <div className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    847
                  </h3>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#FFFFFF', margin: 0 }}>
                    Animales Registrados
                  </p>
                </div>
                <div className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    56
                  </h3>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#FFFFFF', margin: 0 }}>
                    Adoptados este mes
                  </p>
                </div>
                <div className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 flex flex-col items-start text-left shadow-sm">
                  <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 800, fontSize: '36px', color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1 }}>
                    38
                  </h3>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#FFFFFF', margin: 0 }}>
                    Operativos realizados
                  </p>
                </div>
              </div>
            </IonCol>

            {/* =======================================================
                COLUMNA DERECHA: FORMULARIO DE INGRESO
            ======================================================= */}
            <IonCol size="12" sizeMd="7" sizeLg="6" className="bg-white flex flex-col h-full overflow-y-auto p-6 lg:p-12">
              <div className="w-full max-w-[440px] m-auto flex flex-col">
                
                {/* Saludo */}
                <div className="mb-8 text-left">
                  <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', margin: '0 0 8px 0' }}>
                    Bienvenido/a
                  </h1>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000', margin: 0 }}>
                    Selecciona tu tipo de acceso para continuar
                  </p>
                </div>

                {/* Selectores de Rol */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div 
                    onClick={() => setRolAcceso('vecino')}
                    className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-center outline-none ${
                      rolAcceso === 'vecino' ? 'border-[#2d6aab] bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 900, fontSize: '14px', color: rolAcceso === 'vecino' ? '#2d6aab' : '#6b7280', margin: '0 0 4px 0' }}>
                      Vecino / Ciudadano
                    </h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: rolAcceso === 'vecino' ? '#6b7280' : '#9ca3af', margin: 0 }}>
                      Reportes, adopciones, foro
                    </p>
                  </div>

                  <div 
                    onClick={() => setRolAcceso('funcionario')}
                    className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-center outline-none ${
                      rolAcceso === 'funcionario' ? 'border-[#2d6aab] bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 900, fontSize: '14px', color: rolAcceso === 'funcionario' ? '#2d6aab' : '#6b7280', margin: '0 0 4px 0' }}>
                      Funcionario / Inspector
                    </h3>
                    <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '14px', color: rolAcceso === 'funcionario' ? '#6b7280' : '#9ca3af', margin: 0 }}>
                      Panel de gestión
                    </p>
                  </div>
                </div>

                {/* Contenedor del Formulario */}
                <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  
                  {/* Input Email/Rut */}
                  <div className="mb-6">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      RUT O CORREO ELECTRÓNICO
                    </IonLabel>
                    <IonInput 
                      type="text" 
                      value={email} 
                      onIonChange={e => setEmail(e.detail.value!)} 
                      required 
                      style={{
                        '--background': '#f3f4f6', '--padding-start': '16px', '--border-radius': '6px',
                        '--border-color': '#d1d5db', '--border-width': '1px', '--border-style': 'solid',
                        '--color': '#000000', minHeight: '45px', fontFamily: "'Roboto Slab', serif"
                      }}
                    />
                  </div>

                  {/* Input Contraseña */}
                  <div className="mb-6 relative">
                    <IonLabel style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#000000', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                      CONTRASEÑA
                    </IonLabel>
                    <div className="relative">
                      <IonInput 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onIonChange={e => setPassword(e.detail.value!)} 
                        required 
                        style={{
                          '--background': '#f3f4f6', '--padding-start': '16px', '--padding-end': '70px',
                          '--border-radius': '6px', '--border-color': '#d1d5db', '--border-width': '1px',
                          '--border-style': 'solid', '--color': '#000000', minHeight: '45px', fontFamily: "'Roboto Slab', serif"
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#1657AC', opacity: 0.72, position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    
                    {/* ¿Olvidaste tu contraseña? */}
                    <div className="text-right mt-3">
                      <a href="#" style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#1657AC', opacity: 0.72, textDecoration: 'none' }}>
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <IonButton 
                    expand="block" 
                    type="submit" 
                    className="h-12 shadow-none mb-3"
                    style={{ '--background': '#2d6aab', '--border-radius': '6px', '--box-shadow': 'none', fontFamily: "'Roboto Slab', serif", fontWeight: 500, textTransform: 'none' }}
                  >
                    Ingresar
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    fill="outline" 
                    className="h-12 shadow-none"
                    style={{ '--color': '#000000', '--border-color': '#d1d5db', '--border-radius': '6px', '--border-width': '1px', fontFamily: "'Roboto Slab', serif", fontWeight: 500, textTransform: 'none' }}
                  >
                    Ingresar con clave única
                  </IonButton>
                </form>

                {/* Enlace de Registro */}
                <div className="text-center mt-8 mb-8">
                  <span style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#000000' }}>
                    ¿No tienes cuenta?{' '}
                  </span>
                  <a href="/registro" style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 400, fontSize: '12px', color: '#1B4497', opacity: 0.72, textDecoration: 'underline' }}>
                    Regístrate aquí
                  </a>
                </div>

                {/* Cuadro de Advertencia */}
                <div style={{ backgroundColor: '#eef6ff', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '12px', color: '#0D347D', opacity: 0.52, margin: 0, lineHeight: '1.5' }}>
                    Si usted es funcionario o administrador y no cuenta con sus datos de ingreso, contacte al administrador del sitio.
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="pt-8 pb-4 text-center w-full">
                <p style={{ fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '10px', color: '#000000', margin: 0 }}>
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

export default Login;