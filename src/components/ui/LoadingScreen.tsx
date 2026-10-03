import React, { useEffect, useState } from 'react';
import { BackgroundFx } from './BackgroundFx';

const MESSAGES = [
  'Loading…',
  'Still connecting… please wait',
  "This is taking longer than usual — check your internet connection. We'll keep trying.",
];

// Guess Who only runs from a GummyGum launch, so this stands in for any screen that would otherwise be a landing page.
export const LoadingScreen: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const slow = setTimeout(() => setStage(1), 8000);
    const stalled = setTimeout(() => setStage(2), 20000);
    return () => {
      clearTimeout(slow);
      clearTimeout(stalled);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-transparent font-sans flex items-center justify-center p-6">
      <BackgroundFx />
      <div className="relative w-full max-w-[360px] mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-white/15 border-t-amber animate-spin" />
        <p className="text-white/80 text-[15px] font-semibold">{MESSAGES[stage]}</p>
      </div>
    </div>
  );
};
