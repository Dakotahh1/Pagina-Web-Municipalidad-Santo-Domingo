import { useEffect, useState } from 'react';

/* Hook que sincroniza un estado de React con localStorage (EF1 — almacenamiento local).
   Útil para persistir borradores de formularios o preferencias del usuario, de modo
   que sobrevivan a recargas o a navegación accidental. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Persiste cada cambio del valor.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento lleno o no disponible — se ignora silenciosamente */
    }
  }, [key, value]);

  // Elimina la clave del almacenamiento (p. ej. al enviar el formulario).
  const remove = () => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  };

  return [value, setValue, remove] as const;
}
