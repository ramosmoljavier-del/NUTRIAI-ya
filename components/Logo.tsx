
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
      <svg viewBox="0 0 100 100" className="relative w-full h-full fill-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-emerald-500" />
        <path d="M50 30L35 55H65L50 80" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" className="text-white" />
        <circle cx="50" cy="50" r="5" fill="white" className="animate-pulse" />
      </svg>
    </div>
  );
};

export default Logo;
