import React from 'react';
import { Button } from '../ui/Button';
import { IconClose } from '../ui/Icons';
import { returnToGummyGum, getGummyGumSession } from '../../lib/gummygumSession';

export const SessionEnded: React.FC = () => {
  const isHost = !!getGummyGumSession()?.isHost;

  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-[24px] w-full max-w-[400px] mx-auto p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-coral/15 text-coral flex items-center justify-center">
          <IconClose className="w-7 h-7" />
        </div>
        <h1 className="text-white text-xl font-bold mb-3">Session Ended</h1>
        <p className="text-white/70 text-[15px] mb-6">
          {isHost
            ? 'The host ended this session. You can return to GummyGum now.'
            : 'The host ended this session. You can close this tab now.'}
        </p>
        {isHost && (
          <Button variant="amber" onClick={() => returnToGummyGum()}>Return to GummyGum</Button>
        )}
      </div>
    </div>
  );
};
