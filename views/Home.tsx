
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface HomeProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ profile, updateProfile, onNavigate }) => {
  const [isFasting, setIsFasting] = useState(false);
  const [fastingGoal, setFastingGoal] = useState(16); 
  const [fastingTimeLeft, setFastingTimeLeft] = useState(16 * 3600);

  // Cálculo de calorías en tiempo real basado en el perfil del usuario (Mifflin-St Jeor)
  const calculateTDEE = () => {
    let bmr;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = bmr * (factors[profile.activityLevel] || 1.2);

    if (profile.goal === 'lose') return Math.round(tdee * 0.8);
    if (profile.goal === 'gain') return Math.round(tdee * 1.15);
    return Math.round(tdee);
  };

  const dailyGoal = calculateTDEE(); 
  const consumed = 0; // Esto vendría de un registro de comidas real
  const remaining = dailyGoal - consumed;
  const progressPercent = Math.min((consumed / dailyGoal) * 100, 100);

  const stepsCalories = (profile.steps * 0.04).toFixed(0);
  const waterTarget = Math.round((profile.weight * 35) / 250);
  const waterLiters = (profile.weight * 0.035).toFixed(1);
  
  const xpToNextLevel = profile.level * 1000;
  const xpPercent = (profile.xp / xpToNextLevel) * 100;

  useEffect(() => {
    let interval: any;
    if (isFasting && fastingTimeLeft > 0) {
      interval = setInterval(() => setFastingTimeLeft(t => t - 1), 1000);
    } else if (fastingTimeLeft === 0 && isFasting) {
      setIsFasting(false);
      alert("¡Ayuno completado! Buen trabajo.");
    }
    return () => clearInterval(interval);
  }, [isFasting, fastingTimeLeft]);

  const adjustFastingGoal = (amount: number) => {
    const newGoal = Math.max(1, Math.min(168, fastingGoal + amount));
    setFastingGoal(newGoal);
    if (!isFasting) {
      setFastingTimeLeft(newGoal * 3600);
    } else {
      setFastingTimeLeft(prev => Math.max(0, prev + (amount * 3600)));
    }
  };

  const formatTimeLeft = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Nivel y Progreso Superior */}
      <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800/50 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 flex items-center justify-center rounded-2xl font-black text-2xl shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
              {profile.level}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] font-black text-emerald-600">
              LV
            </div>
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rango Nutricional</div>
            <div className="text-sm font-bold text-white mb-1">Cinturón {profile.level > 1 ? 'Esmeralda' : 'Novato'}</div>
            <div className="w-40 bg-slate-800/50 h-2 rounded-full overflow-hidden border border-slate-700/30">
              <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Puntos XP</div>
          <div className="text-2xl font-black text-emerald-400 tracking-tighter">{profile.xp}</div>
        </div>
      </div>

      {/* CÍRCULO DE CALORÍAS MAESTRO */}
      <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-slate-800/50 shadow-2xl relative flex flex-col items-center overflow-visible">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800/40" />
            <circle 
              cx="75" cy="75" r="62" 
              stroke="currentColor" strokeWidth="10" 
              fill="transparent" 
              strokeDasharray="389.5" 
              strokeDashoffset={389.5 * (1 - Math.max(0.05, progressPercent/100))} 
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000 ease-out"
              style={{ filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white tracking-tighter">{remaining}</span>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">kcal objetivo</span>
          </div>
        </div>
        
        <p className="mt-8 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">Cálculo Personalizado Mifflin-St Jeor</p>

        <div className="mt-8 grid grid-cols-3 gap-8 w-full max-w-md">
           <div className="text-center group">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">Proteína</div>
             <div className="text-xl font-black text-white">{Math.round(profile.weight * 2)}<span className="text-xs text-slate-500 ml-0.5">g</span></div>
             <div className="w-8 h-1 bg-blue-500/50 rounded-full mx-auto mt-2"></div>
           </div>
           <div className="text-center group">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-amber-400 transition-colors">Carbos</div>
             <div className="text-xl font-black text-white">{Math.round(remaining * 0.4 / 4)}<span className="text-xs text-slate-500 ml-0.5">g</span></div>
             <div className="w-8 h-1 bg-amber-500/50 rounded-full mx-auto mt-2"></div>
           </div>
           <div className="text-center group">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-rose-400 transition-colors">Grasas</div>
             <div className="text-xl font-black text-white">{Math.round(profile.weight * 0.8)}<span className="text-xs text-slate-500 ml-0.5">g</span></div>
             <div className="w-8 h-1 bg-rose-500/50 rounded-full mx-auto mt-2"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ayuno Intermitente Elite */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-800/50 flex flex-col justify-between shadow-xl group transition-all hover:bg-slate-900/80">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em] text-slate-400">Objetivo Ayuno</h3>
             <div className="flex items-center bg-slate-800/50 rounded-2xl p-1.5 border border-slate-700/50">
               <button 
                onClick={() => adjustFastingGoal(-1)}
                className="w-9 h-9 flex items-center justify-center bg-slate-900 hover:bg-slate-700 rounded-xl text-white font-black transition-all active:scale-90"
               >
                 -
               </button>
               <span className="text-sm font-black text-emerald-400 w-12 text-center tracking-tighter">{fastingGoal}h</span>
               <button 
                onClick={() => adjustFastingGoal(1)}
                className="w-9 h-9 flex items-center justify-center bg-slate-900 hover:bg-slate-700 rounded-xl text-white font-black transition-all active:scale-90"
               >
                 +
               </button>
             </div>
          </div>
          <div className="text-5xl font-black text-white mb-8 font-mono tracking-tighter text-center">
            {formatTimeLeft(fastingTimeLeft)}
          </div>
          <button 
            onClick={() => setIsFasting(!isFasting)}
            className={`w-full py-5 rounded-[2rem] font-black tracking-widest text-xs transition-all shadow-xl ${isFasting ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 active:scale-95'}`}
          >
            {isFasting ? 'DETENER AYUNO' : 'INICIAR AYUNO'}
          </button>
        </div>

        {/* Hidratación Cristalline */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-800/50 shadow-xl transition-all hover:bg-slate-900/80">
           <div className="flex justify-between items-start mb-6">
             <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em] text-slate-400">Hidratación</h3>
             <div className="text-right">
               <div className="text-2xl font-black text-white tracking-tighter">{waterLiters}<span className="text-xs text-slate-500 ml-1">L</span></div>
             </div>
           </div>
           <div className="grid grid-cols-5 gap-3 mb-8">
             {Array.from({ length: 10 }).map((_, i) => (
               <button 
                key={i} 
                onClick={() => updateProfile({ waterIntake: i < profile.waterIntake ? profile.waterIntake - 1 : profile.waterIntake + 1, xp: profile.xp + 5 })}
                className={`text-xl p-3 rounded-2xl transition-all duration-500 ${i < profile.waterIntake ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105' : 'bg-slate-800 opacity-20 hover:opacity-40'}`}
               >
                 💧
               </button>
             ))}
           </div>
           <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
             <span>Nivel Agua</span>
             <span className="text-blue-400">{profile.waterIntake} / {waterTarget} VASOS</span>
           </div>
        </div>
      </div>

      {/* PASOS PREMIUM */}
      <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-800/50 flex items-center justify-between shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/20"></div>
         <div className="flex items-center space-x-6">
           <div className="w-16 h-16 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">👟</div>
           <div>
             <div className="flex items-baseline space-x-2">
               <span className="text-4xl font-black text-white tracking-tighter">{profile.steps.toLocaleString()}</span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pasos</span>
             </div>
             <div className="flex items-center text-amber-500 text-[10px] font-black mt-2 uppercase tracking-[0.1em]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.266-2.315-.74-3.32a1.109 1.109 0 00-1.734-.333 2.69 2.69 0 01-1.083.552z" clipRule="evenodd" />
               </svg>
               {stepsCalories} Kcal Activas
             </div>
           </div>
         </div>
         <button 
          onClick={() => updateProfile({ steps: profile.steps + 500, xp: profile.xp + 15 })}
          className="px-6 py-4 bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-white rounded-2xl font-black text-xs border border-slate-700/50 transition-all active:scale-95 shadow-lg"
         >
           +500
         </button>
      </div>
    </div>
  );
};

export default Home;
