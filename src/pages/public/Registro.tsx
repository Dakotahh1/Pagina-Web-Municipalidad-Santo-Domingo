import React, { useState } from 'react';
import {
  IonInput, IonButton, IonSelect, IonSelectOption, IonCheckbox, IonLabel, IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { registerVecino } from '../../services/authService';
import { ApiError } from '../../services/api';
import { AuthLayout, FormField, PasswordInput, SupportNote, AuthFooter } from '../../components';
import { authInputStyle } from '../../components/styles';

/* Página de registro de vecinos (EP 2.5 / 2.6).
   Incluye todos los campos requeridos por EP 1.3 (nombre, RUT, correo, contraseña,
   confirmación, región, comuna, términos). Valida la coincidencia de contraseñas en
   el cliente y delega el resto de validaciones (formato de RUT, correo, hash bcrypt)
   al backend. Tras un registro exitoso inicia sesión automáticamente. */

// Mapea los valores de los selects a los nombres legibles que persiste el backend.
const REGIONES: Record<string, string> = {
  valparaiso: 'Valparaíso',
  metropolitana: 'Metropolitana',
  ohiggins: "O'Higgins",
};
const COMUNAS: Record<string, string> = {
  'santo-domingo': 'Santo Domingo',
  'san-antonio': 'San Antonio',
  cartagena: 'Cartagena',
};

const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '', rut: '', correo: '', password: '', confirmPassword: '',
    region: '', comuna: '', terminos: false, novedades: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones visuales en el cliente antes de llamar al backend.
    if (!formData.region || !formData.comuna) {
      setError('Selecciona tu región y comuna.');
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerVecino({
        nombre: formData.nombre,
        rut: formData.rut,
        correo: formData.correo,
        password: formData.password,
        region: REGIONES[formData.region] ?? formData.region,
        comuna: COMUNAS[formData.comuna] ?? formData.comuna,
      });

      // El backend devuelve sesión iniciada: guardamos el JWT y entramos directo.
      login(data.token, data.user);
      history.replace('/app/inicio');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: '1.2K', label: 'Usuarios Activos' },
    { value: '500+', label: 'Reportes Gestionados' },
    { value: '100%', label: 'Cobertura Comunal' },
  ];

  return (
    <AuthLayout stats={stats}>
      <div className="w-full max-w-[460px] m-auto flex flex-col pt-4 pb-8">

        <div className="mb-8 text-left">
          <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: '32px', color: '#000000', margin: '0 0 8px 0' }}>
            Bienvenido/a
          </h1>
          <p className="font-slab font-normal text-sm text-black m-0">
            Completa tus datos para registrarte como vecino/a
          </p>
        </div>

        <form onSubmit={handleRegister} className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

          <FormField label="Nombre de Usuario" className="mb-4">
            <IonInput type="text" value={formData.nombre} onIonChange={e => handleChange('nombre', e.detail.value!)} required style={authInputStyle} />
          </FormField>

          <FormField label="RUT" className="mb-4">
            <IonInput type="text" value={formData.rut} onIonChange={e => handleChange('rut', e.detail.value!)} placeholder="12.345.678-9" required style={authInputStyle} />
          </FormField>

          <FormField label="Correo Electrónico" className="mb-4">
            <IonInput type="email" value={formData.correo} onIonChange={e => handleChange('correo', e.detail.value!)} required style={authInputStyle} />
          </FormField>

          <PasswordInput label="Contraseña" value={formData.password} onChange={v => handleChange('password', v)} required className="mb-4" />

          <PasswordInput label="Confirmar Contraseña" value={formData.confirmPassword} onChange={v => handleChange('confirmPassword', v)} required className="mb-4" />

          <FormField label="Región" className="mb-4">
            <div className="bg-[#f3f4f6] border border-[#d1d5db] rounded-lg px-4 flex items-center min-h-[45px]">
              <IonSelect value={formData.region} onIonChange={e => handleChange('region', e.detail.value)} interface="popover" placeholder="Seleccionar..." className="w-full text-sm text-gray-900 font-['Roboto_Slab']">
                <IonSelectOption value="valparaiso">Región de Valparaíso</IonSelectOption>
                <IonSelectOption value="metropolitana">Región Metropolitana</IonSelectOption>
                <IonSelectOption value="ohiggins">Región de O'Higgins</IonSelectOption>
              </IonSelect>
            </div>
          </FormField>

          <FormField label="Comuna" className="mb-6">
            <div className="bg-[#f3f4f6] border border-[#d1d5db] rounded-lg px-4 flex items-center min-h-[45px]">
              <IonSelect value={formData.comuna} onIonChange={e => handleChange('comuna', e.detail.value)} interface="popover" placeholder="Seleccionar..." className="w-full text-sm text-gray-900 font-['Roboto_Slab']">
                <IonSelectOption value="santo-domingo">Santo Domingo</IonSelectOption>
                <IonSelectOption value="san-antonio">San Antonio</IonSelectOption>
                <IonSelectOption value="cartagena">Cartagena</IonSelectOption>
              </IonSelect>
            </div>
          </FormField>

          <div className="space-y-3 mb-8">
            <div className="flex items-center">
              <IonCheckbox checked={formData.terminos} onIonChange={e => handleChange('terminos', e.detail.checked)} className="mr-3" style={{ '--size': '18px', '--border-radius': '4px', '--checkbox-background-checked': '#2d6aab', '--border-color': '#d1d5db' } as React.CSSProperties} />
              <IonLabel className="font-slab font-normal text-sm text-black">
                Acepto los términos y condiciones de uso
              </IonLabel>
            </div>
            <div className="flex items-start">
              <IonCheckbox checked={formData.novedades} onIonChange={e => handleChange('novedades', e.detail.checked)} className="mr-3 mt-1" style={{ '--size': '18px', '--border-radius': '4px', '--checkbox-background-checked': '#2d6aab', '--border-color': '#d1d5db' } as React.CSSProperties} />
              <IonLabel className="font-slab font-normal text-sm text-black" style={{ lineHeight: 1.5 }}>
                Deseo recibir novedades y notificaciones en mi correo electrónico
              </IonLabel>
            </div>
          </div>

          <IonButton
            expand="block" type="submit" disabled={!formData.terminos || loading}
            className="h-12 shadow-none mb-3"
            style={{ '--background': '#2d6aab', '--border-radius': '6px', '--box-shadow': 'none', fontFamily: "'Roboto Slab', serif", fontWeight: 500, fontSize: '16px', textTransform: 'none' }}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </IonButton>
        </form>

        <div className="text-center mt-8 mb-8">
          <span className="font-slab font-normal text-sm text-black">¿Ya tienes una cuenta?{' '}</span>
          <span
            onClick={() => history.push('/login')}
            className="font-slab font-medium text-sm text-link-blue/70 cursor-pointer"
          >
            Inicia sesión aquí
          </span>
        </div>

        <SupportNote />
      </div>

      <AuthFooter />

      {/*notificación de error de validación o de registro del backend*/}
      <IonToast
        isOpen={Boolean(error)}
        onDidDismiss={() => setError('')}
        message={error}
        duration={3500}
        position="top"
        color="danger"
      />
    </AuthLayout>
  );
};

export default Registro;
