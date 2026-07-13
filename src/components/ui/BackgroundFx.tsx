import React from 'react';

export const BackgroundFx: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-bg">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5C381A] rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F5A6231A] rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[40%] bg-[#3b82f615] rounded-full blur-[80px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }}></div>

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/5 animate-float"
          style={{
            width: Math.random() * 40 + 10 + 'px',
            height: Math.random() * 40 + 10 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 10 + 's',
            animationDelay: Math.random() * -20 + 's',
          }}
        ></div>
      ))}
    </div>
  );
};
