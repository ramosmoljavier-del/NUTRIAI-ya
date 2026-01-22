
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, DietGoal, ProgressPace, DietType } from '../types';
import Logo from '../components/Logo';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  email: string;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, email }) => {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({ 
    age: '25', 
    weight: '70', 
    height: '170', 
    targetWeight: '65' 
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    email, 
    gender: 'male', 
    goal: 'lose', 
    pace: 'recommended', 
    activityLevel: 'moderate',
    isWeightlifting: false, 
    dietType: 'balanced', 
    mealFrequency: 4, 
    wantsAiDiet: true,
    wantsCalorieCounting: true, 
    favoriteFoods: { proteins: [], vegetables: [], carbs: [], fats: [], fruits: [], dairy: [], sauces: [] },
    xp: 0, 
    level: 1, 
    waterIntake: 0, 
    steps: 0, 
    weightHistory: [], 
    startDate: new Date().toISOString().split('T')[0],
    goalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const foodOptions = {
    proteins: ['Pechuga de Pollo', 'Pavo', 'Claras de Huevo', 'Huevo Entero', 'Atún al Natural', 'Ternera Magra', 'Salmón Fresco', 'Tofu Ahumado', 'Tempeh', 'Lentejas Rojas', 'Garbanzos Cocidos', 'Proteína Whey', 'Seitan', 'Cangrejo Real', 'Langostinos', 'Conejo', 'Cerdo Ibérico Magro', 'Merluza', 'Bacalao', 'Lubina', 'Lomo Embuchado', 'Queso Burgoso'],
    vegetables: ['Lechuga Romana', 'Tomate Cherry', 'Brócoli al Vapor', 'Espinacas Baby', 'Zanahoria', 'Pepino', 'Calabacín', 'Espárragos Trigeros', 'Champiñones Portobello', 'Berenjena', 'Judías Verdes', 'Canónigos', 'Rúcula', 'Alcachofa', 'Coliflor', 'Repollo', 'Puerro', 'Cebolla Morada', 'Pimiento Rojo'],
    carbs: ['Arroz Integral', 'Arroz Basmati', 'Quinoa Real', 'Avena en Copos', 'Batata Asada', 'Patata Cocida', 'Pasta de Trigo Integral', 'Pan de Centeno 100%', 'Cuscús', 'Trigo Sarraceno', 'Tortitas de Maíz', 'Mijo', 'Espelta', 'Yuca', 'Farro', 'Maíz Dulce'],
    fats: ['Aguacate Hass', 'Nueces de California', 'Aceite de Oliva VE', 'Almendras Crudas', 'Semillas de Chía', 'Mantequilla Cacahuete Natural', 'Mantequilla Almendra', 'Pistachos', 'Anacardos', 'Aceitunas Manzanilla', 'Semillas de Lino', 'Aceite de Coco', 'Avellanas', 'Semillas de Girasol'],
    fruits: ['Manzana Granny Smith', 'Plátano Canario', 'Fresas Frescas', 'Kiwi Zespri', 'Mango Maduro', 'Piña Natural', 'Arándanos Azules', 'Frambuesas', 'Naranja de Valencia', 'Pera Conferencia', 'Sandía', 'Melón Galia', 'Papaya', 'Uvas Sin Pepitas', 'Higos', 'Pomelo'],
    dairy: ['Leche Entera de Vaca', 'Leche Desnatada', 'Bebida de Almendras Sin Azúcar', 'Bebida de Avena', 'Yogur Griego Natural', 'Kéfir de Leche', 'Queso Fresco Batido 0%', 'Queso Cottage', 'Skyr Natural', 'Leche de Soja', 'Queso Quark', 'Proteína Caseína'],
    sauces: ['Mostaza de Dijon', 'Salsa de Soja Baja en Sal', 'Vinagre de Manzana', 'Orégano Seco', 'Cúrcuma en Polvo', 'Ajo en Polvo', 'Zumo de Limón', 'Pimentón de la Vera', 'Comino', 'Curry Suave', 'Sal Rosa del Himalaya', 'Sriracha Picante', 'Canela en Polvo', 'Pimienta Negra']
  };

  const categoryLabels: Record<string, string> = {
    proteins: 'Proteínas',
    vegetables: 'Vegetales',
    carbs: 'Carbohidratos',
    fats: 'Grasas Saludables',
    fruits: 'Frutas',
    dairy: 'Lácteos/Alternativas',
    sauces: 'Condimentos y Salsas'
  };

  const handleInputChange = (name: string, val: string) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    setInputs(prev => ({ ...prev, [name]: val }));
  };

  const toggleFav = (category: keyof typeof formData.favoriteFoods, item: string) => {
    const current = formData.favoriteFoods?.[category] || [];
    const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
    setFormData({ ...formData, favoriteFoods: { ...formData.favoriteFoods!, [category]: updated } });
  };

  // Solo las categorías principales requieren 3 elementos. Salsas es opcional.
  const isCategoryValid = (key: string) => {
    if (key === 'sauces') return true; 
    return (formData.favoriteFoods?.[key as keyof typeof formData.favoriteFoods]?.length || 0) >= 3;
  };

  const areFoodsValid = () => ['proteins', 'vegetables', 'carbs', 'fats', 'fruits', 'dairy'].every(isCategoryValid);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const finish = () => {
    onComplete({
      ...formData,
      age: parseInt(inputs.age), 
      weight: parseInt(inputs.weight), 
      height: parseInt(inputs.height), 
      targetWeight: parseInt(inputs.targetWeight)
    } as UserProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full py-8">
        <div className="flex justify-between items-center mb-10">
          <Logo size="sm" />
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>

        {/* PASO 1: BÁSICOS */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black leading-tight tracking-tighter">Tu Perfil <span className="text-emerald-400">Básico</span></h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setFormData({...formData, gender: 'male'})} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center ${formData.gender === 'male' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}>
                <span className="text-4xl mb-2">👨</span>
                <span className="font-bold uppercase text-xs tracking-widest">Hombre</span>
              </button>
              <button onClick={() => setFormData({...formData, gender: 'female'})} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center ${formData.gender === 'female' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}>
                <span className="text-4xl mb-2">👩</span>
                <span className="font-bold uppercase text-xs tracking-widest">Mujer</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input type="text" value={inputs.age} onChange={e => handleInputChange('age', e.target.value)} className="w-full bg-slate-900 p-6 rounded-[2rem] border border-slate-800 focus:border-emerald-500 outline-none text-xl font-bold transition-all" placeholder="Edad" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold uppercase text-[10px]">años</span>
              </div>
              <div className="relative">
                <input type="text" value={inputs.height} onChange={e => handleInputChange('height', e.target.value)} className="w-full bg-slate-900 p-6 rounded-[2rem] border border-slate-800 focus:border-emerald-500 outline-none text-xl font-bold transition-all" placeholder="Altura" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold uppercase text-[10px]">cm</span>
              </div>
            </div>
            <button onClick={next} className="w-full py-6 bg-emerald-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">SIGUIENTE</button>
          </div>
        )}

        {/* PASO 2: PESO */}
        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black leading-tight tracking-tighter">Estado de <span className="text-emerald-400">Peso</span></h2>
            <div className="space-y-4">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Peso Actual</label>
                <div className="relative">
                  <input type="text" value={inputs.weight} onChange={e => handleInputChange('weight', e.target.value)} className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 focus:border-emerald-500 outline-none text-3xl font-black text-white transition-all text-center" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">KG</span>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Peso Objetivo</label>
                <div className="relative">
                  <input type="text" value={inputs.targetWeight} onChange={e => handleInputChange('targetWeight', e.target.value)} className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 focus:border-emerald-500 outline-none text-3xl font-black text-white transition-all text-center" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">KG</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={back} className="flex-1 py-6 bg-slate-900 border border-slate-800 rounded-[2rem] font-bold uppercase text-xs tracking-widest">Atrás</button>
              <button onClick={next} className="flex-[2] py-6 bg-emerald-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">CONTINUAR</button>
            </div>
          </div>
        )}

        {/* PASO 3: OBJETIVO */}
        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black leading-tight tracking-tighter">¿Cuál es tu <span className="text-emerald-400">Meta</span>?</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'lose', label: 'Perder Grasa', desc: 'Déficit calórico para definición.', icon: '🔥' },
                { id: 'maintain', label: 'Mantener Peso', desc: 'Dieta normocalórica para salud.', icon: '⚖️' },
                { id: 'gain', label: 'Ganar Músculo', desc: 'Superávit controlado para fuerza.', icon: '💪' },
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setFormData({...formData, goal: opt.id as DietGoal})}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center space-x-6 text-left ${formData.goal === opt.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900 hover:bg-slate-800'}`}
                >
                  <span className="text-4xl">{opt.icon}</span>
                  <div>
                    <h3 className="font-black text-xl text-white">{opt.label}</h3>
                    <p className="text-slate-500 text-sm">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-4">
              <button onClick={back} className="flex-1 py-6 bg-slate-900 border border-slate-800 rounded-[2rem] font-bold uppercase text-xs tracking-widest">Atrás</button>
              <button onClick={next} className="flex-[2] py-6 bg-emerald-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">SIGUIENTE</button>
            </div>
          </div>
        )}

        {/* PASO 4: ACTIVIDAD */}
        {step === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black leading-tight tracking-tighter">Nivel de <span className="text-emerald-400">Actividad</span></h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'sedentary', label: 'Sedentario', desc: 'Trabajo de oficina, poco ejercicio.', icon: '🪑' },
                { id: 'light', label: 'Ligera', desc: 'Actividad 1-3 días/semana.', icon: '🚶' },
                { id: 'moderate', label: 'Moderada', desc: 'Entrenamiento 3-5 días/semana.', icon: '🏃' },
                { id: 'active', label: 'Activo', desc: 'Deporte intenso diario.', icon: '🚴' },
                { id: 'very_active', label: 'Elite', desc: 'Atleta profesional o físico.', icon: '🏆' },
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setFormData({...formData, activityLevel: opt.id as ActivityLevel})}
                  className={`p-5 rounded-[2rem] border-2 transition-all flex items-center space-x-4 text-left ${formData.activityLevel === opt.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900 hover:bg-slate-800'}`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <div>
                    <h3 className="font-black text-white">{opt.label}</h3>
                    <p className="text-slate-500 text-[11px] leading-tight">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-4">
              <button onClick={back} className="flex-1 py-6 bg-slate-900 border border-slate-800 rounded-[2rem] font-bold uppercase text-xs tracking-widest">Atrás</button>
              <button onClick={next} className="flex-[2] py-6 bg-emerald-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">CONFIGURAR DIETA</button>
            </div>
          </div>
        )}

        {/* PASO 5: TIPO DIETA */}
        {step === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-4xl font-black leading-tight tracking-tighter">Estilo de <span className="text-emerald-400">Dieta</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'balanced', label: 'Equilibrada', icon: '🥗' },
                { id: 'high_protein', label: 'Proteica', icon: '🥩' },
                { id: 'keto', label: 'Keto', icon: '🥑' },
                { id: 'vegan', label: 'Vegana', icon: '🥦' },
                { id: 'mediterranean', label: 'Mediterránea', icon: '🥘' },
              ].map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setFormData({...formData, dietType: opt.id as DietType})}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center ${formData.dietType === opt.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}
                >
                  <span className="text-3xl mb-2">{opt.icon}</span>
                  <h3 className="font-black text-white uppercase text-[10px] tracking-widest">{opt.label}</h3>
                </button>
              ))}
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Ritmo de Progreso</label>
               <div className="grid grid-cols-3 gap-2">
                  {['slow', 'recommended', 'fast'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setFormData({...formData, pace: p as ProgressPace})}
                      className={`py-3 px-2 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all ${formData.pace === p ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                      {p === 'recommended' ? 'Recomendado' : p === 'slow' ? 'Lento' : 'Agresivo'}
                    </button>
                  ))}
               </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={back} className="flex-1 py-6 bg-slate-900 border border-slate-800 rounded-[2rem] font-bold uppercase text-xs tracking-widest">Atrás</button>
              <button onClick={next} className="flex-[2] py-6 bg-emerald-500 text-slate-950 rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all">PERSONALIZAR COMIDA</button>
            </div>
          </div>
        )}

        {/* PASO 6: ALIMENTOS FAVORITOS */}
        {step === 6 && (
          <div className="space-y-8 animate-fadeIn pb-10">
            <div className="bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/20 mb-6">
              <h2 className="text-3xl font-black tracking-tighter">Tu Despensa <span className="text-emerald-400">Favorita</span></h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Elige al menos 3 de cada grupo principal para que la IA diseñe platos que te gusten.</p>
            </div>
            
            <div className="space-y-10">
              {Object.entries(foodOptions).map(([key, list]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{categoryLabels[key]}</label>
                    {!isCategoryValid(key) && <span className="text-[9px] text-rose-500 font-black animate-pulse bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">Mínimo 3</span>}
                    {key === 'sauces' && <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">Opcional</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {list.map(item => (
                      <button 
                        key={item} 
                        onClick={() => toggleFav(key as any, item)} 
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${formData.favoriteFoods?.[key as keyof typeof formData.favoriteFoods].includes(item) ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 pt-8 sticky bottom-0 bg-slate-950/90 backdrop-blur-md py-6 z-50">
              <button onClick={back} className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Atrás</button>
              <button 
                disabled={!areFoodsValid()}
                onClick={next} 
                className="flex-[2] py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg disabled:opacity-20 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                FINALIZAR PERFIL
              </button>
            </div>
          </div>
        )}

        {/* PASO 7: CONFIRMACIÓN */}
        {step === 7 && (
          <div className="space-y-12 animate-fadeIn text-center flex flex-col items-center py-20">
             <div className="relative">
               <div className="text-8xl mb-8 animate-bounce">✨</div>
               <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
             </div>
             <div className="space-y-4">
               <h2 className="text-5xl font-black leading-none tracking-tighter">¡Algoritmo <span className="text-emerald-400">Listo</span>!</h2>
               <p className="text-slate-400 px-8 text-lg font-medium leading-relaxed">Tu perfil ha sido encriptado y vinculado a <br/><span className="text-white font-black underline decoration-emerald-500 decoration-4 underline-offset-4">{email}</span></p>
             </div>
             <button 
               onClick={finish} 
               className="w-full max-w-sm py-8 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all active:scale-95 uppercase tracking-widest"
             >
               Ver mi Dieta IA
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
