
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import DietPlanner from './views/DietPlanner';
import FoodVision from './views/FoodVision';
import Auth from './views/Auth';
import ProfileSetup from './views/ProfileSetup';
import NutriBot from './views/NutriBot';
import Profile from './views/Profile';
import { UserProfile, UserAccount } from './types';

type AppState = 'auth' | 'profile-setup' | 'main';
type Tab = 'home' | 'diet' | 'vision' | 'bot' | 'profile';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const sessionEmail = localStorage.getItem('nutri_session_v3');
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');
    
    if (sessionEmail && db[sessionEmail]) {
      const account = db[sessionEmail];
      setCurrentUser(account);
      if (account.profile) {
        setAppState('main');
      } else {
        setAppState('profile-setup');
      }
    }
  }, []);

  const handleAuthSuccess = (email: string, isLogin: boolean) => {
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');
    const account = db[email];

    localStorage.setItem('nutri_session_v3', email);
    setCurrentUser(account || { email });

    if (isLogin && account?.profile) {
      setAppState('main');
    } else {
      setAppState('profile-setup');
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser || !currentUser.profile) return;
    
    const updatedProfile = { ...currentUser.profile, ...updates };
    const updatedAccount = { ...currentUser, profile: updatedProfile };
    
    setCurrentUser(updatedAccount);
    
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');
    db[currentUser.email] = updatedAccount;
    localStorage.setItem('nutri_db_v3', JSON.stringify(db));
  };

  const handleProfileComplete = (profile: UserProfile) => {
    if (!currentUser) return;
    
    const updatedAccount = { ...currentUser, profile };
    setCurrentUser(updatedAccount);
    
    const db = JSON.parse(localStorage.getItem('nutri_db_v3') || '{}');
    db[currentUser.email] = updatedAccount;
    localStorage.setItem('nutri_db_v3', JSON.stringify(db));
    
    setAppState('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('nutri_session_v3');
    setCurrentUser(null);
    setAppState('auth');
    setActiveTab('home');
  };

  const renderContent = () => {
    if (!currentUser || !currentUser.profile) return null;
    switch (activeTab) {
      case 'home':
        return <Home profile={currentUser.profile} updateProfile={updateProfile} onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'diet':
        return <DietPlanner initialProfile={currentUser.profile} />;
      case 'vision':
        return <FoodVision />;
      case 'profile':
        return <Profile profile={currentUser.profile} onLogout={handleLogout} />;
      case 'bot':
        return <NutriBot profile={currentUser.profile} />;
      default:
        return <Home profile={currentUser.profile} updateProfile={updateProfile} onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  if (appState === 'auth') return <Auth onAuthSuccess={handleAuthSuccess} />;
  if (appState === 'profile-setup') return <ProfileSetup onComplete={handleProfileComplete} email={currentUser?.email || ''} />;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      <Layout activeTab={activeTab === 'bot' ? 'home' : activeTab as any} onTabChange={(tab) => setActiveTab(tab as any)}>
        {renderContent()}
      </Layout>
      
      {activeTab !== 'bot' && (
        <button 
          onClick={() => setActiveTab('bot')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40 flex items-center justify-center text-slate-950 z-40 animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
