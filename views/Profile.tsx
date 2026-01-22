
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onLogout }) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
        
        <div className="flex items-center space-x-6 mb-10">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-slate-950 text-4xl font-black shadow-lg shadow-emerald-500/20">
            {profile.gender === 'male' ? '👨' : '👩'}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Tu Perfil</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1 truncate max-w-[200px]">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Edad</div>
            <div className="text-2xl font-black text-white">{profile.age} años</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Peso</div>
            <div className="text-2xl font-black text-white">{profile.weight} kg</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Altura</div>
            <div className="text-2xl font-black text-white">{profile.height} cm</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Nivel</div>
            <div className="text-2xl font-black text-emerald-400">{profile.level}</div>
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-500 font-black hover:bg-rose-500/10 transition-all uppercase tracking-widest text-sm shadow-xl"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Profile;
