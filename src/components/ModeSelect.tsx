import React from 'react';

interface ModeSelectProps {
  onSelect: (mode: 'hr' | 'player') => void;
}

export const ModeSelect: React.FC<ModeSelectProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full min-h-screen lg:min-h-0 relative">
      <div className="text-[15px] font-black text-amber tracking-[-0.3px] absolute top-6 left-7 z-10">
        GummyGum
      </div>
      
      {/* Left panel for desktop, top for mobile */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-7 py-10 lg:pl-16 lg:pr-8 lg:bg-transparent">
        <div className="text-[28px] lg:text-[48px] font-black text-center lg:text-left leading-[1.15] mb-4">
          Guess <span className="text-coral">Who?</span>
        </div>
        <div className="text-[14px] lg:text-[16px] text-muted text-center lg:text-left leading-[1.6] max-w-sm">
          Team members hidden behind their own stories. Can your team figure out who's who?
        </div>
      </div>
      
      {/* Right panel for desktop, bottom for mobile */}
      <div className="flex-1 flex flex-col justify-center gap-3 px-7 py-10 lg:pr-16 lg:pl-8 lg:bg-black/20">
        <div 
          onClick={() => onSelect('hr')}
          className="bg-surface lg:bg-surface/80 lg:backdrop-blur-md border-[1.5px] border-border rounded-[14px] p-5 lg:p-7 cursor-pointer transition-all duration-300 flex items-center gap-4 hover:border-amber hover:bg-[#F5A6230F] lg:hover:-translate-y-1 lg:hover:shadow-[0_10px_30px_rgba(245,166,35,0.15)] group"
        >
          <div className="text-[36px] lg:text-[42px] shrink-0 transition-transform duration-300 group-hover:scale-110">🎛️</div>
          <div>
            <div className="text-[16px] lg:text-[18px] font-extrabold">Host Game</div>
            <div className="text-[12px] lg:text-[13px] text-muted mt-[3px] leading-[1.5]">
              Generate a game code and launch the session.
            </div>
          </div>
          <div className="text-[20px] text-muted ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber">→</div>
        </div>

        <div 
          onClick={() => onSelect('player')}
          className="bg-surface lg:bg-surface/80 lg:backdrop-blur-md border-[1.5px] border-border rounded-[14px] p-5 lg:p-7 cursor-pointer transition-all duration-300 flex items-center gap-4 hover:border-amber hover:bg-[#F5A6230F] lg:hover:-translate-y-1 lg:hover:shadow-[0_10px_30px_rgba(245,166,35,0.15)] group"
        >
          <div className="text-[36px] lg:text-[42px] shrink-0 transition-transform duration-300 group-hover:scale-110">🎮</div>
          <div>
            <div className="text-[16px] lg:text-[18px] font-extrabold">I'm a player</div>
            <div className="text-[12px] lg:text-[13px] text-muted mt-[3px] leading-[1.5]">
              Enter your game code and codename to join.
            </div>
          </div>
          <div className="text-[20px] text-muted ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber">→</div>
        </div>
      </div>
    </div>
  );
};
