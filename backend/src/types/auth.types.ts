//─── Roles del sistema ────────────────────────────────────────────────────────
//Deben coincidir con los roles que ya usa authController.ts

export type UserRole = 'vecino' | 'funcionario' | 'inspector';

//─── Usuario en memoria (reemplazar por query SQL cuando haya BD)─────────────
export interface User {
  id: string;
  nombre: string;
  rut: string;
  correo: string;
  passwordHash: string; //NUNCA guardamos la contraseña en texto plano
  rol: UserRole;
  region: string;
  comuna: string;
  activo: boolean;
}

//───Lo que viaja DENTRO del JWT ─────────────────────────────────────────────
export interface JwtPayload {
  sub: string;     // id del usuario
  correo: string;
  rol: UserRole;
  iat?: number;    //issued at, lo agrega jwt.sign automáticamente
  exp?: number;    // expiration, lo agrega jwt.sign automáticamente
}

//─── Body del POST /api/auth/login ───────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

//─── Body del POST /api/auth/register ────────────────────────────────────────
export interface RegisterRequest {
  nombre: string;
  rut: string;
  correo: string;
  password: string;
  region: string;
  comuna: string;
}

//─── Extiende Express.Request para incluir el usuario autenticado ─────────────
//Permite usar req.usuario en cualquier controller después del middleware
declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}