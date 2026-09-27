import React from 'react';
import { Button } from './ui/Button';

interface GameRulesModalProps {
  onConfirm: () => void;
  name?: string;
}

export const GameRulesModal: React.FC<GameRulesModalProps> = ({ onConfirm, name }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="bg-[#181C24] border-2 border-white/10 rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh] overflow-y-auto text-white">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] text-[11px] font-extrabold uppercase tracking-wider mb-2">
            Game Overview
          </div>
          <h3 className="text-2xl sm:text-[26px] font-black text-[#F4F6FA] tracking-tight">
            How Guess Who Works
          </h3>
          <p className="text-xs sm:text-[13px] text-muted mt-1.5 leading-relaxed">
            Welcome{name ? `, ${name}` : ''}! Before you enter the game, here's what to expect in this experience.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1F242F] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 text-[#F5A623] font-black text-sm flex items-center justify-center shrink-0 border border-[#F5A623]/30">
              1
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Submit your secret facts</div>
              <div className="text-[11.5px] text-muted mt-0.5 leading-snug">
                Share unexpected facts, hidden talents, or funny habits that your teammates might not know.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1F242F] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 text-[#F5A623] font-black text-sm flex items-center justify-center shrink-0 border border-[#F5A623]/30">
              2
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Clues are revealed on board</div>
              <div className="text-[11.5px] text-muted mt-0.5 leading-snug">
                One clue is displayed at a time. Read carefully and think about who on your team matches the description.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1F242F] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 text-[#F5A623] font-black text-sm flex items-center justify-center shrink-0 border border-[#F5A623]/30">
              3
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Guess & reveal teammates</div>
              <div className="text-[11.5px] text-muted mt-0.5 leading-snug">
                Lock in your guesses before time runs out. The host reveals the mystery identity and awards points!
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-3 bg-[#F5A623]/10 border border-[#F5A623]/25 rounded-xl text-left flex items-center gap-2.5 mb-6">
          <span className="text-base shrink-0">💡</span>
          <span className="text-[11.5px] text-[#F5A623] font-medium leading-snug">
            <strong>Pro tip:</strong> Pick surprising facts that aren't mentioned in your standard work profile!
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant="amber"
          onClick={onConfirm}
          className="w-full py-3.5 text-sm sm:text-base font-bold rounded-xl cursor-pointer"
        >
          Got it, enter lobby →
        </Button>
      </div>
    </div>
  );
};
