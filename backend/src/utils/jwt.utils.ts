import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

//─────────────────────────────────────────────────────────────────────────────
//UTILIDADES JWT
//Centraliza la firma y verificación para que cambiar la lógica sea en un solo lugar.
// ─────────────────────────────────────────────────────────────────────────────

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no está definido en .env');
  return secret;
};

/*
Genera un JWT firmado con los datos del usuario.
Expira según JWT_EXPIRES_IN en .env (por defecto 8h).

 */
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    // El cast es necesario: @types/jsonwebtoken tipa expiresIn como
    // `number | StringValue`, y el valor llega como string desde el entorno.
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as SignOptions['expiresIn'],
    issuer: 'bienestar-animal-muni-sd',
  };
  return jwt.sign(payload, getSecret(), options);
};

/*
Verifica y decodifica un JWT.
Lanza JsonWebTokenError si fue manipulado.
Lanza TokenExpiredError si expiró.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};

/*
Extrae el token del header Authorization: Bearer <token>
Retorna null si el formato es incorrecto o el header no existe.
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  return token.length > 0 ? token : null;
};