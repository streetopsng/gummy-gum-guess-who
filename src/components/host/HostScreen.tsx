import React from 'react';
import type { Opponent } from '../../data';

interface HostScreenProps {
  round: number;
  totalRounds: number;
  opponents: Opponent[];
  sessionPlayers: any; // to check who answered
}

export const HostScreen: React.FC<HostScreenProps> = ({ round, totalRounds, opponents, sessionPlayers }) => {
  const getInitials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const sortedOpponents = [...opponents].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full w-full p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[24px] lg:text-[32px] font-black text-amber">
          Host Dashboard
        </div>
        <div className="text-[14px] lg:text-[16px] text-muted tracking-[2px] uppercase font-bold">
          Round {round} of {totalRounds}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="bg-surface/50 border border-border rounded-[16px] p-6 flex flex-col min-h-0">
          <div className="text-[14px] uppercase tracking-[1.5px] text-muted font-bold mb-6 shrink-0">Current Round Status</div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {opponents.map(p => {
              const hasAnswered = sessionPlayers[p.nick]?.answers?.[round - 1];
              return (
                <div key={p.nick} className="flex items-center gap-3 p-3 bg-surface border border-border/50 rounded-xl">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold text-[#1a0f00]"
                    style={{ background: p.color }}
                  >
                    {getInitials(p.name)}
                  </div>
                  <div className="flex-1 font-bold text-[15px]">{p.nick}</div>
                  {hasAnswered ? (
                    <div className="text-green text-[13px] font-bold px-3 py-1 bg-green/10 rounded-full">Answered</div>
                  ) : (
                    <div className="text-amber text-[13px] font-bold px-3 py-1 bg-amber/10 rounded-full animate-pulse">Waiting...</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface/50 border border-border rounded-[16px] p-6 flex flex-col min-h-0">
          <div className="text-[14px] uppercase tracking-[1.5px] text-muted font-bold mb-6 shrink-0">Leaderboard</div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {sortedOpponents.map((p, i) => (
              <div key={p.nick} className="flex items-center gap-3 p-3 bg-surface border border-border/50 rounded-xl">
                <div className="w-6 text-center text-[14px] font-bold text-muted">{i + 1}</div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold text-[#1a0f00]"
                  style={{ background: p.color }}
                >
                  {getInitials(p.name)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[15px]">{p.nick}</div>
                  {p.streak >= 2 && <div className="text-[11px] text-coral mt-0.5">🔥 {p.streak} streak</div>}
                </div>
                <div className="text-[18px] font-black text-amber">{p.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
