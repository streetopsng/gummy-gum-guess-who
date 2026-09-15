import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface HostSetupProps {
  onBack: () => void;
  onLaunch: (gameCode: string) => void;
}

export const HostSetup: React.FC<HostSetupProps> = ({ onBack, onLaunch }) => {
  const [gameCode, setGameCode] = useState('');

  useEffect(() => {
    setGameCode('GW-' + Math.floor(100 + Math.random() * 900));
  }, []);

  return (
    <div className="flex flex-col h-full lg:h-full w-full relative justify-center items-center px-5 py-8">
      <div className="w-full max-w-[400px] flex flex-col items-center">

        <div className="text-[26px] lg:text-[32px] font-black text-center mb-1.5">Host a Game</div>
        <div className="text-[13px] lg:text-[14px] text-muted text-center mb-8 leading-[1.5]">
          Set up your game room and launch when ready.
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button variant="coral" onClick={() => onLaunch(gameCode)}>
            Create Game Room →
          </Button>
          <Button variant="ghost" onClick={onBack} className="mt-4 opacity-70">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
