import React from 'react';
import { Button } from '../ui/Button';
import { IconClose } from '../ui/Icons';
import { returnToGummyGum } from '../../lib/gummygumSession';

interface LateJoinModalProps {
  canReturnToHub: boolean;
}

export const LateJoinModal: React.FC<LateJoinModalProps> = ({ canReturnToHub }) => {
  const handleClose = () => {
    try {
      window.close();
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-surface border border-border rounded-[24px] w-full max-w-[400px] mx-auto p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-coral/15 text-coral flex items-center justify-center">
          <IconClose className="w-7 h-7" />
        </div>
        <h1 className="text-white text-xl font-bold mb-3">Game Already in Progress</h1>
        <p className="text-white/70 text-[15px] mb-6">
          You joined a little late - this game has already started, so new participants can't jump in mid-game. Catch the next one!
        </p>
        {canReturnToHub ? (
          <Button variant="amber" onClick={() => returnToGummyGum()}>Back to GummyGum</Button>
        ) : (
          <Button variant="ghost" onClick={handleClose}>Close Tab</Button>
        )}
      </div>
    </div>
  );
};
