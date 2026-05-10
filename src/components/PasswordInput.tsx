import React, { useState } from 'react';
import { IonInput } from '@ionic/react';
import { authInputStyle } from './styles';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 el show-hide del password, maneja su propia visibilidad.
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  label, value, onChange, required, className = '',
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      <p className="font-slab font-medium text-[13px] text-black uppercase mb-2 m-0">
        {label}
      </p>
      <div className="relative">
        <IonInput
          type={show ? 'text' : 'password'}
          value={value}
          onIonChange={e => onChange(e.detail.value!)}
          required={required}
          style={{ ...authInputStyle, '--padding-end': '75px' } as React.CSSProperties}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer z-10
                     font-slab font-medium text-[13px] text-link-blue/70 p-0"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
