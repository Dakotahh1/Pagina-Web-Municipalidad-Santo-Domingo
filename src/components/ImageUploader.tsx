/**
 * ImageUploader.tsx
 * ───────────────────
 * Componente reutilizable de Ionic/React para seleccionar y subir
 * imágenes a Cloudinary mediante uploadService.
 *
 * Uso:
 *   <ImageUploader
 *     folder="animales"
 *     onUploaded={(url) => setImagenes([...imagenes, url])}
 *   />
 *
 * Requiere que el AuthContext exponga el token JWT del usuario.
 */

import React, { useRef, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonProgressBar,
  IonThumbnail,
  IonImg,
  IonText,
} from '@ionic/react';
import { cloudUploadOutline, closeCircle } from 'ionicons/icons';
import { uploadImage, UploadFolder } from '../services/uploadService';
import { useAuth } from '../context/AuthContext'; // ajusta la ruta según tu proyecto

interface ImageUploaderProps {
  folder: UploadFolder;
  /** Se llama con la URL pública cuando la subida termina con éxito */
  onUploaded: (url: string) => void;
  /** Texto del botón (opcional) */
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  folder,
  onUploaded,
  label = 'Subir foto',
}) => {
  const { token } = useAuth(); // asume que AuthContext expone { token }
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview]   = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validación básica en el cliente
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10 MB
      setError('La imagen no debe superar los 10 MB');
      return;
    }

    // Preview local inmediato
    setPreview(URL.createObjectURL(file));
    setProgress(0);

    try {
      if (!token) throw new Error('Debes iniciar sesión para subir imágenes');

      const url = await uploadImage(file, folder, token, setProgress);
      onUploaded(url);
      setProgress(null);
    } catch (err) {
      console.error('[ImageUploader] Error subiendo imagen:', err);
      setError('No se pudo subir la imagen. Intenta nuevamente.');
      setProgress(null);
      setPreview(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setProgress(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {!preview && (
        <IonButton expand="block" fill="outline" onClick={() => inputRef.current?.click()}>
          <IonIcon icon={cloudUploadOutline} slot="start" />
          {label}
        </IonButton>
      )}

      {preview && (
        <div style={{ position: 'relative' }}>
          <IonThumbnail style={{ width: '100%', height: '160px' }}>
            <IonImg src={preview} />
          </IonThumbnail>

          {progress !== null && progress < 100 && (
            <IonProgressBar value={progress / 100} />
          )}

          {progress === null && (
            <IonButton
              fill="clear"
              size="small"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={handleClear}
            >
              <IonIcon icon={closeCircle} slot="icon-only" color="danger" />
            </IonButton>
          )}
        </div>
      )}

      {error && (
        <IonText color="danger">
          <p style={{ fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </IonText>
      )}
    </div>
  );
};
