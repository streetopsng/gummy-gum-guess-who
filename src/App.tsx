import { useState, useEffect, useMemo, useRef } from 'react';
import { ModeSelect } from './components/ModeSelect';
import { HostSetup } from './components/host/HostSetup';
import { PlayerJoin } from './components/player/PlayerJoin';
import { PlayerLobby } from './components/player/PlayerLobby';
import { GameScreen } from './components/game/GameScreen';
import { RoundReaction } from './components/game/RoundReaction';
import { RoundLeaderboard } from './components/game/RoundLeaderboard';
import { EndScreen } from './components/game/EndScreen';
import type { TeamMember, Opponent } from './data';
import { useGameState, checkSessionExists } from './hooks/useGameState';
import { resolveGummyGumLaunch, reportGummyGumResult } from './lib/gummygumSession';
import type { GummyGumLaunchSession } from './lib/gummygumSession';

import { BackgroundFx } from './components/ui/BackgroundFx';
import { Button } from './components/ui/Button';

type Screen = 'MODE_SELECT' | 'HOST_SETUP' | 'PLAYER_JOIN' | 'PLAYER_LOBBY' | 'GAME' | 'ROUND_REACTION' | 'ROUND_LEADERBOARD' | 'END' | 'LOCKED';
type GummyGumAccessState = 'checking' | 'granted' | 'denied';

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

  const [visualRound, setVisualRound] = useState(0);

  const [ggAccessState, setGgAccessState] = useState<GummyGumAccessState>('checking');
  const [ggSession, setGgSession] = useState<GummyGumLaunchSession | null>(null);

  useEffect(() => {
    resolveGummyGumLaunch()
      .then((session) => {
        setGgSession(session);
        setGgAccessState(session ? 'granted' : 'denied');
      })
      .catch((err) => {
        console.error('GummyGum launch resolve failed', err);
        setGgAccessState('denied');
      });
  }, []);

  // Skip the host/join code entry entirely once GummyGum has already told
  // us the room and role — the player still picks a nickname/avatar on
  // PLAYER_JOIN since GummyGum's identity doesn't map to that shape.
  const ggRoutedRef = useRef(false);
  useEffect(() => {
    if (!ggSession || !ggSession.roomCode || ggRoutedRef.current || screen !== 'MODE_SELECT') return;
    ggRoutedRef.current = true;
    const code = ggSession.roomCode;
    (async () => {
      if (ggSession.isHost) {
        // Also what makes GummyGum's room pre-creation work: if GummyGum already created this room, we skip creating a new one and just join it.
        const exists = await checkSessionExists(code);
        if (!exists) await createSession(code);
        setIsHost(true);
      }
      setGameCode(code);
      setScreen('PLAYER_JOIN');
    })();
  }, [ggSession, screen, createSession]);

  // Derive Current Round
  const curQ = useMemo(() => {
    if (!session || !session.players || !session.gameQueue || session.gameQueue.length === 0) return 0;
    const players = Object.values(session.players);
    if (players.length === 0) return 0;
    
    // Find the first round where NOT all guessers have answered
    for (let r = 0; r < session.gameQueue.length; r++) {
      const currentSubjectNick = session.gameQueue[r].nick;
      const guessers = players.filter(p => p.nick !== currentSubjectNick);
      const allAnswered = guessers.every(p => p.answers && typeof p.answers[r] !== 'undefined');
      if (!allAnswered) return r;
    }
    return session.gameQueue.length; // End of game
  }, [session]);

  useEffect(() => {
    if (session) {
      if (session.status === 'playing' && screen === 'PLAYER_LOBBY') {
        setScreen('GAME');
        setVisualRound(0);
      }
      if (session.status === 'playing' && screen === 'GAME' && curQ > visualRound) {
        setScreen('ROUND_REACTION');
        setTimeout(() => {
          setScreen('ROUND_LEADERBOARD');
          setTimeout(() => {
            setVisualRound(curQ);
            if (curQ >= session.gameQueue.length) {
              setScreen('END');
            } else {
              setScreen('GAME');
            }
          }, 5000);
        }, 5000);
      }
    }
  }, [session, screen, curQ, visualRound]);

  const handleHostLaunch = async (code: string) => {
    if (ggAccessState === 'denied') {
      setScreen('LOCKED');
      return;
    }
    await createSession(code);
    setGameCode(code);
    setIsHost(true);
    setScreen('PLAYER_JOIN');
  };

  const handlePlayerJoin = async (p: TeamMember, code: string) => {
    if (ggAccessState === 'denied') {
      setScreen('LOCKED');
      return;
    }
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

    const currentSubject = session.gameQueue[curQ];
    const totalPlayers = session.players ? Object.keys(session.players).length : 0;

    await updatePlayerAnswer(
      gameCode, 
      player.nick, 
      newScore, 
      newStreak, 
      newMaxStreak, 
      curQ,
      correct,
      currentSubject.nick,
      totalPlayers
    );
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

  const currentVisualSubject = session?.gameQueue?.[visualRound];
  const wrongGuesses = useMemo(() => {
    if (!session || !session.players || !currentVisualSubject) return 0;
    return Object.values(session.players).filter(p => p.nick !== currentVisualSubject.nick && p.answers && p.answers[visualRound] === false).length;
  }, [session, visualRound, currentVisualSubject]);

  const totalPlayers = session?.players ? Object.keys(session.players).length : 0;

  // Report the launching player's (the host's) outcome back to the GummyGum
  // hub once their session reaches the final results screen. Guarded so it
  // only fires once per game, and never blocks or affects gameplay.
  const hasReportedRef = useRef(false);
  useEffect(() => {
    if (screen !== 'END' || !isHost || hasReportedRef.current || !session) return;
    hasReportedRef.current = true;

    const leaderboard = [...opponents];
    if (player) {
      leaderboard.push({
        name: player.name,
        nick: player.nick,
        color: player.color,
        score: playerScore,
        streak: playerStreak,
        maxStreak: playerMaxStreak,
      });
    }
    leaderboard.sort((a, b) => b.score - a.score);
    const rank = player ? leaderboard.findIndex((p) => p.nick === player.nick) + 1 : null;

    reportGummyGumResult({
      gameCode,
      totalRounds: session.gameQueue.length,
      totalPlayers,
      hostPlayed: !!player,
      finalScore: player ? playerScore : null,
      maxStreak: player ? playerMaxStreak : null,
      rank,
      leaderboard: leaderboard.map((p) => ({
        nick: p.nick,
        name: p.name,
        score: Math.round(p.score),
        maxStreak: p.maxStreak,
      })),
    }).catch((err) => console.error('GummyGum result report failed', err));
  }, [screen, isHost, session, gameCode, totalPlayers, opponents, player, playerScore, playerStreak, playerMaxStreak]);

  if (ggAccessState === 'checking') {
    return <div className="min-h-screen w-full bg-transparent" />;
  }

  if (ggSession && ggSession.roomCode && screen === 'MODE_SELECT') {
    return <div className="min-h-screen w-full bg-transparent" />;
  }

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
            <ModeSelect onSelect={(m) => setScreen(m === 'hr' ? 'HOST_SETUP' : 'PLAYER_JOIN')} />
          )}

          {screen === 'LOCKED' && (
            <div className="min-h-screen w-full relative bg-transparent font-sans flex justify-center items-center">
              <div className="w-full max-w-[400px] mx-auto p-8 text-center relative">
                <h1 className="text-white text-xl font-bold mb-3">Locked</h1>
                <p className="text-white/70 text-[15px] mb-6">
                  This experience is only available through GummyGum.
                </p>
                <a href="https://gummygum.app">
                  <Button variant="amber">Go to GummyGum</Button>
                </a>
              </div>
            </div>
          )}

          {screen === 'HOST_SETUP' && (
            <HostSetup 
              onBack={() => setScreen('MODE_SELECT')} 
              onLaunch={handleHostLaunch} 
            />
          )}

          {screen === 'PLAYER_JOIN' && (
            <PlayerJoin
              onBack={() => setScreen('MODE_SELECT')}
              onJoin={handlePlayerJoin}
              initialCode={gameCode || undefined}
              initialNick={ggSession?.player?.name || undefined}
              ggEmail={ggSession?.player?.email || undefined}
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

          {screen === 'ROUND_REACTION' && session && currentVisualSubject && (
            <RoundReaction
              subject={currentVisualSubject}
              playerNick={player?.nick || ''}
              wrongGuesses={wrongGuesses}
              totalPlayers={totalPlayers}
            />
          )}

          {screen === 'ROUND_LEADERBOARD' && session && (
            <RoundLeaderboard
              round={visualRound + 1}
              totalRounds={session.gameQueue.length}
              opponents={opponents}
              playerScore={playerScore}
              playerStreak={playerStreak}
              playerNick={player?.nick || ''}
              playerColor={player?.color || '#000'}
              playerName={player?.name || 'You'}
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
              playerNick={isHost && !player ? 'Host' : (player?.nick || '')}
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
