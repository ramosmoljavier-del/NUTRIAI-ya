
import React from 'react';
import { DietType } from '../types';
import Logo from '../components/Logo';

interface DietPreferenceProps {
  onSelect: (type: DietType) => void;
}

const DietPreference: React.FC<DietPreferenceProps> = ({ onSelect }) => {
  const options: { id: DietType, name: string, icon: string, desc: string }[] = [
    { id: 'high_protein', name: 'Proteico', icon: '🥩', desc: 'Maximiza el crecimiento muscular y la saciedad.' },
    { id: 'balanced', name: 'Equilibrado', icon: '🥗', desc: 'Nutrición óptima con todos los grupos de alimentos.' },
    { id: 'keto', name: 'Keto', icon: '🥑', desc: 'Bajo en carbohidratos para quemar grasa eficientemente.' },
    { id: 'vegan', name: 'Vegano', icon: '🥦', desc: 'Dieta basada íntegramente en fuentes vegetales.' },
    { id: 'mediterranean', name: 'Mediterráneo', icon: '🥘', desc: 'Famosa por su equilibrio y grasas saludables.' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-5xl animate-fadeIn relative z-10">
        <div className="text-center mb-12">
          <Logo size="lg" className="mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-3 tracking-tight">Elige tu Enfoque</h2>
          <p className="text-slate-400 text-lg font-medium">Personalizaremos cada gramo según tu elección.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="group bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all text-left flex flex-col items-start shadow-xl relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
              <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform duration-500">{opt.icon}</span>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{opt.name}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">{opt.desc}</p>
              <div className="mt-auto text-[10px] font-black tracking-widest text-emerald-400 uppercase opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                SELECCIONAR →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietPreference;
