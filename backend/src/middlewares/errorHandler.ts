import { Request, Response, NextFunction } from 'express';

/*manejador global de errores. captura excepciones no controladas y devuelve
  una respuesta 500 con la estructura JSON estándar*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[ERROR]', err.message);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' }
  });
};
