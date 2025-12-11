"use client";

import React from 'react';

const SimpleGem = () => {
  console.log("SimpleGem component rendering");
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-40 h-40 md:w-52 md:h-52">
        {/* Glow effect - behind the gem */}
        <div className="absolute inset-0 rounded-full bg-[#FFCF3C]/30 blur-2xl animate-pulse z-0"></div>
        
        {/* Gem shape - in front of glow */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-2xl"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 30px rgba(255, 207, 60, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          >
            {/* Highlight */}
            <div 
              className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-white/40"
              style={{ transform: 'translate(-50%, -50%)' }}
            ></div>
          </div>
        </div>
        
        {/* Sparkles - in front of everything */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white animate-ping z-20"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-white animate-ping z-20" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 rounded-full bg-white animate-ping z-20" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default SimpleGem;