import React, { useEffect, useState } from 'react';
import type { Opponent } from '../../data';
import { COLORS } from '../../data';

interface EndScreenProps {
  playerScore: number;
  playerMaxStreak: number;
  playerNick: string;
  playerColor: string;
  opponents: Opponent[];
}

export const EndScreen: React.FC<EndScreenProps> = ({
  playerScore,
  playerMaxStreak,
  playerNick,
  playerColor,
  opponents,
}) => {
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number; duration: number }[]>([]);
  const [showPhrase, setShowPhrase] = useState(false);

  useEffect(() => {
    // Generate confetti
    const newConfetti = [];
    for (let i = 0; i < 20; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % 5],
        delay: Math.random() * 0.8,
        duration: 0.8 + Math.random() * 0.6,
      });
    }
    setConfetti(newConfetti);

    const timer = setTimeout(() => setShowPhrase(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const all = [...opponents];
  if (playerNick !== 'Host') {
    all.push({ name: 'You', nick: playerNick, color: playerColor, score: playerScore, streak: 0, maxStreak: playerMaxStreak });
  }
  all.sort((a, b) => b.score - a.score);

  const handleRxn = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => {
      el.style.transform = '';
    }, 200);
  };

  return (
    <div className="flex flex-col h-full lg:h-full w-full lg:flex-row relative">
      
      <div className="w-full lg:w-[60%] lg:border-r lg:border-border lg:bg-black/20 flex flex-col items-center justify-center relative py-6 lg:py-10">
        <div className="w-full text-center px-5 mb-8 lg:mb-12 z-10">
          <div className="inline-block text-[10px] lg:text-[14px] tracking-[2.5px] uppercase text-muted font-bold">Game over</div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute top-0 w-[7px] lg:w-[10px] h-[11px] lg:h-[16px] rounded-[2px] animate-fall"
              style={{
                left: `${c.left}%`,
                background: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="flex items-end justify-center gap-2 lg:gap-4 px-5 w-full mt-4 z-10">
          {/* Silver */}
          {all[1] && (
            <div className="flex flex-col items-center gap-1 lg:gap-2">
              <div className="text-[36px] animate-drop-in" style={{ animationDelay: '0s' }}>
                <div
                  className="w-[44px] h-[44px] lg:w-[64px] lg:h-[64px] rounded-full flex items-center justify-center text-[14px] lg:text-[18px] font-extrabold text-[#1a0f00]"
                  style={{ background: all[1].color }}
                >
                  {getInitials(all[1].name)}
                </div>
              </div>
              <div className="text-[11px] lg:text-[14px] font-bold text-center max-w-[76px] lg:max-w-[100px] truncate w-full">{all[1].nick}</div>
              <div className="w-[76px] lg:w-[100px] rounded-t-md flex items-center justify-center text-[16px] lg:text-[24px] font-extrabold h-[60px] lg:h-[100px] bg-[#9ca3af] text-[#1a1a1a]">
                🥈
              </div>
            </div>
          )}

          {/* Gold */}
          {all[0] && (
            <div className="flex flex-col items-center gap-1 lg:gap-2">
              <div className="text-[36px] animate-drop-in" style={{ animationDelay: '0.2s' }}>
                <div
                  className="w-[44px] h-[44px] lg:w-[80px] lg:h-[80px] rounded-full flex items-center justify-center text-[14px] lg:text-[22px] font-extrabold text-[#1a0f00]"
                  style={{ background: all[0].color }}
                >
                  {getInitials(all[0].name)}
                </div>
              </div>
              <div className="text-[11px] lg:text-[16px] font-bold text-center max-w-[76px] lg:max-w-[120px] truncate w-full">{all[0].nick}</div>
              <div className="w-[76px] lg:w-[120px] rounded-t-md flex items-center justify-center text-[16px] lg:text-[32px] font-extrabold h-[80px] lg:h-[140px] bg-amber text-[#1a0f00]">
                🥇
              </div>
            </div>
          )}

          {/* Bronze */}
          {all[2] && (
            <div className="flex flex-col items-center gap-1 lg:gap-2">
              <div className="text-[36px] animate-drop-in" style={{ animationDelay: '0.4s' }}>
                <div
                  className="w-[44px] h-[44px] lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center text-[14px] lg:text-[18px] font-extrabold text-[#1a0f00]"
                  style={{ background: all[2].color }}
                >
                  {getInitials(all[2].name)}
                </div>
              </div>
              <div className="text-[11px] lg:text-[14px] font-bold text-center max-w-[76px] lg:max-w-[100px] truncate w-full">{all[2].nick}</div>
              <div className="w-[76px] lg:w-[100px] rounded-t-md flex items-center justify-center text-[16px] lg:text-[24px] font-extrabold h-[44px] lg:h-[70px] bg-[#b87333] text-[#1a1a1a]">
                🥉
              </div>
            </div>
          )}
        </div>

        <div
          className={`mx-5 mt-6 lg:mt-10 text-[18px] lg:text-[28px] font-black text-center text-coral italic transition-all duration-600 z-10 ${
            showPhrase ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          {all[0]?.nick} dominated. 🔥
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0 lg:p-8">
        <div className="flex-1 overflow-y-auto px-5 py-3.5 lg:px-0 lg:py-0 w-full scrollbar-hide mt-4 lg:mt-0">
          <div className="text-[10px] lg:text-[12px] tracking-[2px] uppercase text-muted font-semibold mb-2.5 lg:mb-5">Final standings</div>
          <div className="bg-surface lg:bg-surface/60 lg:backdrop-blur-sm rounded-[14px] border border-border overflow-hidden">
            {all.map((p, i) => (
              <div key={p.nick} className="flex items-center gap-2.5 lg:gap-4 py-[9px] lg:py-3.5 px-3 lg:px-5 border-b border-border/50 text-[13px] lg:text-[15px] hover:bg-surface/50 transition-colors">
                <div className="w-[18px] lg:w-[24px] font-bold text-muted text-[12px] lg:text-[14px] text-center">{i + 1}</div>
                <div
                  className="w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-[10px] lg:text-[12px] font-extrabold text-[#1a0f00]"
                  style={{ background: p.color }}
                >
                  {getInitials(p.name)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{p.nick}</div>
                  {p.maxStreak > 1 && (
                    <div className="text-[10px] lg:text-[11px] text-coral mt-0.5">🔥 Longest streak: {p.maxStreak}</div>
                  )}
                </div>
                <div className="font-extrabold text-amber text-[14px] lg:text-[18px]">{Math.round(p.score)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 lg:gap-4 justify-center px-5 py-3.5 pb-8 lg:p-0 lg:mt-8 w-full shrink-0">
          {['🔥', '😂', '😱', '👏', '👑'].map((emoji, i) => (
            <div
              key={i}
              className="text-[22px] lg:text-[28px] bg-surface lg:bg-surface/60 lg:backdrop-blur-sm border border-border rounded-full w-[46px] h-[46px] lg:w-[60px] lg:h-[60px] flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover:border-amber/50 active:scale-90"
              onClick={handleRxn}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
