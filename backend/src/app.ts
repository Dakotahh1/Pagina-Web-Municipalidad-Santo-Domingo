import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import animalesRoutes from './routes/animalesRoutes';
import reportesRoutes from './routes/reportesRoutes';
import adopcionesRoutes from './routes/adopcionesRoutes';
import operativosRoutes from './routes/operativosRoutes';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8100' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Healthcheck para verificar que el servidor responde
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'OK', timestamp: new Date().toISOString() },
    message: 'Servicio activo'
  });
});

// Montaje de rutas por recurso
app.use('/api/auth', authRoutes);
app.use('/api/animales', animalesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/adopciones', adopcionesRoutes);
app.use('/api/operativos', operativosRoutes);

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
