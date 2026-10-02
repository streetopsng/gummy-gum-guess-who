import { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, set, onValue, update, get, child, increment, runTransaction } from 'firebase/database';
import type { TeamMember } from '../data';
import { isFromEarlierRoom } from '../lib/sessionExpiry';

export class GameInProgressError extends Error {
  constructor() {
    super('This game has already started.');
    this.name = 'GameInProgressError';
  }
}

export interface PlayerState {
  name: string;
  nick: string;
  color: string;
  facts: string[];
  imgSrc: string;
  avatarId?: string;
  score: number;
  streak: number;
  maxStreak: number;
  answers?: Record<number, boolean>;
  ggEmail?: string;
}

export interface GameSession {
  status: 'lobby' | 'playing' | 'ended' | 'expired';
  gameQueue: any[]; // will be GameRoundItem[]
  players?: Record<string, PlayerState>;
  createdAt?: number;
  startedAt?: number;
  lastActivity?: number;
  abandoned?: boolean;
  endedAt?: number;
  completed?: boolean;
  roundStartedAt?: Record<number, number>;
  hostedSessionId?: string;
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

  const createSession = async (code: string, hostedSessionId?: string | null) => {
    const sessionRef = ref(database, `sessions/${code}`);
    await set(sessionRef, {
      status: 'lobby',
      createdAt: Date.now(),
      gameQueue: [],
      uploads: {},
      players: {},
      ...(hostedSessionId ? { hostedSessionId } : {}),
    });
  };

  const joinSession = async (code: string, player: TeamMember): Promise<TeamMember> => {
    const playersRef = ref(database, `sessions/${code}/players`);
    const playersSnapshot = await get(playersRef);
    const players: Record<string, PlayerState> = playersSnapshot.exists() ? playersSnapshot.val() : {};
    const statusSnapshot = await get(ref(database, `sessions/${code}/status`));

    // A rejoin (new tab/browser, no persisted auth) is only recognizable by
    // the GummyGum-verified email — the nick is free text the guest can
    // retype differently each time, so it can't be trusted as the identity.
    const email = normalizeEmail(player.ggEmail);
    if (email) player = { ...player, ggEmail: email };
    const existingKey = findPlayerKeyByEmail(players, email);

    if (existingKey) return toTeamMember(players[existingKey], email);
    // Rounds wait for every guesser, so a newcomer with no past answers would rewind the game for everyone.
    if (statusSnapshot.val() === 'playing') throw new GameInProgressError();

    let nick = player.nick;
    if (players[nick]) {
      if (!player.ggEmail) {
        throw new Error("This codename is already taken by someone else!");
      }
      // Invite names are read-only, so a duplicate gets a suffix instead of a dead-end error.
      let n = 2;
      while (players[`${player.nick} ${n}`]) n++;
      nick = `${player.nick} ${n}`;
    }
    const joined: TeamMember = nick === player.nick ? player : { ...player, name: nick, nick };
    const playerRef = ref(database, `sessions/${code}/players/${nick}`);

    await set(playerRef, {
      name: joined.name,
      nick,
      color: player.color,
      facts: player.facts,
      imgSrc: player.imgSrc || '',
      avatarId: player.avatarId || '',
      ...(player.ggEmail && { ggEmail: player.ggEmail }),
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: {}
    });
    return joined;
  };

  const updatePlayerFacts = async (code: string, nick: string, facts: string[]) => {
    const playerRef = ref(database, `sessions/${code}/players/${nick}`);
    await update(playerRef, { facts });
  };

  const updatePlayerAnswer = async (
    code: string,
    nick: string,
    points: number,
    streak: number,
    maxStreak: number,
    roundIndex: number,
    isCorrect: boolean,
    factOwnerNick: string,
    totalPlayers: number
  ): Promise<boolean> => {
    // Claim the round first so a duplicate submission (e.g. after a refresh) can't score twice.
    const claim = await runTransaction(
      ref(database, `sessions/${code}/players/${nick}/answers/${roundIndex}`),
      (current) => (current === null ? isCorrect : undefined)
    );
    if (!claim.committed) return false;

    const updates: any = {};
    updates[`sessions/${code}/players/${nick}/score`] = increment(points);
    updates[`sessions/${code}/players/${nick}/streak`] = streak;
    updates[`sessions/${code}/players/${nick}/maxStreak`] = maxStreak;

    // Fact owner gets points if someone guesses wrong
    if (!isCorrect && nick !== factOwnerNick) {
      const ownerPoints = Math.round(400 / totalPlayers);
      updates[`sessions/${code}/players/${factOwnerNick}/score`] = increment(ownerPoints);
    }

    await update(ref(database), updates);
    return true;
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
          imgSrc: p.imgSrc,
          avatarId: p.avatarId
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
      startedAt: Date.now(),
      roundStartedAt: null,
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

// First client to show a round stamps its start; everyone derives the countdown from that.
export async function markRoundStarted(code: string, roundIndex: number): Promise<void> {
  await runTransaction(ref(database, `sessions/${code}/roundStartedAt/${roundIndex}`), (current) => current ?? Date.now());
}

export async function touchSessionActivity(code: string): Promise<void> {
  await update(ref(database, `sessions/${code}`), { lastActivity: Date.now() });
}

export async function markSessionExpired(code: string, abandoned: boolean): Promise<void> {
  await update(ref(database, `sessions/${code}`), abandoned ? { status: 'expired', abandoned: true } : { status: 'expired' });
}

export async function markSessionEnded(code: string, completed: boolean): Promise<void> {
  await update(ref(database, `sessions/${code}`), { status: 'ended', endedAt: Date.now(), completed });
}

export function normalizeEmail(email?: string | null): string {
  return (email || '').toLowerCase().trim();
}

export function findPlayerKeyByEmail(players: Record<string, PlayerState> | undefined, email: string): string | undefined {
  if (!email || !players) return undefined;
  return Object.keys(players).find((key) => normalizeEmail(players[key].ggEmail) === email);
}

export function toTeamMember(existing: PlayerState, email: string): TeamMember {
  return {
    name: existing.name,
    nick: existing.nick,
    color: existing.color,
    facts: existing.facts,
    imgSrc: existing.imgSrc,
    avatarId: existing.avatarId,
    ggEmail: email,
  };
}

export async function getSession(code: string): Promise<GameSession | null> {
  const snapshot = await get(ref(database, `sessions/${code}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function stampHostedSession(code: string, hostedSessionId: string): Promise<void> {
  await update(ref(database, `sessions/${code}`), { hostedSessionId });
}

// Resolves once the host has (re)created the room for this hosted session.
export function waitForLaunchRoom(code: string, hostedSessionId: string): Promise<void> {
  return new Promise((resolve) => {
    const status = { done: false };
    const unsubscribe = onValue(ref(database, `sessions/${code}`), (snapshot) => {
      const room = snapshot.exists() ? (snapshot.val() as GameSession) : null;
      if (status.done || !room || isFromEarlierRoom(room, hostedSessionId)) return;
      status.done = true;
      resolve();
      setTimeout(() => unsubscribe(), 0);
    });
  });
}

export async function checkSessionExists(code: string): Promise<boolean> {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `sessions/${code}`));
  return snapshot.exists() && snapshot.val()?.status !== 'ended';
}
