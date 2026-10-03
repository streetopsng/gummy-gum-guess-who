import React, { useState } from 'react';
import { COLORS, makeSVG } from '../../data';
import type { TeamMember } from '../../data';
import { Button } from '../ui/Button';
import { AVATAR_IDS, avatarUrl } from '../../lib/avatars';
import { GameRulesModal } from '../GameRulesModal';
import { IconCheck, IconChevronRight } from '../ui/Icons';

interface PlayerJoinProps {
  onJoin: (player: TeamMember, code: string) => Promise<void>;
  code: string;
  initialNick?: string;
  ggEmail?: string;
}

// The nick doubles as a Realtime Database key, which cannot contain these characters.
const toSafeNick = (value: string) => value.replace(/[.#$[\]/]/g, '').trim();

const IconLock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

// The avatar step for a GummyGum invitee; the room comes from the launch, never typed in.
export const PlayerJoin: React.FC<PlayerJoinProps> = ({ onJoin, code, initialNick, ggEmail }) => {
  // GummyGum launches carry the invite name, which participants may not change.
  const lockedNick = initialNick ? toSafeNick(initialNick) : '';
  const [nick, setNick] = useState(lockedNick || initialNick || '');
  const [avatarId, setAvatarId] = useState(AVATAR_IDS[0]);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);

  const finalNick = (lockedNick || nick).trim();

  const handlePreJoin = () => {
    if (!code.trim() || !finalNick) {
      setError('Please enter a codename.');
      return;
    }

    if (/[.#$[\]/]/.test(finalNick)) {
      setError('Codename cannot contain special characters like . # $ [ ] /');
      return;
    }

    setError('');
    setShowRules(true);
  };

  const handleJoin = async () => {
    setShowRules(false);

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bgColors = ['#2a1a0a', '#0a1a2a', '#1a0a2a', '#0a2a1a', '#2a0a0a', '#2a1a0a', '#0a2a2a', '#2a0a1a'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const emojiList = ['😎', '😊', '🤩', '😁', '😌', '😏', '😄', '🕵️', '🦊', '🦉'];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    const player: TeamMember = {
      name: finalNick,
      nick: finalNick,
      color: randomColor,
      facts: ['', '', '', ''],
      imgSrc: makeSVG(emoji, randomBg),
      avatarId,
      ...(ggEmail && { ggEmail }),
    };

    try {
      await onJoin(player, code.trim().toUpperCase());
    } catch (e: any) {
      setError(e.message || 'Failed to join game');
    }
  };

  return (
    <div className="h-full lg:h-auto lg:max-h-[85vh] w-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5 pt-8 pb-5 lg:pt-10">
        <div className="w-full max-w-[440px] mx-auto">
          <div className="text-[11px] text-amber tracking-widest uppercase font-semibold mb-1.5">Guess Who?</div>
          <h1 className="text-[26px] lg:text-[30px] font-black leading-tight">
            Choose your avatar
          </h1>
          <p className="text-[13px] lg:text-[14px] text-muted mt-1.5 leading-[1.5]">
            This is how your teammates will see you during the game.
          </p>

          <div className="mt-6 bg-surface border border-border rounded-lg p-3.5 flex items-center gap-3.5">
            <img
              src={avatarUrl(avatarId)}
              alt=""
              className="w-14 h-14 rounded-full object-cover shrink-0 border-[1.5px] border-amber bg-surface2"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-muted tracking-widest uppercase font-semibold">Playing as</div>
              {lockedNick ? (
                <>
                  <div className="text-[17px] font-bold truncate mt-0.5">{lockedNick}</div>
                  <div className="flex items-center gap-1 text-[12px] text-muted mt-0.5">
                    <IconLock className="w-3 h-3 shrink-0" />
                    <span className="truncate">Name from your GummyGum invite</span>
                  </div>
                </>
              ) : (
                <input
                  aria-label="Codename or nickname"
                  placeholder="Codename (e.g. QuietStorm)"
                  maxLength={20}
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  className="w-full mt-1 bg-surface2 border border-border rounded-md text-white text-[14px] px-3 py-2.5 outline-none transition-colors duration-150 focus:border-amber placeholder:text-white/25"
                />
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-2.5">
              <div className="text-[11px] text-muted tracking-widest uppercase font-semibold">Avatar</div>
              <div className="text-[12px] text-muted">Tap to select</div>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-7 gap-2.5">
              {AVATAR_IDS.map((id) => {
                const isSelected = avatarId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarId(id)}
                    aria-label={`Avatar ${id.replace('av-', '')}`}
                    aria-pressed={isSelected}
                    className={`relative aspect-square rounded-full p-[3px] border-[1.5px] transition-colors duration-150 cursor-pointer ${
                      isSelected ? 'border-amber bg-amber/10' : 'border-border bg-surface hover:border-amber/50'
                    }`}
                  >
                    <img src={avatarUrl(id)} alt="" className="w-full h-full rounded-full object-cover" />
                    {isSelected && (
                      <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-amber text-[#1a0f00] flex items-center justify-center border-2 border-bg">
                        <IconCheck className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg/95 backdrop-blur-sm px-5 pt-3.5 pb-[max(14px,env(safe-area-inset-bottom))] lg:bg-transparent">
        <div className="w-full max-w-[440px] mx-auto flex flex-col gap-2">
          {error && <div className="text-[12px] text-red text-center" role="alert">{error}</div>}
          <Button variant="coral" onClick={handlePreJoin} className="flex items-center justify-center gap-1.5">
            Continue <IconChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showRules && (
        <GameRulesModal
          onConfirm={handleJoin}
          name={finalNick}
        />
      )}
    </div>
  );
};
