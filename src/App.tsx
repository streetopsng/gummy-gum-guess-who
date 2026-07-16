import { useState, useEffect, useMemo } from 'react';
import { ModeSelect } from './components/ModeSelect';
import { HRReview } from './components/hr/HRReview';
import { PlayerJoin } from './components/player/PlayerJoin';
import { PlayerLobby } from './components/player/PlayerLobby';
import { GameScreen } from './components/game/GameScreen';
import { EndScreen } from './components/game/EndScreen';
import { HostScreen } from './components/host/HostScreen';
import type { TeamMember, Opponent } from './data';
import { useGameState, checkSessionExists } from './hooks/useGameState';

import { BackgroundFx } from './components/ui/BackgroundFx';

type Screen = 'MODE_SELECT' | 'HR_SETUP' | 'HR_REVIEW' | 'PLAYER_JOIN' | 'PLAYER_LOBBY' | 'GAME' | 'HOST_DASHBOARD' | 'END';

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

  // Global State removed since HR Setup is skipped
  
  // Realtime Game State
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const { session, createSession, joinSession, updatePlayerFacts, updatePlayerAnswer, startGame } = useGameState(gameCode || undefined);
  
  // Local Player State
  const [player, setPlayer] = useState<TeamMember | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2400);
  };

  const flash = (color: 'green' | 'red') => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 320);
  };

  // Derive Current Round
  const curQ = useMemo(() => {
    if (!session || !session.players || !session.gameQueue || session.gameQueue.length === 0) return 0;
    const players = Object.values(session.players);
    if (players.length === 0) return 0;
    
    // Find the first round where NOT all players have answered
    for (let r = 0; r < session.gameQueue.length; r++) {
      const allAnswered = players.every(p => p.answers && p.answers[r]);
      if (!allAnswered) return r;
    }
    return session.gameQueue.length; // End of game
  }, [session]);

  useEffect(() => {
    if (session) {
      if (session.status === 'playing' && screen === 'PLAYER_LOBBY') {
        setScreen(isHost ? 'HOST_DASHBOARD' : 'GAME');
      }
      if (session.gameQueue && curQ >= session.gameQueue.length && session.gameQueue.length > 0 && (screen === 'GAME' || screen === 'HOST_DASHBOARD')) {
        setScreen('END');
      }
    }
  }, [session, screen, curQ, isHost]);

  const handleHRLaunch = async (code: string) => {
    await createSession(code);
    setGameCode(code);
    setIsHost(true);
    setScreen('PLAYER_JOIN');
  };

  const handlePlayerJoin = async (p: TeamMember, code: string) => {
    const exists = await checkSessionExists(code);
    if (!exists) {
      throw new Error("Game session not found or already started.");
    }
    setGameCode(code);
    setPlayer(p);
    await joinSession(code, p);
    setScreen('PLAYER_LOBBY');
  };

  const handleStartGame = async () => {
    if (gameCode && session && session.players) {
      await startGame(gameCode, session.players);
    }
  };

  const handleAnswer = async (correct: boolean, points: number) => {
    if (!gameCode || !player || !session) return;
    
    const myState = session.players?.[player.nick];
    let newScore = (myState?.score || 0) + points;
    let newStreak = correct ? (myState?.streak || 0) + 1 : 0;
    let newMaxStreak = Math.max(myState?.maxStreak || 0, newStreak);
    
    if (correct) {
      if (newStreak >= 5) showToast('💥 UNSTOPPABLE!');
      else if (newStreak >= 3) showToast('🔥 ON FIRE!');
      else if (newStreak >= 2) showToast('⚡ Streak!');
      flash('green');
    } else {
      flash('red');
    }

    await updatePlayerAnswer(gameCode, player.nick, newScore, newStreak, newMaxStreak, curQ);
  };

  const opponents: Opponent[] = useMemo(() => {
    if (!session || !session.players) return [];
    return Object.values(session.players)
      .filter(p => p.nick !== player?.nick)
      .map(p => ({
        name: p.name,
        nick: p.nick,
        color: p.color,
        score: p.score,
        streak: p.streak,
        maxStreak: p.maxStreak
      }));
  }, [session, player]);

  const myState = session?.players?.[player?.nick || ''];
  const playerScore = myState?.score || 0;
  const playerStreak = myState?.streak || 0;
  const playerMaxStreak = myState?.maxStreak || 0;

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
            <ModeSelect onSelect={(m) => setScreen(m === 'hr' ? 'HR_REVIEW' : 'PLAYER_JOIN')} />
          )}

          {screen === 'HR_REVIEW' && (
            <HRReview 
              onBack={() => setScreen('MODE_SELECT')} 
              onLaunch={handleHRLaunch} 
            />
          )}

          {screen === 'PLAYER_JOIN' && (
            <PlayerJoin 
              onBack={() => setScreen('MODE_SELECT')} 
              onJoin={handlePlayerJoin} 
            />
          )}

          {screen === 'PLAYER_LOBBY' && (
            <PlayerLobby 
              player={player || undefined} 
              isHost={isHost}
              gameCode={gameCode || ''}
              joinedPlayers={session?.players ? Object.values(session.players) : []}
              onStart={handleStartGame}
              onUpdateFacts={(facts) => {
                if (gameCode && player) {
                  updatePlayerFacts(gameCode, player.nick, facts);
                }
              }}
            />
          )}

          {screen === 'HOST_DASHBOARD' && session && session.gameQueue && session.gameQueue.length > 0 && curQ < session.gameQueue.length && (
            <HostScreen 
              round={curQ + 1}
              totalRounds={session.gameQueue.length}
              opponents={opponents}
              sessionPlayers={session.players || {}}
            />
          )}

          {screen === 'GAME' && session && session.gameQueue && session.gameQueue.length > 0 && curQ < session.gameQueue.length && (
            <GameScreen 
              subject={session.gameQueue[curQ]} 
              options={shuffle([
                session.gameQueue[curQ], 
                ...shuffle(Object.values(session.players || {}).filter(p => p.nick !== session.gameQueue[curQ].nick)).slice(0, 3)
              ]) as TeamMember[]}
              round={curQ + 1}
              totalRounds={session.gameQueue.length}
              score={playerScore}
              streak={playerStreak}
              opponents={opponents}
              playerNick={player?.nick || ''}
              playerColor={player?.color || ''}
              onAnswer={handleAnswer}
            />
          )}

          {screen === 'END' && (
            <EndScreen 
              playerScore={playerScore}
              playerMaxStreak={playerMaxStreak}
              playerNick={player?.nick || ''}
              playerColor={player?.color || '#000'}
              opponents={opponents}
              onHome={() => {
                setScreen('MODE_SELECT');
                setGameCode(null);
                setPlayer(null);
                setIsHost(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
