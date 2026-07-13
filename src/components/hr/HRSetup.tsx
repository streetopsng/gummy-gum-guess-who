import React, { useState } from 'react';
import { TEAM_WITH_IMAGES } from '../../data';
import { Button } from '../ui/Button';

export interface HRUpload {
  fact: string;
  photo: string;
  complete: boolean;
}

export type HRUploadsState = Record<string, HRUpload>;

interface HRSetupProps {
  onBack: () => void;
  onReview: (uploads: HRUploadsState) => void;
}

export const HRSetup: React.FC<HRSetupProps> = ({ onBack, onReview }) => {
  const [uploads, setUploads] = useState<HRUploadsState>(() => {
    const initial: HRUploadsState = {};
    TEAM_WITH_IMAGES.forEach((m) => {
      initial[m.nick] = { fact: m.fact, photo: m.imgSrc || '', complete: true };
    });
    return initial;
  });





  const handleFactChange = (nick: string, val: string) => {
    setUploads((prev) => ({
      ...prev,
      [nick]: { ...prev[nick], fact: val, complete: val.trim().length > 5 }
    }));
  };

  const handleRandomFact = (nick: string, originalFact: string) => {
    handleFactChange(nick, originalFact);
  };

  const handleRandomPhoto = (nick: string, imgSrc: string) => {
    setUploads((prev) => ({
      ...prev,
      [nick]: { ...prev[nick], photo: imgSrc }
    }));
  };

  const totalCount = TEAM_WITH_IMAGES.length;
  const readyCount = Object.values(uploads).filter((u) => u.complete).length;
  const progress = (readyCount / totalCount) * 100;

  const handleReview = () => onReview(uploads);

  return (
    <div className="flex flex-col h-full lg:h-full w-full lg:flex-row relative">
      
      {/* Desktop Left Sidebar / Mobile Top Header */}
      <div className="lg:w-[280px] lg:border-r lg:border-border lg:bg-black/20 lg:p-6 lg:flex lg:flex-col shrink-0 hidden lg:block">
        <button
          className="w-[34px] h-[34px] rounded-full bg-surface border border-border text-white text-[16px] cursor-pointer flex items-center justify-center shrink-0 mb-6"
          onClick={onBack}
        >
          ←
        </button>
        <div className="text-[10px] tracking-[2.5px] uppercase text-muted font-semibold">Step 1 of 2</div>
        <div className="text-[24px] font-extrabold mb-6">Setup roster</div>
        
        <div className="bg-surface2 rounded-full h-1.5 w-full mb-3 overflow-hidden">
          <div className="bg-green h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-[12px] text-muted mb-8">{readyCount} of {totalCount} ready</div>
        
        <div className="mt-auto">
          <Button variant="coral" onClick={handleReview} className="w-full">
            Review game
          </Button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="px-[22px] pt-5 pb-0 flex items-center gap-[14px] lg:hidden shrink-0">
        <button
          className="w-[34px] h-[34px] rounded-full bg-surface border border-border text-white text-[16px] cursor-pointer flex items-center justify-center shrink-0"
          onClick={onBack}
        >
          ←
        </button>
        <div>
          <div className="text-[10px] tracking-[2.5px] uppercase text-muted font-semibold">Step 1 of 2</div>
          <div className="text-[20px] font-extrabold">Setup roster</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        <div className="px-5 pt-5 pb-3 lg:hidden shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted mb-1.5">
            <div>Progress</div>
            <div>{readyCount} / {totalCount} ready</div>
          </div>
          <div className="bg-surface2 rounded-full h-1 w-full overflow-hidden">
            <div className="bg-green h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-5">
            {TEAM_WITH_IMAGES.map((m) => {
              const u = uploads[m.nick] || { fact: '', photo: null, complete: false };
              return (
                <div key={m.nick} className="bg-surface lg:bg-surface/60 lg:backdrop-blur-sm border border-border rounded-[14px] p-3.5 lg:p-5 flex gap-3.5 items-start lg:items-center hover:border-amber/50 transition-colors">
                  <div
                    className="w-[64px] h-[84px] lg:w-[80px] lg:h-[100px] bg-surface2 rounded-md shrink-0 flex items-center justify-center text-[24px] lg:text-[32px] cursor-pointer overflow-hidden group relative"
                    style={{ backgroundColor: `${m.color}15` }}
                  >
                    {u.photo ? (
                      <img src={u.photo} className="w-full h-full object-cover" alt="Upload" />
                    ) : (
                      '📸'
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-bold">+ Replace</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[13px] lg:text-[15px] font-bold flex items-center gap-2">
                      {m.name}
                      {u.complete && <div className="w-[8px] h-[8px] rounded-full bg-green animate-pop-in"></div>}
                    </div>
                    <div className="text-[11px] lg:text-[12px] mt-[1px] text-amber mb-2">{m.nick}</div>
                    
                    <div className="flex items-center gap-2 mb-2 lg:mb-3">
                      <button
                        className="text-[11px] text-coral border border-coral/30 rounded py-1 px-2 hover:bg-coral/10 transition-colors"
                        onClick={() => handleRandomFact(m.nick, m.fact)}
                      >
                        Auto-fill Fact
                      </button>
                      <button
                        className="text-[11px] text-coral border border-coral/30 rounded py-1 px-2 hover:bg-coral/10 transition-colors"
                        onClick={() => handleRandomPhoto(m.nick, m.imgSrc)}
                      >
                        Auto-fill Photo
                      </button>
                    </div>

                    <textarea
                      placeholder="e.g. Can eat 10 hotdogs in a minute..."
                      className="w-full bg-transparent border-b border-border text-[13px] lg:text-[14px] py-1 outline-none resize-none placeholder:text-muted/50 focus:border-amber transition-colors"
                      rows={2}
                      value={u.fact}
                      onChange={(e) => handleFactChange(m.nick, e.target.value)}
                    ></textarea>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Action */}
        <div className="px-5 pb-8 pt-3 shrink-0 lg:hidden">
          <Button variant="coral" onClick={handleReview}>Review game →</Button>
        </div>
      </div>
    </div>
  );
};
