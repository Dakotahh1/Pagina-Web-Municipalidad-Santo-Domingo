/*servicio de autenticación.
  centraliza la lógica de login, registro y validación de credenciales.
  por ahora usa datos locales — en la entrega parcial 2 se conectará con la API REST.

  estructura preparada para JWT: las funciones devuelven promesas como si fueran
  llamadas HTTP, facilitando la migración al backend real*/

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'vecino' | 'funcionario';
}

export interface RegisterData {
  nombre: string;
  rut: string;
  correo: string;
  password: string;
  region: string;
  comuna: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

/*simula un login contra el backend. en EP2 se reemplaza por fetch a /api/auth/login*/
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({
          success: true,
          message: 'Inicio de sesión exitoso',
          token: 'mock-jwt-token-' + Date.now(),
        });
      } else {
        resolve({ success: false, message: 'Credenciales inválidas' });
      }
    }, 500);
  });
};

/*simula un registro de vecino. en EP2 se reemplaza por fetch a /api/auth/register*/
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.correo && data.password && data.rut) {
        resolve({ success: true, message: 'Registro exitoso' });
      } else {
        resolve({ success: false, message: 'Datos incompletos' });
      }
    }, 500);
  });
};
