
import React, { useState, useEffect } from 'react';
import { generateDietPlan, generateShoppingList } from '../services/geminiService';
import { UserProfile, DietPlan, Meal } from '../types';

interface DietPlannerProps {
  initialProfile: UserProfile;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ initialProfile }) => {
  const [profile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile && !dietPlan) {
      handleGenerate();
    }
  }, [initialProfile]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setShoppingList(null);
    try {
      const plan = await generateDietPlan(profile);
      setDietPlan(plan);
    } catch (error) {
      console.error(error);
      alert("Error al conectar con la IA de nutrición.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetShoppingList = async () => {
    if (!dietPlan) return;
    setIsLoading(true);
    try {
      const list = await generateShoppingList(dietPlan);
      setShoppingList(list);
    } catch (error) {
      alert("Error al generar lista.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fadeIn">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl animate-pulse">🧠</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-emerald-400 font-black text-2xl tracking-tight">Diseñando tu Plan</p>
          <p className="text-slate-500 font-medium text-sm">Analizando macros e ingredientes favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-10">
      {dietPlan && (
        <div className="space-y-8">
          <div className="bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-slate-800/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/10 px-5 py-2 rounded-full mb-4 inline-block border border-emerald-500/20">Protocolo IA Activo</span>
                <h2 className="text-4xl font-black text-white capitalize leading-none tracking-tighter">Dieta {profile.dietType}</h2>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={handleGetShoppingList}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[2rem] font-black text-sm transition-all flex items-center shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-widest"
                >
                  🛒 Lista Compra
                </button>
                <button 
                  onClick={handleGenerate}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-[2rem] font-black text-xs border border-slate-700/50 uppercase tracking-widest transition-all"
                >
                  🔄 Regenerar
                </button>
              </div>
            </div>

            {shoppingList && (
              <div className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-blue-500/30 mb-12 animate-fadeIn relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">🛒</div>
                 <h3 className="font-black text-blue-400 mb-6 uppercase tracking-[0.2em] text-xs">Despensa Requerida</h3>
                 <pre className="text-slate-300 whitespace-pre-wrap font-sans text-base leading-relaxed">{shoppingList}</pre>
                 <button onClick={() => setShoppingList(null)} className="mt-8 text-[10px] text-slate-500 font-black hover:text-white underline uppercase tracking-widest">Ocultar Lista</button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Calorías', val: dietPlan.dailyCalories, unit: 'kcal', color: 'text-white' },
                { label: 'Proteína', val: dietPlan.macros.protein, unit: 'g', color: 'text-blue-400' },
                { label: 'Carbos', val: dietPlan.macros.carbs, unit: 'g', color: 'text-amber-400' },
                { label: 'Grasas', val: dietPlan.macros.fats, unit: 'g', color: 'text-rose-400' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/30 p-6 rounded-[2rem] border border-slate-700/30 group hover:border-emerald-500/30 transition-all shadow-inner">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">{item.label}</p>
                  <p className={`text-3xl font-black ${item.color} tracking-tighter`}>{item.val}<span className="text-xs text-slate-500 ml-1 uppercase">{item.unit}</span></p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {(Object.entries(dietPlan.meals) as [string, Meal][]).map(([type, meal]) => (
                <div key={type} className="group p-8 rounded-[2.5rem] bg-slate-800/20 border border-slate-800/50 hover:bg-slate-800/40 hover:border-emerald-500/20 transition-all flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 shadow-xl">
                  <div className="text-5xl bg-slate-900 p-6 rounded-[2rem] border border-slate-800 group-hover:scale-110 transition-transform shadow-2xl">
                    {type === 'breakfast' ? '🍳' : type === 'lunch' ? '🥘' : type === 'snack' ? '🍎' : '🥗'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-black text-white text-xl tracking-tight">{meal.name}</h4>
                      <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                        <span className="text-emerald-400 font-black text-sm">{meal.calories} <span className="text-[10px] opacity-70 uppercase ml-0.5">kcal</span></span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{meal.description}</p>
                    <div className="flex space-x-4 mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <span>P: {meal.protein}g</span>
                       <span>C: {meal.carbs}g</span>
                       <span>G: {meal.fats}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanner;
