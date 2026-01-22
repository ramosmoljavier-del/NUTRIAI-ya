
import React from 'react';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'diet' | 'vision' | 'profile';
  onTabChange: (tab: 'home' | 'diet' | 'vision' | 'profile') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-0 md:pt-16 text-slate-100 flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 px-6 py-3 justify-between items-center">
        <div className="flex items-center space-x-3">
          <Logo size="sm" />
          <span className="text-xl font-bold tracking-tight text-white">NutriAI</span>
        </div>
        <nav className="flex space-x-8">
          {[
            { id: 'home', label: 'Inicio' },
            { id: 'diet', label: 'Plan Dieta' },
            { id: 'vision', label: 'Escáner' },
            { id: 'profile', label: 'Perfil' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`text-sm font-medium transition-all ${
                activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="h-0.5 bg-emerald-400 rounded-full mt-0.5 animate-fadeIn"></div>}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (MÓVIL) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3 flex justify-around items-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => onTabChange('home')} className="flex flex-col items-center group">
          <div className={`p-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className={`text-[9px] uppercase font-black tracking-tighter mt-1 ${activeTab === 'home' ? 'text-emerald-400' : 'text-slate-500'}`}>Inicio</span>
        </button>
        
        <button onClick={() => onTabChange('diet')} className="flex flex-col items-center group">
          <div className={`p-2 rounded-xl transition-all ${activeTab === 'diet' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className={`text-[9px] uppercase font-black tracking-tighter mt-1 ${activeTab === 'diet' ? 'text-emerald-400' : 'text-slate-500'}`}>Dieta</span>
        </button>

        <button onClick={() => onTabChange('vision')} className="flex flex-col items-center group">
          <div className={`p-2 rounded-xl transition-all ${activeTab === 'vision' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className={`text-[9px] uppercase font-black tracking-tighter mt-1 ${activeTab === 'vision' ? 'text-emerald-400' : 'text-slate-500'}`}>Escáner</span>
        </button>

        <button onClick={() => onTabChange('profile')} className="flex flex-col items-center group">
          <div className={`p-2 rounded-xl transition-all ${activeTab === 'profile' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className={`text-[9px] uppercase font-black tracking-tighter mt-1 ${activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-500'}`}>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
