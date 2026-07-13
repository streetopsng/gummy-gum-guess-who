import React, { useState } from 'react';
import { TEAM } from '../../data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PlayerJoinProps {
  onBack: () => void;
  onJoin: (player: typeof TEAM[0]) => void;
  onDemo: () => void;
}

export const PlayerJoin: React.FC<PlayerJoinProps> = ({ onBack, onJoin, onDemo }) => {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!code.trim()) {
      setError('Enter the game code your HR shared.');
      return;
    }
    if (!nick.trim()) {
      setError('Enter your codename.');
      return;
    }
    const found = TEAM.find(m => m.nick.toUpperCase() === nick.trim().toUpperCase());
    if (!found) {
      setError('Codename not found on this team roster.');
      return;
    }
    setError('');
    onJoin(found);
  };

  return (
    <div className="flex flex-col h-full lg:h-full w-full min-h-screen lg:min-h-0 relative justify-center items-center px-7 py-10 gap-0">
      <div className="text-[15px] font-black text-amber absolute top-6 left-7 z-10">GummyGum</div>
      
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="flex items-center gap-2.5 bg-surface border border-border rounded-[40px] px-4 py-2.5 mb-7 lg:mb-8 lg:scale-110">
          <div className="text-[24px]">🕵️</div>
          <div>
            <div className="text-[14px] font-bold">Guess Who?</div>
            <div className="text-[11px] text-muted">StreetOps</div>
          </div>
        </div>
        
        <div className="text-[26px] lg:text-[32px] font-black text-center mb-1.5">Join the game</div>
        <div className="text-[13px] lg:text-[14px] text-muted text-center mb-7 leading-[1.5]">
          Enter the code your HR shared and your team codename.
        </div>
        
        <div className="w-full flex flex-col gap-2.5">
          <Input 
            placeholder="Game code (e.g. GW-491)" 
            maxLength={10} 
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input 
            placeholder="Your codename (e.g. QuietStorm)" 
            maxLength={20} 
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            error={error}
          />
          
          <Button variant="coral" onClick={handleJoin} className="mt-2">Join game →</Button>
          <Button variant="ghost" onClick={onBack}>Back</Button>
          
          <div className="flex items-center gap-2.5 mt-2 lg:mt-4">
            <div className="flex-1 h-[1px] bg-border"></div>
            <div className="text-[11px] text-muted uppercase tracking-widest font-semibold">or</div>
            <div className="flex-1 h-[1px] bg-border"></div>
          </div>
          
          <Button 
            variant="ghost" 
            className="border-[#FF5C384D] text-coral text-[13px] hover:border-coral lg:mt-2" 
            onClick={onDemo}
          >
            👀 Preview as player (no code needed)
          </Button>
        </div>
      </div>
    </div>
  );
};
