
import React from 'react';
import { DietType } from '../types';
import Logo from '../components/Logo';

interface FoodCatalogProps {
  dietType: DietType;
  onContinue: () => void;
}

const FoodCatalog: React.FC<FoodCatalogProps> = ({ dietType, onContinue }) => {
  const foodData = {
    proteinas: ['Pollo', 'Pavo', 'Huevo', 'Atún', 'Ternera magra', 'Salmón', 'Tofu', 'Lentejas', 'Garbanzos', 'Proteína de Suero', 'Sardinas'],
    vegetales: ['Lechuga', 'Tomate', 'Espinacas', 'Brócoli', 'Zanahoria', 'Pimiento', 'Pepino', 'Calabacín', 'Espárragos', 'Champiñones', 'Coliflor'],
    grasas: ['Aguacate', 'Nueces', 'Aceite de Oliva', 'Almendras', 'Semillas de Chía', 'Pistachos', 'Mantequilla de Cacahuete', 'Aceite de Coco'],
    carbohidratos: ['Arroz Integral', 'Quinoa', 'Avena', 'Batata', 'Legumbres', 'Frutos del bosque', 'Pasta Integral', 'Cuscús', 'Pan de Centeno']
  };

  const categories = [
    { name: 'Proteínas', items: foodData.proteinas, icon: '🍗', color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
    { name: 'Vegetales', items: foodData.vegetales, icon: '🥦', color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
    { name: 'Grasas Saludables', items: foodData.grasas, icon: '🥑', color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
    { name: 'Carbohidratos', items: foodData.carbohidratos, icon: '🍚', color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/20' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-y-auto text-white">
      <div className="w-full max-w-5xl animate-fadeIn py-10">
        <div className="text-center mb-10">
          <Logo size="md" className="mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-3 tracking-tight">Tu Guía de Alimentos</h2>
          <p className="text-slate-400 text-lg font-medium">Aquí tienes una base sólida para tu enfoque <span className="text-emerald-400 capitalize">{dietType.replace('_', ' ')}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((cat, idx) => (
            <div key={idx} className={`${cat.bg} p-8 rounded-[2.5rem] border ${cat.border} backdrop-blur-sm`}>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl">{cat.icon}</span>
                <h3 className={`text-2xl font-black ${cat.color}`}>{cat.name}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item, i) => (
                  <span key={i} className="bg-slate-900/80 px-4 py-2 rounded-xl text-sm font-bold border border-slate-800 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={onContinue}
            className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            ENTENDIDO, CONTINUAR →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCatalog;
