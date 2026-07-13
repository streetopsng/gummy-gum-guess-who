import React, { useState, useEffect } from 'react';
import { TEAM_WITH_IMAGES } from '../../data';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { HRUploadsState } from './HRSetup';

interface HRReviewProps {
  uploads: HRUploadsState;
  onBack: () => void;
  onLaunch: (gameCode: string) => void;
}

export const HRReview: React.FC<HRReviewProps> = ({ uploads, onBack, onLaunch }) => {
  const [gameCode, setGameCode] = useState('');

  useEffect(() => {
    // Generate a random game code
    setGameCode('GW-' + Math.floor(100 + Math.random() * 900));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(gameCode);
    // Usually we would trigger a toast here, but we can rely on parent for now or handle locally
  };

  return (
    <div className="flex flex-col h-full lg:h-full w-full lg:flex-row relative">
      
      {/* Desktop Left Sidebar / Mobile Top Header & Controls */}
      <div className="lg:w-[320px] lg:border-r lg:border-border lg:bg-black/20 lg:p-6 lg:flex lg:flex-col shrink-0 hidden lg:flex">
        <button
          className="w-[34px] h-[34px] rounded-full bg-surface border border-border text-white text-[16px] cursor-pointer flex items-center justify-center shrink-0 mb-6"
          onClick={onBack}
        >
          ←
        </button>
        <div className="text-[10px] tracking-[2.5px] uppercase text-muted font-semibold">Step 2 of 2</div>
        <div className="text-[24px] font-extrabold mb-6">Review & launch</div>

        <div className="bg-gradient-to-br from-coral to-[#ff8c6b] rounded-[14px] p-5 text-center mb-6 shadow-xl shadow-coral/20">
          <div className="text-[11px] tracking-[2px] uppercase text-white/70 font-semibold mb-2">Game code</div>
          <div className="text-[42px] font-black tracking-[10px] text-white leading-none mb-2">{gameCode}</div>
          <div className="text-[12px] text-white/80 leading-[1.4]">Share this with your team. They enter this code to join.</div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button variant="coral" onClick={() => onLaunch(gameCode)} className="w-full">
            Launch game
          </Button>
          <Button variant="ghost" onClick={handleCopy} className="w-full">
            Copy & share code
          </Button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="px-[22px] pt-5 pb-0 flex items-center gap-[14px] lg:hidden shrink-0">
        <button
          className="w-[34px] h-[34px] rounded-full bg-surface border border-border text-white text-[16px] cursor-pointer flex items-center justify-center shrink-0"
          onClick={onBack}
        >
          ←
        </button>
        <div>
          <div className="text-[10px] tracking-[2.5px] uppercase text-muted font-semibold">Step 2 of 2</div>
          <div className="text-[20px] font-extrabold">Review & launch</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-hide mt-4 lg:mt-0 lg:p-8">
          
          <div className="mx-5 mb-4 bg-gradient-to-br from-coral to-[#ff8c6b] rounded-[14px] p-5 text-center lg:hidden">
            <div className="text-[11px] tracking-[2px] uppercase text-white/70">Game code — share this with your team</div>
            <div className="text-[38px] font-black tracking-[10px] text-white my-1.5">{gameCode}</div>
            <div className="text-[12px] text-white/70">Players enter this code to join</div>
          </div>

          <div className="px-5 pb-2.5 lg:px-0 lg:pb-5">
            <div className="text-[10px] lg:text-[12px] tracking-[2.5px] uppercase text-muted font-semibold">Content review</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-4 px-5 lg:px-0">
            {TEAM_WITH_IMAGES.map((m) => {
              const u = uploads[m.nick];
              return (
                <div key={m.nick} className="bg-surface lg:bg-surface/60 lg:backdrop-blur-sm border border-border rounded-[14px] overflow-hidden flex hover:border-amber/50 transition-colors">
                  <div className="w-[72px] lg:w-[90px] h-auto shrink-0 bg-surface2 flex items-center justify-center text-[28px]" style={{ backgroundColor: `${m.color}22` }}>
                    <img
                      src={u?.photo || m.imgSrc}
                      className="w-full h-full object-cover min-h-[88px]"
                      alt={m.name}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                  <div className="flex-1 px-3.5 lg:px-4 py-3 flex flex-col justify-center">
                    <div className="text-[13px] lg:text-[15px] font-bold">{m.name}</div>
                    <div className="text-[11px] lg:text-[12px] mt-[1px] text-amber">{m.nick}</div>
                    <div className="text-[12px] lg:text-[13px] text-muted mt-1.5 leading-[1.5] italic line-clamp-2">"{u?.fact || m.fact}"</div>
                    <div className="mt-2.5">
                      <Badge variant={u?.complete ? 'green' : 'coral'}>
                        {u?.complete ? '✓ Ready' : '⚠ Incomplete'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-6"></div>
        </div>

        <div className="px-5 pb-8 flex flex-col gap-2.5 pt-2 shrink-0 lg:hidden">
          <Button variant="coral" onClick={() => onLaunch(gameCode)}>Launch game</Button>
          <Button variant="ghost" onClick={handleCopy}>Copy & share code</Button>
        </div>
      </div>
    </div>
  );
};
