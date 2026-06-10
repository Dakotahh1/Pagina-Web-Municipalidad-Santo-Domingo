import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import animalesRoutes from './routes/animalesRoutes';
import reportesRoutes from './routes/reportesRoutes';
import adopcionesRoutes from './routes/adopcionesRoutes';
import operativosRoutes from './routes/operativosRoutes';
import foroRoutes from './routes/foroRoutes';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter';

const app: Application = express();

// Cabeceras de seguridad HTTP (XSS, clickjacking, sniffing, etc.) — EF3.
// crossOriginResourcePolicy: 'cross-origin' permite que el frontend consuma la API.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Orígenes permitidos por CORS (lista separada por comas en CORS_ORIGIN).
// Por defecto admite `ionic serve` (8100) y `vite` (5173).
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8100,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origin (Postman, curl) y, en desarrollo, cualquier
    // puerto de localhost (evita errores de CORS si Vite cambia de puerto).
    if (!origin) return callback(null, true);
    const esLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && esLocalhost)) {
      return callback(null, true);
    }
    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Limitador general de tasa para toda la API (EF3).
app.use('/api', apiLimiter);

// Healthcheck para verificar que el servidor responde
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'OK', timestamp: new Date().toISOString() },
    message: 'Servicio activo'
  });
});

// Montaje de rutas por recurso.
// Las rutas de autenticación llevan un limitador estricto (anti fuerza bruta).
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/animales', animalesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/adopciones', adopcionesRoutes);
app.use('/api/operativos', operativosRoutes);
app.use('/api/foro', foroRoutes);

// 404 — cualquier ruta no registrada cae aquí
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: 'ROUTE_NOT_FOUND', message: 'Endpoint no encontrado' }
  });
});

// Manejador global de errores (debe ir al final)
app.use(errorHandler);

export default app;
