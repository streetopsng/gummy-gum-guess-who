import React from 'react';
import type { Opponent } from '../../data';

interface RoundLeaderboardProps {
  round: number;
  totalRounds: number;
  opponents: Opponent[];
  playerScore: number;
  playerStreak: number;
  playerNick: string;
  playerColor: string;
  playerName: string;
}

export const RoundLeaderboard: React.FC<RoundLeaderboardProps> = ({
  round,
  totalRounds,
  opponents,
  playerScore,
  playerStreak,
  playerNick,
  playerColor,
  playerName
}) => {
  const getInitials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const meEntry = { name: playerName, nick: playerNick, color: playerColor, score: playerScore, streak: playerStreak, maxStreak: 0 };
  const allPlayers = [...opponents, meEntry].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full w-full p-6 lg:p-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[24px] lg:text-[32px] font-black text-amber">
          Round Standings
        </div>
        <div className="text-[14px] lg:text-[16px] text-muted tracking-[2px] uppercase font-bold">
          Round {round} of {totalRounds}
        </div>
      </div>
      
      <div className="bg-surface/50 border border-border rounded-[16px] p-6 flex flex-col flex-1 min-h-0 max-w-2xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
          {allPlayers.map((p, i) => (
            <div key={p.nick} className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${p.nick === playerNick ? 'bg-amber/10 border-amber/50 scale-[1.02]' : 'bg-surface border-border/50'}`}>
              <div className="w-8 text-center text-[16px] font-black text-muted">{i + 1}</div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-extrabold text-[#1a0f00]"
                style={{ background: p.color }}
              >
                {getInitials(p.name)}
              </div>
              <div className="flex-1 ml-2">
                <div className="font-bold text-[18px]">{p.nick} {p.nick === playerNick && <span className="text-[12px] text-amber ml-2">(You)</span>}</div>
                {p.streak >= 2 && <div className="text-[12px] text-coral mt-0.5">🔥 {p.streak} streak</div>}
              </div>
              <div className="text-[24px] font-black text-amber">{p.score}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-muted text-[14px] animate-pulse">
          Next round starting soon...
        </div>
      </div>
    </div>
  );
};
