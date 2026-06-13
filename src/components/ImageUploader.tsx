import React, { useRef, useState } from 'react';
import { IonButton, IonIcon, IonProgressBar, IonText } from '@ionic/react';
import { cloudUploadOutline, closeCircle } from 'ionicons/icons';
import { uploadImagen, UploadFolder } from '../services/uploadService';
import { ApiError } from '../services/api';

/* Componente reutilizable para seleccionar y subir una imagen a Cloudinary (EF5).
   Muestra una vista previa local inmediata, una barra de progreso durante la
   subida y notifica la URL pública resultante mediante `onUploaded`. */

interface ImageUploaderProps {
  folder: UploadFolder;
  /* Se invoca con la URL pública cuando la subida termina con éxito. */
  onUploaded: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ folder, onUploaded, label = 'Subir foto' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Validación en el cliente antes de gastar ancho de banda.
    if (!file.type.startsWith('image/')) { setError('El archivo debe ser una imagen.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('La imagen no debe superar los 10 MB.'); return; }

    setPreview(URL.createObjectURL(file));
    setProgress(0);
    try {
      const url = await uploadImagen(file, folder, setProgress);
      onUploaded(url);
      setProgress(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo subir la imagen. Intenta nuevamente.');
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
        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
          <img src={preview} alt="Vista previa" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />

          {progress !== null && progress < 100 && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <IonProgressBar value={progress / 100} />
            </div>
          )}

          {progress === null && (
            <IonButton
              fill="clear"
              size="small"
              style={{ position: 'absolute', top: '4px', right: '4px', '--padding-start': '4px', '--padding-end': '4px' }}
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

export default ImageUploader;
