import React, { useState } from 'react';
import { COLORS, makeSVG } from '../../data';
import type { TeamMember } from '../../data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PlayerJoinProps {
  onBack: () => void;
  onJoin: (player: TeamMember, code: string) => Promise<void>;
}

export const PlayerJoin: React.FC<PlayerJoinProps> = ({ onBack, onJoin }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
  const [fact, setFact] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!code.trim() || !name.trim() || !nick.trim() || !fact.trim() || !hint.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (/[.#$\[\]]/.test(nick)) {
      setError('Codename cannot contain special characters like . # $ [ ]');
      return;
    }

    setError('');
    
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const bgColors = ['#2a1a0a', '#0a1a2a', '#1a0a2a', '#0a2a1a', '#2a0a0a', '#2a1a0a', '#0a2a2a', '#2a0a1a'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    const emojiList = ['😎', '😊', '🤩', '😁', '😌', '😏', '😄', '🕵️', '🦊', '🦉'];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    const player: TeamMember = {
      name: name.trim(),
      nick: nick.trim(),
      color: randomColor,
      fact: fact.trim(),
      hint: hint.trim(),
      imgSrc: makeSVG(emoji, randomBg)
    };

    try {
      await onJoin(player, code.trim().toUpperCase());
    } catch (e: any) {
      setError(e.message || "Failed to join game");
    }
  };

  return (
    <div className="h-full w-full relative overflow-y-auto px-5 py-8 flex flex-col">
      <div className="w-full max-w-[400px] mx-auto flex flex-col items-center my-auto pb-8">
        <div className="text-[26px] lg:text-[32px] font-black text-center mb-1.5 mt-4">Join the game</div>
        <div className="text-[13px] lg:text-[14px] text-muted text-center mb-7 leading-[1.5]">
          Enter the code your host shared and tell us about yourself.
        </div>
        
        <div className="w-full flex flex-col gap-3">
          <Input 
            placeholder="Game code (e.g. GW-491)" 
            maxLength={10} 
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input 
            placeholder="Your full name (e.g. Jane Doe)" 
            maxLength={30} 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            placeholder="Codename/Nickname (e.g. QuietStorm)" 
            maxLength={20} 
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <textarea
            placeholder="A Fun Fact about you... (make it hard to guess!)"
            className="w-full bg-surface/50 border border-border text-[13px] rounded-xl px-4 py-3 outline-none resize-none placeholder:text-muted/50 focus:border-amber transition-colors"
            rows={3}
            maxLength={120}
            value={fact}
            onChange={(e) => setFact(e.target.value)}
          />
          <Input 
            placeholder="A hint (e.g. Works in Engineering)" 
            maxLength={40} 
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            error={error}
          />
          
          <Button variant="coral" onClick={handleJoin} className="mt-4">Join game →</Button>
          <Button variant="ghost" onClick={onBack}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};
