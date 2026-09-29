import React from 'react';
import { IconCheck, IconClose } from '../ui/Icons';

interface SessionEndedProps {
  completed?: boolean;
}

export const SessionEnded: React.FC<SessionEndedProps> = ({ completed = false }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    <div className="relative bg-surface border border-border rounded-[24px] w-full max-w-[400px] mx-auto p-8 text-center">
      <div className={`w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center ${completed ? 'bg-green/15 text-green' : 'bg-coral/15 text-coral'}`}>
        {completed ? <IconCheck className="w-7 h-7" /> : <IconClose className="w-7 h-7" />}
      </div>
      <h1 className="text-white text-xl font-bold mb-3">{completed ? 'Game Complete' : 'Session Ended'}</h1>
      <p className="text-white/70 text-[15px]">
        {completed
          ? 'The game is complete and the host has closed this session. Thanks for playing! You can close this tab now.'
          : 'The host ended this session. You can close this tab now.'}
      </p>
    </div>
  </div>
);
