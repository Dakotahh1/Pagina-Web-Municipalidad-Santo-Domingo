import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 *convierte inputs de auth a minus (lowercase). Usa classname o la clase padre lo manejar
 */
const FormField: React.FC<FormFieldProps> = ({ label, children, className = '' }) => (
  <div className={className}>
    <p className="font-slab font-medium text-[13px] text-black uppercase mb-2 m-0">
      {label}
    </p>
    {children}
  </div>
);

export default FormField;
