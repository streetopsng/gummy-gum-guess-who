import React, { useState } from 'react';
import type { TeamMember } from '../../data';
import type { PlayerState } from '../../hooks/useGameState';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PlayerLobbyProps {
  player?: TeamMember;
  isHost: boolean;
  gameCode: string;
  joinedPlayers: PlayerState[];
  onStart: () => void;
  onUpdateFacts: (facts: string[]) => void;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({ player, isHost, gameCode, joinedPlayers, onStart, onUpdateFacts }) => {
  const [localFacts, setLocalFacts] = useState<string[]>(['', '', '', '']);
  const getInitials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  // Find my current state from joinedPlayers
  const myState = player ? joinedPlayers.find(p => p.nick === player.nick) : null;
  const factsFilled = myState?.facts && myState.facts.every(f => f.trim() !== '');

  const canStart = isHost && joinedPlayers.length >= 5;

  const handleUpdateFacts = () => {
    if (localFacts.every(f => f.trim() !== '')) {
      onUpdateFacts(localFacts);
    }
  };

  // Filter out the current player from the list of others
  const others = joinedPlayers.filter(p => p.nick !== player?.nick);

  return (
    <div className="flex flex-col h-full lg:h-full w-full lg:flex-row relative overflow-y-auto lg:overflow-hidden scrollbar-hide">
      
      {/* Desktop Left Sidebar / Mobile Top Section */}
      <div className="lg:w-[360px] lg:border-r lg:border-border lg:bg-black/20 lg:p-8 lg:flex lg:flex-col shrink-0 lg:overflow-y-auto scrollbar-hide">
        <div className="px-[22px] pt-6 lg:px-0 lg:pt-0">
          <div className="flex items-center gap-2.5 mb-4 lg:mb-8">
            <div className="text-[32px] lg:text-[40px]">🕵️</div>
            <div>
              <div className="text-[20px] lg:text-[24px] font-black">Guess Who?</div>
              <div className="text-[12px] lg:text-[13px] text-muted mt-[1px]">StreetOps · {gameCode}</div>
            </div>
          </div>
        </div>

        {player ? (
          <div className="mx-[22px] lg:mx-0 mb-4 bg-surface lg:bg-surface/60 lg:backdrop-blur-sm border-[1.5px] border-[#F5A6234D] rounded-[14px] p-3.5 lg:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[14px] lg:text-[16px] font-extrabold text-[#1a0f00] shrink-0"
                style={{ background: player.color }}
              >
                {getInitials(player.name)}
              </div>
              <div className="flex-1">
                <div className="text-[14px] lg:text-[16px] font-bold">{player.nick}</div>
                <div className="text-[11px] lg:text-[12px] text-amber">You {factsFilled ? '· Ready' : '· Filling Info'}</div>
              </div>
              {factsFilled && <Badge variant="green">✓ Joined</Badge>}
            </div>

            {!factsFilled && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-[12px] text-muted mb-1">Please provide 4 fun facts about yourself:</div>
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    placeholder={`Fact #${i + 1}`}
                    className="w-full bg-black/20 border border-border/50 text-[13px] rounded-lg px-3 py-2 outline-none placeholder:text-muted/50 focus:border-amber transition-colors"
                    maxLength={100}
                    value={localFacts[i]}
                    onChange={(e) => {
                      const newFacts = [...localFacts];
                      newFacts[i] = e.target.value;
                      setLocalFacts(newFacts);
                    }}
                  />
                ))}
                <Button 
                  variant="coral" 
                  className="mt-2 text-[13px] py-2"
                  onClick={handleUpdateFacts}
                  disabled={!localFacts.every(f => f.trim() !== '')}
                >
                  Submit Facts
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-[22px] lg:mx-0 mb-4 bg-gradient-to-br from-coral to-[#ff8c6b] rounded-[14px] p-5 text-center shadow-xl shadow-coral/20">
            <div className="text-[11px] tracking-[2px] uppercase text-white/70 font-semibold mb-2">Host Dashboard</div>
            <div className="text-[32px] font-black tracking-[8px] text-white leading-none mb-2">{gameCode}</div>
            <div className="text-[12px] text-white/80 leading-[1.4]">Waiting for players to join...</div>
          </div>
        )}

        <div className="mt-auto hidden lg:block">
          {isHost ? (
            <div className="flex flex-col gap-2">
              <Button variant="coral" onClick={onStart} className="w-full" disabled={!canStart}>Start Game Now →</Button>
              {!canStart && <div className="text-[11px] text-muted text-center italic">Requires at least 5 players to start</div>}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-coral animate-pulse-slow"></div>
              <div className="text-[13px] text-muted">Waiting for host to start the game...</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area (Joined Players) */}
      <div className="flex-1 flex flex-col lg:overflow-hidden relative min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-hide lg:p-8">
          <div className="px-[22px] pb-2 lg:px-0 lg:pb-5">
            <div className="text-[10px] lg:text-[12px] tracking-[2.5px] uppercase text-muted font-semibold">Also in the lobby ({others.length})</div>
          </div>
          
          <div className="px-[22px] lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
            {others.map((o) => (
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
            <div className="text-[13px] text-muted">
              {isHost ? "Waiting for players..." : "Waiting for host to start the game..."}
            </div>
          </div>
        </div>

        <div className="p-4 px-[22px] pb-9 shrink-0 lg:hidden">
          {isHost ? (
            <div className="flex flex-col gap-2">
              <Button variant="coral" onClick={onStart} disabled={!canStart}>Start Game Now →</Button>
              {!canStart && <div className="text-[11px] text-muted text-center italic">Requires at least 5 players to start</div>}
            </div>
          ) : (
            <div className="text-center text-muted text-[13px] italic mb-4">Waiting on host...</div>
          )}
        </div>
      </div>
    </div>
  );
};
