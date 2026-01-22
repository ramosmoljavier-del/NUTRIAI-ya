
import React, { useState, useRef, useEffect } from 'react';
import { chatWithNutriBot } from '../services/geminiService';
import { UserProfile } from '../types';
import Logo from '../components/Logo';

interface NutriBotProps {
  profile: UserProfile;
}

const NutriBot: React.FC<NutriBotProps> = ({ profile }) => {
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: `¡Hola! Soy NutriBot. He revisado tu perfil y veo que tu objetivo es ${profile.goal === 'lose' ? 'perder grasa' : profile.goal === 'gain' ? 'ganar músculo' : 'mantenerte'}. ¿En qué puedo ayudarte hoy?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithNutriBot(userMsg, profile);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, tuve un problema con la red. ¿Puedes repetir tu pregunta?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-fadeIn">
      {/* Cabecera */}
      <div className="bg-slate-800/50 p-6 flex items-center space-x-4 border-b border-slate-700/50 backdrop-blur-md">
        <Logo size="sm" />
        <div>
          <h3 className="font-black text-white">NutriBot Coach</h3>
          <div className="flex items-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            En línea
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-3xl ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-slate-950 rounded-br-none font-medium' 
                : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-3xl animate-pulse text-slate-500 text-xs font-black uppercase tracking-widest">
              Analizando...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Área de entrada */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
        <div className="flex space-x-2">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Pregúntame sobre tu dieta..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutriBot;
