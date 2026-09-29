import React from 'react';
import { Button } from '../ui/Button';
import { IconClose } from '../ui/Icons';

interface EndSessionButtonProps {
  onClick: () => void;
  className?: string;
}

export const EndSessionButton: React.FC<EndSessionButtonProps> = ({ onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-coral/15 hover:bg-coral/25 border border-coral/50 text-xs font-bold text-coral transition-colors cursor-pointer ${className}`}
  >
    <IconClose className="w-3.5 h-3.5" />
    <span>End session</span>
  </button>
);

interface EndSessionModalProps {
  ending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({ ending, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={ending ? undefined : onCancel} />
    <div className="relative bg-surface border border-border rounded-[24px] w-full max-w-[400px] mx-auto p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-coral/15 text-coral flex items-center justify-center">
        <IconClose className="w-7 h-7" />
      </div>
      <h1 className="text-white text-xl font-bold mb-3">End this session?</h1>
      <p className="text-white/70 text-[15px] mb-6">
        Everyone will be removed and the session will close in GummyGum.
      </p>
      <div className="flex flex-col gap-2.5">
        <Button variant="coral" onClick={onConfirm} disabled={ending} className={ending ? 'opacity-60 cursor-wait' : ''}>
          {ending ? 'Ending session...' : 'End session'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={ending}>Cancel</Button>
      </div>
    </div>
  </div>
);
