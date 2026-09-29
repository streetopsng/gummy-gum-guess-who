import React, { useEffect, useRef, useState } from 'react';
import type { TeamMember, Opponent } from '../../data';
import { avatarUrl } from '../../lib/avatars';
import { IconFlame, IconCheck, IconClose } from '../ui/Icons';

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
  playerAvatarId?: string;
  onAnswer: (correct: boolean, points: number) => void;
  isHost?: boolean;
  roundStartedAt?: number;
  persistedAnswer?: boolean;
}

const ROUND_SECONDS = 15;

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
  playerAvatarId,
  onAnswer,
  isHost = false,
  roundStartedAt,
  persistedAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  // Fallback until the shared round start (persisted in RTDB) arrives; that one survives a refresh.
  const localStartRef = useRef(Date.now());
  const [answered, setAnswered] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  // The persisted answer covers a refresh after answering, when local state is gone.
  const hasPersisted = typeof persistedAnswer === 'boolean';
  const isAnswered = answered || hasPersisted;
  const showReveal = reveal || hasPersisted;
  const shownCorrect = answered ? isCorrect : !!persistedAnswer;

  useEffect(() => {
    localStartRef.current = Date.now();
    setTimeLeft(ROUND_SECONDS);
    setAnswered(false);
    setSelectedCard(null);
    setReveal(false);
    setIsCorrect(false);
  }, [subject]);

  useEffect(() => {
    if (isAnswered || isHost) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const start = roundStartedAt ?? localStartRef.current;
      const left = Math.max(0, ROUND_SECONDS - Math.floor((Date.now() - start) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        if (timer) clearInterval(timer);
        handleTimeUp();
        return true;
      }
      return false;
    };
    if (tick()) return;
    timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, isHost, roundStartedAt, subject]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer(null, false);
    }
  };

  const getMultiplier = (s: number) => (s >= 5 ? 2.0 : s >= 3 ? 1.5 : s >= 2 ? 1.2 : 1.0);

  const handleAnswer = (nick: string | null, clickedCorrect: boolean) => {
    if (isAnswered) return;
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
  const fact = subject.currentFact;

  const isFactOwner = subject.nick === playerNick;
  const isNonInteractive = isFactOwner || isHost;

  const meEntry = { name: 'You', nick: playerNick, color: playerColor, score, streak, avatarId: playerAvatarId };
  const allPlayers = isHost ? opponents : [...opponents, meEntry];
  const top3 = [...allPlayers].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="flex flex-col h-full lg:h-full w-full relative">
      <div className="px-5 pt-4 pb-2 lg:px-8 lg:pt-8 flex items-center justify-between shrink-0">
        <div>
          <div className="text-[11px] lg:text-[13px] text-muted tracking-[1.5px] uppercase font-semibold">
            Round {round} of {totalRounds}
          </div>
        </div>
        {!isHost && (
          <div className="text-right">
            <div className="text-[22px] lg:text-[32px] font-black text-amber leading-none">{score}</div>
            {streak >= 2 && (
              <div className="text-[11px] lg:text-[13px] text-coral mt-1 flex items-center justify-end gap-1">
                <IconFlame className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> {streak} streak
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
        
        {/* Left/Top: Polaroid & Timer */}
        <div className="flex-none lg:flex-1 flex flex-col justify-center items-center px-5 pt-2 pb-2 lg:p-8 lg:border-r lg:border-border/50">
          <div
            className={`w-[220px] lg:w-[280px] bg-cream rounded-sm p-5 lg:p-6 pb-12 lg:pb-16 border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.35)] relative transition-transform duration-150 flex items-center justify-center ${
              showReveal && !shownCorrect && !isFactOwner ? 'animate-shake' : ''
            } ${showReveal && !isFactOwner ? 'animate-flip-reveal' : ''}`}
          >
            <div className="text-[16px] lg:text-[20px] text-[#2a2010] text-center leading-[1.4] italic font-medium min-h-[120px] flex items-center justify-center w-full">
              "{fact}"
            </div>

            <div
              className={`absolute bottom-3 lg:bottom-4 left-0 right-0 text-center text-[15px] lg:text-[18px] font-extrabold text-coral tracking-[0.5px] ${
                showReveal || isNonInteractive ? 'block' : 'hidden'
              }`}
            >
              {isFactOwner ? "Your Fact" : subject.name}
            </div>

            {!isNonInteractive && (
              <>
                <div
                  className={`absolute inset-0 bg-[#22C55E40] rounded-sm flex flex-col items-center justify-center ${
                    showReveal && shownCorrect ? 'animate-pop-in flex' : 'hidden'
                  }`}
                >
                  <IconCheck className="w-12 h-12 lg:w-16 lg:h-16 text-[#166534]" strokeWidth={2.5} />
                  {isAnswered && <div className="text-[12px] font-bold mt-2 animate-pulse bg-black/50 text-white px-3 py-1 rounded-full">Waiting for others...</div>}
                </div>

                <div
                  className={`absolute inset-0 bg-[#EF444440] rounded-sm flex flex-col items-center justify-center ${
                    showReveal && !shownCorrect ? 'animate-pop-in flex' : 'hidden'
                  }`}
                >
                  <IconClose className="w-12 h-12 lg:w-16 lg:h-16 text-[#991b1b]" strokeWidth={2.5} />
                  {isAnswered && <div className="text-[12px] font-bold mt-2 animate-pulse bg-black/50 text-white px-3 py-1 rounded-full">Waiting for others...</div>}
                </div>
              </>
            )}
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
          
          <div className="hidden lg:flex justify-end mb-6">
            <div className="bg-surface/40 backdrop-blur-md border border-border rounded-lg px-4 py-2 flex gap-6">
              {top3.map((p, i) => (
                <div key={p.nick} className="flex items-center gap-2">
                  <div className="text-[14px] font-bold text-muted">{i + 1}</div>
                  {p.avatarId ? (
                    <img src={avatarUrl(p.avatarId)} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-[#1a0f00]"
                      style={{ background: p.color }}
                    >
                      {getInitials(p.name)}
                    </div>
                  )}
                  <div>
                    <div className="text-[11px] font-bold leading-none mb-0.5" style={{ color: p.color }}>{p.nick}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber">{Math.round(p.score)}</span>
                      {p.streak >= 2 && (
                        <span className="text-[9px] text-coral flex items-center gap-0.5">
                          <IconFlame className="w-2.5 h-2.5" />{p.streak}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isNonInteractive ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-8 lg:mt-0">
              <div className="text-[20px] lg:text-[24px] font-bold text-amber mb-3">
                {isFactOwner ? "This is your fact!" : "Everyone's guessing…"}
              </div>
              <div className="text-[14px] lg:text-[16px] text-muted">
                {isFactOwner ? "Watch the others guess..." : `Who does "${subject.name}"'s fact belong to?`}
              </div>
              <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 bg-coral rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-8 lg:mt-0">
              {options.map((opt) => {
                const isSelected = selectedCard === opt.nick;
                const isTarget = opt.nick === subject.nick;
                let btnClass = 'border-border bg-surface lg:bg-surface/60 lg:backdrop-blur-sm';
                let avatarClass = '';
                
                if (showReveal) {
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
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt.nick, isTarget)}
                    className={`border-[1.5px] rounded-[14px] p-3 lg:p-5 cursor-pointer transition-all duration-150 flex flex-col items-center gap-1.5 lg:gap-2.5 text-center ${btnClass} ${!isAnswered ? 'hover:border-amber hover:bg-[#F5A62314] lg:hover:-translate-y-1' : ''}`}
                  >
                    {opt.avatarId ? (
                      <img
                        src={avatarUrl(opt.avatarId)}
                        className="w-[38px] h-[38px] lg:w-[54px] lg:h-[54px] rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-[38px] h-[38px] lg:w-[54px] lg:h-[54px] rounded-full flex items-center justify-center text-[13px] lg:text-[18px] font-extrabold text-[#1a0f00] ${avatarClass}`}
                        style={{ background: opt.color }}
                      >
                        {getInitials(opt.name)}
                      </div>
                    )}
                    <div className="text-[12px] lg:text-[15px] font-bold leading-[1.3]">{opt.name}</div>
                    <div className="text-[10px] lg:text-[12px] text-muted">{opt.nick}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
