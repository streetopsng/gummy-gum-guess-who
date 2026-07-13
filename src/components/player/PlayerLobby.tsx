import React, { useEffect, useState } from 'react';
import { INITIAL_OPPONENTS } from '../../data';
import type { TeamMember } from '../../data';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PlayerLobbyProps {
  player: TeamMember;
  onStart: () => void;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({ player, onStart }) => {
  const [joinedPlayers, setJoinedPlayers] = useState<typeof INITIAL_OPPONENTS>([]);

  useEffect(() => {
    let n = 0;
    const interval = setInterval(() => {
      if (n >= INITIAL_OPPONENTS.length) {
        clearInterval(interval);
        return;
      }
      const nextOpponent = INITIAL_OPPONENTS[n];
      setJoinedPlayers(prev => [...prev, nextOpponent]);
      n++;
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full lg:h-full w-full lg:flex-row relative">
      
      {/* Desktop Left Sidebar / Mobile Top Section */}
      <div className="lg:w-[360px] lg:border-r lg:border-border lg:bg-black/20 lg:p-8 lg:flex lg:flex-col shrink-0">
        <div className="px-[22px] pt-6 lg:px-0 lg:pt-0">
          <div className="flex items-center gap-2.5 mb-4 lg:mb-8">
            <div className="text-[32px] lg:text-[40px]">🕵️</div>
            <div>
              <div className="text-[20px] lg:text-[24px] font-black">Guess Who?</div>
              <div className="text-[12px] lg:text-[13px] text-muted mt-[1px]">StreetOps · GW-491</div>
            </div>
          </div>
        </div>

        <div className="mx-[22px] lg:mx-0 mb-4 bg-surface lg:bg-surface/60 lg:backdrop-blur-sm border-[1.5px] border-[#F5A6234D] rounded-[14px] p-3.5 lg:p-5 flex items-center gap-3">
          <div 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[14px] lg:text-[16px] font-extrabold text-[#1a0f00] shrink-0"
            style={{ background: player.color }}
          >
            {getInitials(player.name)}
          </div>
          <div className="flex-1">
            <div className="text-[14px] lg:text-[16px] font-bold">{player.nick}</div>
            <div className="text-[11px] lg:text-[12px] text-amber">You · Ready</div>
          </div>
          <Badge variant="green">✓ Joined</Badge>
        </div>

        <div className="mt-auto hidden lg:block">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-coral animate-pulse-slow"></div>
            <div className="text-[13px] text-muted">Waiting for HR to start the game...</div>
          </div>
          <Button variant="coral" onClick={onStart} className="w-full">Demo: Start game now →</Button>
        </div>
      </div>

      {/* Main Content Area (Joined Players) */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-hide lg:p-8">
          <div className="px-[22px] pb-2 lg:px-0 lg:pb-5">
            <div className="text-[10px] lg:text-[12px] tracking-[2.5px] uppercase text-muted font-semibold">Also in the lobby ({joinedPlayers.length})</div>
          </div>
          
          <div className="px-[22px] lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
            {joinedPlayers.map((o) => (
              <div key={o.nick} className="flex items-center gap-2.5 py-2.5 lg:p-3 border-b lg:border border-border lg:bg-surface/40 lg:rounded-[12px] animate-row-in">
                <div 
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-[11px] lg:text-[13px] font-extrabold text-[#1a0f00] shrink-0"
                  style={{ background: o.color }}
                >
                  {getInitials(o.name)}
                </div>
                <div className="text-[13px] lg:text-[14px] font-semibold flex-1">{o.nick}</div>
                <div className="w-[7px] h-[7px] rounded-full bg-green"></div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 pt-4 px-[22px] lg:hidden">
            <div className="w-2 h-2 rounded-full bg-coral animate-pulse-slow"></div>
            <div className="text-[13px] text-muted">Waiting for HR to start the game...</div>
          </div>
        </div>

        <div className="p-4 px-[22px] pb-9 shrink-0 lg:hidden">
          <Button variant="coral" onClick={onStart}>Demo: Start game now →</Button>
        </div>
      </div>
    </div>
  );
};
