import { Request, Response, NextFunction } from 'express';

/*registra cada request entrante en la consola con timestamp.
  útil para depuración durante el desarrollo*/

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};
