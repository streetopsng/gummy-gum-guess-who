import { useState } from 'react';
import { ModeSelect } from './components/ModeSelect';
import { HRSetup } from './components/hr/HRSetup';
import type { HRUploadsState } from './components/hr/HRSetup';
import { HRReview } from './components/hr/HRReview';
import { PlayerJoin } from './components/player/PlayerJoin';
import { PlayerLobby } from './components/player/PlayerLobby';
import { GameScreen } from './components/game/GameScreen';
import { EndScreen } from './components/game/EndScreen';
import { TEAM, TEAM_WITH_IMAGES, INITIAL_OPPONENTS } from './data';
import type { TeamMember, Opponent } from './data';

import { BackgroundFx } from './components/ui/BackgroundFx';

type Screen = 'MODE_SELECT' | 'HR_SETUP' | 'HR_REVIEW' | 'PLAYER_JOIN' | 'PLAYER_LOBBY' | 'GAME' | 'LEADERBOARD' | 'END';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function App() {
  const [screen, setScreen] = useState<Screen>('MODE_SELECT');
  const [toastMsg, setToastMsg] = useState('');
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);

  // Global State
  const [uploads, setUploads] = useState<HRUploadsState>({});
  
  // Player State
  const [player, setPlayer] = useState<TeamMember | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [playerMaxStreak, setPlayerMaxStreak] = useState(0);
  
  // Game State
  const [opponents, setOpponents] = useState<Opponent[]>(INITIAL_OPPONENTS);
  const [gameQueue, setGameQueue] = useState<TeamMember[]>([]);
  const [curQ, setCurQ] = useState(0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  };

  const flash = (color: 'green' | 'red') => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 320);
  };

  const getMultiplier = (s: number) => (s >= 5 ? 2.0 : s >= 3 ? 1.5 : s >= 2 ? 1.2 : 1.0);

  // Simulating opponents during the game
  const simOpponents = () => {
    setOpponents((prev) => 
      prev.map(o => {
        const ok = Math.random() < 0.6;
        if (ok) {
          const add = Math.round((100 + (Math.random() < 0.4 ? 50 : 0)) * getMultiplier(o.streak));
          const newStreak = o.streak + 1;
          return { ...o, score: o.score + add, streak: newStreak, maxStreak: Math.max(o.maxStreak, newStreak) };
        }
        return { ...o, streak: 0 };
      })
    );
  };

  const startGame = () => {
    setPlayerScore(0);
    setPlayerStreak(0);
    setPlayerMaxStreak(0);
    setOpponents(INITIAL_OPPONENTS.map(o => ({ ...o, score: 0, streak: 0, maxStreak: 0 })));
    setGameQueue(shuffle(TEAM_WITH_IMAGES).slice(0, 8));
    setCurQ(0);
    setScreen('GAME');
    
    // Random delay to simulate opponents answering
    setTimeout(simOpponents, 2000 + Math.random() * 7000);
  };

  const handleAnswer = (correct: boolean, points: number) => {
    if (correct) {
      setPlayerScore(prev => prev + points);
      setPlayerStreak(prev => {
        const newStreak = prev + 1;
        setPlayerMaxStreak(m => Math.max(m, newStreak));
        if (newStreak >= 5) showToast('💥 UNSTOPPABLE!');
        else if (newStreak >= 3) showToast('🔥 ON FIRE!');
        else if (newStreak >= 2) showToast('⚡ Streak!');
        return newStreak;
      });
      flash('green');
    } else {
      setPlayerStreak(0);
      flash('red');
    }

    // Wait 3 seconds to let players see the result, then auto-progress
    setTimeout(() => {
      handleNextRound();
    }, 3000);
  };

  const handleNextRound = () => {
    setCurQ(prev => {
      const nextQ = prev + 1;
      if (nextQ >= gameQueue.length) {
        setScreen('END');
        return prev;
      }
      setTimeout(simOpponents, 2000 + Math.random() * 5000);
      return nextQ;
    });
  };

  // Render Screens
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans flex justify-center lg:items-center">
      <BackgroundFx />
      <div className={`fixed inset-0 pointer-events-none z-[99] transition-opacity duration-150 ${flashColor === 'green' ? 'bg-[#22C55E33] opacity-100' : flashColor === 'red' ? 'bg-[#EF44442E] opacity-100' : 'opacity-0'}`}></div>
      
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface3 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full z-[200] pointer-events-none transition-all duration-300 border border-border whitespace-nowrap ${toastMsg ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'}`}>
        {toastMsg}
      </div>

      <div className="w-full h-full lg:h-auto lg:w-[1024px] lg:max-h-[85vh] lg:rounded-[24px] lg:bg-surface/60 lg:backdrop-blur-xl lg:border lg:border-white/10 lg:shadow-2xl lg:overflow-hidden relative flex">
        <div className="w-full flex-1 relative max-w-[430px] mx-auto lg:max-w-none">
          {screen === 'MODE_SELECT' && (
            <ModeSelect onSelect={(m) => setScreen(m === 'hr' ? 'HR_SETUP' : 'PLAYER_JOIN')} />
          )}
          
          {screen === 'HR_SETUP' && (
            <HRSetup 
              onBack={() => setScreen('MODE_SELECT')} 
              onReview={(up) => { setUploads(up); setScreen('HR_REVIEW'); }} 
            />
          )}

          {screen === 'HR_REVIEW' && (
            <HRReview 
              uploads={uploads} 
              onBack={() => setScreen('HR_SETUP')} 
              onLaunch={() => { showToast('Game live! Waiting for players...'); }} 
            />
          )}

          {screen === 'PLAYER_JOIN' && (
            <PlayerJoin 
              onBack={() => setScreen('MODE_SELECT')} 
              onJoin={(p) => { setPlayer(p); setScreen('PLAYER_LOBBY'); }} 
              onDemo={() => { 
                const demo = TEAM[Math.floor(Math.random() * TEAM.length)];
                setPlayer(demo);
                setScreen('PLAYER_LOBBY');
              }} 
            />
          )}

          {screen === 'PLAYER_LOBBY' && player && (
            <PlayerLobby 
              player={player} 
              onStart={startGame} 
            />
          )}

          {screen === 'GAME' && player && gameQueue.length > 0 && (
            <GameScreen 
              subject={gameQueue[curQ]} 
              options={shuffle([gameQueue[curQ], ...shuffle(TEAM.filter(m => m.nick !== gameQueue[curQ].nick)).slice(0, 3)])}
              round={curQ + 1}
              totalRounds={gameQueue.length}
              score={playerScore}
              streak={playerStreak}
              uploads={uploads}
              opponents={opponents}
              playerNick={player.nick}
              playerColor={player.color}
              onAnswer={handleAnswer}
            />
          )}

          {screen === 'END' && player && (
            <EndScreen 
              playerScore={playerScore}
              playerMaxStreak={playerMaxStreak}
              playerNick={player.nick}
              playerColor={player.color}
              opponents={opponents}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
