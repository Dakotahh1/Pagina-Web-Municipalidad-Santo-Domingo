import React from 'react';

/**
 *infobox de guía para que el funcionario que no conoce sus datos o los ha perdido
 sepa qué debe hacer.
 */
const SupportNote: React.FC = () => (
  <div className="bg-[#eef6ff] rounded-lg p-4 text-center">
    <p className="font-slab font-medium text-[13px] text-[#0D347D]/50 m-0 leading-relaxed">
      Si usted es funcionario o administrador y no cuenta con sus datos de ingreso,
      contacte al administrador del sitio.
    </p>
  </div>
);

export default SupportNote;
