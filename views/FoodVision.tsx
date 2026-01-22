
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodAnalysis } from '../types';

const FoodVision: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        performAnalysis(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeFoodImage(base64);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("No se pudo analizar la imagen. Asegúrate de que sea una foto clara de comida.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-[3rem] p-16 text-center hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group shadow-2xl"
        >
          <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all duration-500 shadow-lg shadow-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Análisis Visual</h2>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">Sube una fotografía de tu comida para desglosar sus ingredientes y carga calórica instantáneamente.</p>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button className="mt-10 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
            SELECCIONAR FOTO
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square bg-slate-900 border border-slate-800">
              <img src={image} alt="Food to analyze" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-white backdrop-blur-md">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                  <p className="font-black text-xl tracking-tight">Procesando píxeles...</p>
                </div>
              )}
            </div>
            <button 
              onClick={reset}
              className="w-full py-5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 font-black hover:bg-slate-800 hover:text-white transition-all tracking-tight"
            >
              PROBAR OTRA IMAGEN
            </button>
          </div>

          <div className="space-y-6">
            {analysis ? (
              <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-fadeIn">
                <div className="mb-8">
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-1 rounded-full uppercase tracking-widest border border-blue-500/20 mb-4 inline-block">Informe Generado</span>
                  <h3 className="text-4xl font-black text-white leading-tight">{analysis.dishName}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Calorías Est.</p>
                    <p className="text-3xl font-black text-white">{analysis.estimatedCalories} <span className="text-sm font-medium text-slate-500">kcal</span></p>
                  </div>
                  <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Confianza IA</p>
                    <p className="text-3xl font-black text-white">{Math.round(analysis.confidence * 100)}<span className="text-sm font-medium text-slate-500">%</span></p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                   <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Desglose de Macronutrientes</h4>
                   <div className="space-y-5">
                     {[
                       { label: 'Proteína', val: analysis.macros.protein, max: 50, color: 'bg-blue-500' },
                       { label: 'Carbohidratos', val: analysis.macros.carbs, max: 100, color: 'bg-amber-500' },
                       { label: 'Grasas', val: analysis.macros.fats, max: 30, color: 'bg-rose-500' }
                     ].map((macro) => (
                       <div key={macro.label}>
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-slate-300 font-bold">{macro.label}</span>
                           <span className="font-black text-white">{macro.val}g</span>
                         </div>
                         <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                           <div className={`${macro.color} h-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ width: `${Math.min((macro.val / macro.max) * 100, 100)}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div>
                   <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Ingredientes Detectados</h4>
                   <div className="flex flex-wrap gap-2">
                     {analysis.ingredients.map((ing, idx) => (
                       <span key={idx} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700">
                         {ing}
                       </span>
                     ))}
                   </div>
                </div>
              </div>
            ) : !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-800 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-center font-black tracking-tight uppercase text-xs opacity-50">Esperando captura de datos...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodVision;
