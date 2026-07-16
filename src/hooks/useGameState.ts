import { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, set, onValue, update, get, child } from 'firebase/database';
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

  const updatePlayerAnswer = async (code: string, nick: string, score: number, streak: number, maxStreak: number, roundIndex: number) => {
    const playerRef = ref(database, `sessions/${code}/players/${nick}`);
    await update(playerRef, {
      score,
      streak,
      maxStreak,
      [`answers/${roundIndex}`]: true
    });
  };

  const startGame = async (code: string, players: Record<string, PlayerState>) => {
    const arr: any[] = [];
    Object.values(players).forEach(p => {
      // Create a round for each valid fact
      p.facts.forEach(f => {
        if (f.trim()) {
          arr.push({
            name: p.name,
            nick: p.nick,
            color: p.color,
            facts: p.facts,
            currentFact: f,
            imgSrc: p.imgSrc
          });
        }
      });
    });
    
    // Shuffle the array locally before sending
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
