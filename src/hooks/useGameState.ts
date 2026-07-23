import { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, set, onValue, update, get, child, increment } from 'firebase/database';
import type { TeamMember } from '../data';

export interface PlayerState {
  name: string;
  nick: string;
  color: string;
  facts: string[];
  imgSrc: string;
  score: number;
  streak: number;
  maxStreak: number;
  answers?: Record<number, boolean>;
}

export interface GameSession {
  status: 'lobby' | 'playing' | 'ended';
  gameQueue: any[]; // will be GameRoundItem[]
  players?: Record<string, PlayerState>;
}

export function useGameState(gameCode?: string) {
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    if (!gameCode) {
      setSession(null);
      return;
    }
    const sessionRef = ref(database, `sessions/${gameCode}`);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        setSession(snapshot.val());
      } else {
        setSession(null);
      }
    });

    return () => unsubscribe();
  }, [gameCode]);

  const createSession = async (code: string) => {
    const sessionRef = ref(database, `sessions/${code}`);
    await set(sessionRef, {
      status: 'lobby',
      gameQueue: [],
      uploads: {},
      players: {}
    });
  };

  const joinSession = async (code: string, player: TeamMember) => {
    const playerRef = ref(database, `sessions/${code}/players/${player.nick}`);
    
    // Check if the codename is already taken
    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      throw new Error("This codename is already taken by someone else!");
    }

    await set(playerRef, {
      name: player.name,
      nick: player.nick,
      color: player.color,
      facts: player.facts,
      imgSrc: player.imgSrc || '',
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: {}
    });
  };

  const updatePlayerFacts = async (code: string, nick: string, facts: string[]) => {
    const playerRef = ref(database, `sessions/${code}/players/${nick}`);
    await update(playerRef, { facts });
  };

  const updatePlayerAnswer = async (
    code: string, 
    nick: string, 
    score: number, 
    streak: number, 
    maxStreak: number, 
    roundIndex: number,
    isCorrect: boolean,
    factOwnerNick: string,
    totalPlayers: number
  ) => {
    const updates: any = {};
    updates[`sessions/${code}/players/${nick}/score`] = score;
    updates[`sessions/${code}/players/${nick}/streak`] = streak;
    updates[`sessions/${code}/players/${nick}/maxStreak`] = maxStreak;
    // Save true if correct, false if incorrect (for tracking in the UI)
    updates[`sessions/${code}/players/${nick}/answers/${roundIndex}`] = isCorrect;

    // Fact owner gets points if someone guesses wrong
    if (!isCorrect && nick !== factOwnerNick) {
      const ownerPoints = Math.round(400 / totalPlayers);
      updates[`sessions/${code}/players/${factOwnerNick}/score`] = increment(ownerPoints);
    }

    await update(ref(database), updates);
  };

  const startGame = async (code: string, players: Record<string, PlayerState>) => {
    const playerFacts: Record<string, any[]> = {};
    const playerKeys = Object.keys(players);
    
    playerKeys.forEach(key => {
      const p = players[key];
      playerFacts[key] = p.facts
        .filter(f => f.trim())
        .map(f => ({
          name: p.name,
          nick: p.nick,
          color: p.color,
          facts: p.facts,
          currentFact: f,
          imgSrc: p.imgSrc
        }));
      
      // Shuffle each player's facts
      for (let i = playerFacts[key].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playerFacts[key][i], playerFacts[key][j]] = [playerFacts[key][j], playerFacts[key][i]];
      }
    });

    const arr: any[] = [];
    let currentPlayerIndex = 0;
    let factsAdded = 0;
    
    const totalAvailableFacts = Object.values(playerFacts).reduce((sum, facts) => sum + facts.length, 0);
    const targetFacts = Math.min(15, totalAvailableFacts);

    while (factsAdded < targetFacts) {
      const key = playerKeys[currentPlayerIndex];
      if (playerFacts[key] && playerFacts[key].length > 0) {
        arr.push(playerFacts[key].pop());
        factsAdded++;
      }
      currentPlayerIndex = (currentPlayerIndex + 1) % playerKeys.length;
    }
    
    // Shuffle the final array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const sessionRef = ref(database, `sessions/${code}`);
    await update(sessionRef, {
      status: 'playing',
      gameQueue: arr
    });
  };

  return {
    session,
    createSession,
    joinSession,
    updatePlayerFacts,
    updatePlayerAnswer,
    startGame
  };
}

export async function checkSessionExists(code: string): Promise<boolean> {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `sessions/${code}`));
  return snapshot.exists() && snapshot.val().status === 'lobby';
}
