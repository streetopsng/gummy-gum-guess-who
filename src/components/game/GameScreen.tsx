import React, { useEffect, useState } from 'react';
import type { TeamMember, Opponent } from '../../data';

interface GameScreenProps {
  subject: any;
  options: TeamMember[];
  round: number;
  totalRounds: number;
  score: number;
  streak: number;
  opponents: Opponent[];
  playerNick: string;
  playerColor: string;
  onAnswer: (correct: boolean, points: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  subject,
  options,
  round,
  totalRounds,
  score,
  streak,
  opponents,
  playerNick,
  playerColor,
  onAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [imageClear, setImageClear] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Reset state for new round
    setTimeLeft(15);
    setAnswered(false);
    setSelectedCard(null);
    setImageClear(false);
    setReveal(false);
    setIsCorrect(false);

    // Unblur image after 1 second
    const unblurTimer = setTimeout(() => setImageClear(true), 1000);
    return () => clearTimeout(unblurTimer);
  }, [subject]);

  useEffect(() => {
    if (answered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered]);

  const handleTimeUp = () => {
    if (!answered) {
      handleAnswer(null, false);
    }
  };

  const getMultiplier = (s: number) => (s >= 5 ? 2.0 : s >= 3 ? 1.5 : s >= 2 ? 1.2 : 1.0);

  const handleAnswer = (nick: string | null, clickedCorrect: boolean) => {
    if (answered) return;
    setAnswered(true);
    setSelectedCard(nick);
    setReveal(true);
    setIsCorrect(clickedCorrect);

    let pts = 0;
    if (clickedCorrect) {
      pts = 100;
      if (timeLeft >= 10) pts += 50;
      pts = Math.round(pts * getMultiplier(streak));
    }

    // Call parent after a delay to show animations
    setTimeout(() => {
      onAnswer(clickedCorrect, pts);
    }, 1400);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const isDanger = timeLeft <= 5;
  const photo = subject.imgSrc;
  const fact = subject.currentFact;

  const meEntry = { name: 'You', nick: playerNick, color: playerColor, score, streak };
  const allPlayers = [...opponents, meEntry].sort((a, b) => b.score - a.score);
  const top3 = allPlayers.slice(0, 3);

  return (
    <div className="flex flex-col h-full lg:h-full w-full relative">
      {/* Header */}
      <div className="px-5 pt-4 pb-2 lg:px-8 lg:pt-8 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[11px] lg:text-[13px] text-muted tracking-[1.5px] uppercase font-semibold">
            Round {round} of {totalRounds}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[22px] lg:text-[32px] font-black text-amber leading-none">{score}</div>
          {streak >= 2 && (
            <div className="text-[11px] lg:text-[13px] text-coral mt-1">🔥 {streak} streak</div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
        
        {/* Left/Top: Polaroid & Timer */}
        <div className="flex-none lg:flex-1 flex flex-col justify-center items-center px-5 pt-2 pb-2 lg:p-8 lg:border-r lg:border-border/50">
          <div
            className={`w-[220px] lg:w-[280px] bg-cream rounded-sm p-2.5 lg:p-3.5 pb-8 lg:pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] relative transition-transform duration-150 ${
              reveal && !isCorrect ? 'animate-shake' : ''
            } ${reveal ? 'animate-flip-reveal' : ''}`}
          >
            <img
              src={photo}
              className={`w-full h-[180px] lg:h-[240px] object-cover rounded-[2px] block relative transition-all duration-1000 ease-in-out ${
                imageClear ? 'blur-none scale-100' : 'blur-[14px] scale-[1.05]'
              }`}
              alt="Mystery"
            />
            <div className="px-1 pt-2.5 lg:pt-3 text-[13px] lg:text-[15px] text-[#2a2010] text-center leading-[1.4] italic font-medium min-h-[42px] lg:min-h-[50px]">
              "{fact}"
            </div>

            <div
              className={`absolute bottom-1.5 lg:bottom-2 left-0 right-0 text-center text-[13px] lg:text-[15px] font-extrabold text-coral tracking-[0.5px] ${
                reveal ? 'block' : 'hidden'
              }`}
            >
              {subject.name}
            </div>

            <div
              className={`absolute inset-0 bg-[#22C55E40] rounded-sm flex flex-col items-center justify-center ${
                reveal && isCorrect ? 'animate-pop-in flex' : 'hidden'
              }`}
            >
              <div className="text-[52px] lg:text-[72px] leading-none">✓</div>
              {answered && <div className="text-[12px] font-bold mt-2 animate-pulse bg-black/50 text-white px-3 py-1 rounded-full">Waiting for others...</div>}
            </div>
            
            <div
              className={`absolute inset-0 bg-[#EF444440] rounded-sm flex flex-col items-center justify-center ${
                reveal && !isCorrect ? 'animate-pop-in flex' : 'hidden'
              }`}
            >
              <div className="text-[52px] lg:text-[72px] leading-none">✗</div>
              {answered && <div className="text-[12px] font-bold mt-2 animate-pulse bg-black/50 text-white px-3 py-1 rounded-full">Waiting for others...</div>}
            </div>
          </div>

          <div className="w-full max-w-[220px] lg:max-w-[280px] mt-4 shrink-0">
            <div className="h-1 lg:h-1.5 bg-surface2 rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm transition-all duration-1000 ease-linear ${
                  isDanger ? 'bg-red' : 'bg-coral'
                }`}
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] lg:text-[13px] text-muted text-right mt-1.5 lg:mt-2 font-bold">{timeLeft}s</div>
          </div>
        </div>

        {/* Right/Bottom: Options Grid & Hint */}
        <div className="flex-1 flex flex-col justify-center px-5 lg:p-8 relative">
          
          {/* Mini Leaderboard (Top 3) */}
          <div className="hidden lg:flex justify-end mb-6">
            <div className="bg-surface/40 backdrop-blur-md border border-border rounded-lg px-4 py-2 flex gap-6">
              {top3.map((p, i) => (
                <div key={p.nick} className="flex items-center gap-2">
                  <div className="text-[14px] font-bold text-muted">{i + 1}</div>
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-[#1a0f00]"
                    style={{ background: p.color }}
                  >
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold leading-none mb-0.5" style={{ color: p.color }}>{p.nick}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber">{Math.round(p.score)}</span>
                      {p.streak >= 2 && <span className="text-[9px] text-coral">🔥{p.streak}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-8 lg:mt-0">
            {options.map((opt) => {
              const isSelected = selectedCard === opt.nick;
              const isTarget = opt.nick === subject.nick;
              let btnClass = 'border-border bg-surface lg:bg-surface/60 lg:backdrop-blur-sm';
              let avatarClass = '';
              
              if (reveal) {
                if (isTarget) {
                  btnClass = 'border-green bg-[#22C55E26]';
                  avatarClass = '!bg-green';
                } else if (isSelected && !isTarget) {
                  btnClass = 'border-red bg-[#EF444426]';
                  avatarClass = '!bg-red';
                } else {
                  btnClass = 'opacity-30 border-border bg-surface lg:bg-surface/60';
                }
              } else if (isSelected) {
                btnClass = 'border-amber bg-[#F5A6231A]';
              }

              return (
                <button
                  key={opt.nick}
                  disabled={answered}
                  onClick={() => handleAnswer(opt.nick, isTarget)}
                  className={`border-[1.5px] rounded-[14px] p-3 lg:p-5 cursor-pointer transition-all duration-150 flex flex-col items-center gap-1.5 lg:gap-2.5 text-center ${btnClass} ${!answered ? 'hover:border-amber hover:bg-[#F5A62314] lg:hover:-translate-y-1' : ''}`}
                >
                  <div
                    className={`w-[38px] h-[38px] lg:w-[54px] lg:h-[54px] rounded-full flex items-center justify-center text-[13px] lg:text-[18px] font-extrabold text-[#1a0f00] ${avatarClass}`}
                    style={{ background: opt.color }}
                  >
                    {getInitials(opt.name)}
                  </div>
                  <div className="text-[12px] lg:text-[15px] font-bold leading-[1.3]">{opt.name}</div>
                  <div className="text-[10px] lg:text-[12px] text-muted">{opt.nick}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
