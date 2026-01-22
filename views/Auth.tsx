
import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';

interface AuthProps {
  onAuthSuccess: (email: string, isLogin: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');
    const testEmail = 'test@nutriai.com';
    
    if (!db[testEmail]) {
      db[testEmail] = {
        email: testEmail,
        password: '123456',
        profile: {
          email: testEmail,
          age: 28,
          weight: 75,
          height: 180,
          targetWeight: 72,
          gender: 'male',
          isWeightlifting: true,
          activityLevel: 'active',
          goal: 'lose',
          pace: 'recommended',
          dietType: 'balanced',
          mealFrequency: 4,
          wantsAiDiet: true,
          wantsCalorieCounting: true,
          favoriteFoods: {
            proteins: ['Pechuga de Pollo', 'Pavo', 'Huevo Entero'],
            vegetables: ['Brócoli', 'Espinacas', 'Tomate'],
            carbs: ['Arroz Integral', 'Avena', 'Patata'],
            fats: ['Aguacate', 'Nueces', 'Aceite de Oliva VE'],
            fruits: ['Plátano', 'Manzana', 'Arándanos'],
            dairy: ['Yogur Griego', 'Leche Desnatada', 'Skyr'],
            sauces: ['Mostaza', 'Limón', 'Ajo en Polvo']
          },
          startDate: new Date().toISOString().split('T')[0],
          goalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          xp: 1250,
          level: 2,
          waterIntake: 4,
          steps: 8500,
          weightHistory: []
        }
      };
      localStorage.setItem('nutri_db_v3', JSON.stringify(db));
    }
  }, []);

  const fillDemoData = () => {
    setEmail('test@nutriai.com');
    setPassword('123456');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');

    if (isLogin) {
      if (!db[email]) {
        setError('Acceso denegado. Usuario no encontrado.');
        return;
      }
      if (db[email].password !== password) {
        setError('Credenciales incorrectas.');
        return;
      }
      onAuthSuccess(email, true);
    } else {
      if (db[email]) {
        setError('Este correo ya está registrado.');
        return;
      }
      db[email] = { email, password };
      localStorage.setItem('nutri_db_v3', JSON.stringify(db));
      onAuthSuccess(email, false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden relative">
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 border border-slate-800/50 animate-fadeIn relative z-10">
        <div className="text-center mb-12">
          <Logo size="xl" className="mx-auto mb-6 scale-110" />
          <h1 className="text-4xl font-black text-white tracking-tight">Nutri<span className="text-emerald-400">AI</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Nutrición Inteligente</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black rounded-2xl text-center uppercase tracking-widest animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/30 text-white px-6 py-5 rounded-[2rem] border border-slate-700/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/30 text-white px-6 py-5 rounded-[2rem] border border-slate-700/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-600 font-medium"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 py-6 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95 uppercase tracking-widest"
          >
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-slate-500 font-bold hover:text-emerald-400 transition-colors text-xs uppercase tracking-widest"
          >
            {isLogin ? 'Crear nueva cuenta' : 'Ya tengo cuenta'}
          </button>
          
          {isLogin && (
            <button 
              onClick={fillDemoData}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-700/50"
            >
              Rellenar datos de prueba
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
