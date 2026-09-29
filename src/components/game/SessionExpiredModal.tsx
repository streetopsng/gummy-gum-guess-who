import React from 'react';
import { Button } from '../ui/Button';
import { IconClose } from '../ui/Icons';
import { closeGummyGumSession } from '../../lib/gummygumSession';
import type { ExpiryContext } from '../../lib/sessionExpiry';

interface SessionExpiredModalProps {
  isHost: boolean;
  context: ExpiryContext;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isHost, context }) => {
  const handleClose = () => {
    try {
      window.close();
    } catch {
      // ignore
    }
  };

  const message = context === 'game'
    ? isHost
      ? 'This session was abandoned mid-game with nobody connected for several hours, so it has been ended. You can return to GummyGum to launch a fresh session.'
      : 'This session was ended after being abandoned for several hours. Thank you for being here - you can safely close this tab now.'
    : isHost
      ? 'This session was inactive in the lobby for more than 20 minutes and has expired. You can return to GummyGum to launch a fresh session.'
      : 'This session has expired due to inactivity. Thank you for being here - you can safely close this tab now.';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-surface border border-border rounded-[24px] w-full max-w-[400px] mx-auto p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-coral/15 text-coral flex items-center justify-center">
          <IconClose className="w-7 h-7" />
        </div>
        <h1 className="text-white text-xl font-bold mb-3">Session Expired</h1>
        <p className="text-white/70 text-[15px] mb-6">{message}</p>
        {isHost ? (
          <Button variant="amber" onClick={() => closeGummyGumSession()}>Return to GummyGum to Rehost</Button>
        ) : (
          <Button variant="ghost" onClick={handleClose}>Close Tab</Button>
        )}
      </div>
    </div>
  );
};
