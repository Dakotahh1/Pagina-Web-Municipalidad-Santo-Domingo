import React from 'react';
import { IonCol } from '@ionic/react';

export interface StatItem {
  value: string;
  label: string;
}

interface AuthHeroPanelProps {
  stats: StatItem[];
}

/**
 *panel izquierdo de login y registro
 *acepta "stats" y cada página puede usar sus KPIs (indicadores)
 */
const AuthHeroPanel: React.FC<AuthHeroPanelProps> = ({ stats }) => (
  <IonCol
    size="0" sizeMd="5" sizeLg="6"
    className="bg-muni-blue hidden md:flex flex-col justify-between p-12 h-full sticky top-0"
  >
    {/*logo*/}
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-[#7ac29a] flex items-center justify-center overflow-hidden shrink-0">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <div className="flex flex-col">
        <h2 className="font-slab font-extrabold text-base text-white m-0 mb-0.5">
          Bienestar Animal
        </h2>
        <p className="font-slab font-normal text-sm text-white m-0">
          Municipalidad de Santo Domingo
        </p>
      </div>
    </div>

    {/*tag*/}
    <div>
      <h1 className="font-display font-extrabold text-5xl text-white leading-tight mb-6">
        La tenencia<br />responsable<br />
        <span className="text-muni-orange italic">empieza aquí.</span>
      </h1>
      <p className="font-slab font-normal text-sm text-white max-w-sm leading-relaxed m-0">
        Gestiona reportes, busca fichas animales, infórmate acerca de operativos
        y adopciones desde una sola plataforma municipal.
      </p>
    </div>

    {/*Kpi*/}
    <div className="flex gap-4 mt-8 w-full max-w-[600px]">
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl p-5 flex flex-col items-start shadow-sm"
        >
          <h3 className="font-slab font-extrabold text-4xl text-white m-0 mb-1 leading-none">
            {value}
          </h3>
          <p className="font-slab font-normal text-sm text-white m-0">{label}</p>
        </div>
      ))}
    </div>
  </IonCol>
);

export default AuthHeroPanel;
