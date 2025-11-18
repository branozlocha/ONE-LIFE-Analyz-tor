import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        width="300" 
        height="220" 
        viewBox="0 0 300 220" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[200px] md:max-w-[280px]"
        role="img"
        aria-label="ONE LIFE Logo"
      >
        <defs>
          <style>
            {`
              .logo-text {
                font-family: 'TT Hoves', 'Inter', sans-serif;
                font-weight: 800;
                font-size: 90px;
                fill: none;
                stroke: #F0E6C0; /* Gold-200 matches Tailwind */
                stroke-width: 3px;
                letter-spacing: 0.02em;
              }
            `}
          </style>
        </defs>
        
        {/* ONE */}
        <text x="50%" y="90" textAnchor="middle" className="logo-text">
          ONE
        </text>
        
        {/* LIFE */}
        <text x="50%" y="175" textAnchor="middle" className="logo-text">
          LIFE
        </text>

      </svg>
      
      <div className="mt-0 text-center">
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-slate-300 hover:text-gold-400 transition-colors font-normal font-sans">
          onelifelimited.com
        </span>
      </div>
    </div>
  );
};