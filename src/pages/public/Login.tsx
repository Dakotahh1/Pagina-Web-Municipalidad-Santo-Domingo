import React, { useState } from 'react';
import { IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { UserRole } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import { AuthLayout, PasswordInput, FormField, SupportNote, AuthFooter } from '../../components';
import { authInputStyle } from '../../components/styles';

/*página de login. usa los componentes reutilizables AuthLayout y AuthHeroPanel
  para mantener consistencia visual con la página de registro.

  el login diferencia entre vecino y funcionario mediante los selectores de rol.
  al autenticarse, el contexto guarda el rol y la ruta protegida redirige según corresponda*/

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rolAcceso, setRolAcceso] = useState<UserRole>('vecino');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await loginUser({ email, password, role: rolAcceso! });
    setLoading(false);

    if (response.success) {
      login(rolAcceso);
      if (rolAcceso === 'funcionario') {
        history.push('/admin/dashboard');
      } else {
        history.push('/app/inicio');
      }
    }
  };

  /*kpis del panel izquierdo — datos de ejemplo de actividad municipal*/
  const stats = [
    { value: '847',  label: 'Animales Registrados' },
    { value: '56',   label: 'Adoptados este mes' },
    { value: '38',   label: 'Operativos realizados' },
  ];

  return (
    <AuthLayout stats={stats}>
      <div className="w-full max-w-[440px] m-auto flex flex-col">

        {/*saludo*/}
        <div className="mb-8 text-left">
          <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', margin: '0 0 8px 0' }}>
            Bienvenido/a
          </h1>
          <p className="font-slab font-normal text-xs text-black m-0">
            Selecciona tu tipo de acceso para continuar
          </p>
        </div>

        {/*selectores de rol*/}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {([
            { role: 'vecino' as UserRole, titulo: 'Vecino / Ciudadano', desc: 'Reportes, adopciones, foro' },
            { role: 'funcionario' as UserRole, titulo: 'Funcionario / Inspector', desc: 'Panel de gestión' },
          ]).map(({ role, titulo, desc }) => (
            <div
              key={role}
              onClick={() => setRolAcceso(role)}
              className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col justify-center outline-none ${
                rolAcceso === role ? 'border-muni-blue bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h3 className="font-slab font-black text-sm m-0 mb-1" style={{ color: rolAcceso === role ? '#2d6aab' : '#6b7280' }}>
                {titulo}
              </h3>
              <p className="font-slab font-medium text-sm m-0" style={{ color: rolAcceso === role ? '#6b7280' : '#9ca3af' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/*formulario de ingreso*/}
        <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

          <FormField label="RUT o Correo Electrónico" className="mb-6">
            <IonInput
              type="text"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              required
              style={authInputStyle}
            />
          </FormField>

          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={setPassword}
            required
            className="mb-6"
          />

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="h-12 shadow-none mb-3"
            style={{ '--background': '#2d6aab', '--border-radius': '6px', '--box-shadow': 'none', fontFamily: "'Roboto Slab', serif", fontWeight: 500, textTransform: 'none' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </IonButton>
        </form>

        {/*enlace a registro usando history.push en lugar de <a href>*/}
        <div className="text-center mt-8 mb-8">
          <span className="font-slab font-normal text-xs text-black">
            ¿No tienes cuenta?{' '}
          </span>
          <span
            onClick={() => history.push('/registro')}
            className="font-slab font-normal text-xs text-link-blue/70 underline cursor-pointer"
          >
            Regístrate aquí
          </span>
        </div>

        <SupportNote />
      </div>

      <AuthFooter />
    </AuthLayout>
  );
};

export default Login;
