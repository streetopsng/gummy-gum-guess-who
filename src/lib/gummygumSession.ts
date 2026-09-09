// Handles the handoff from the GummyGum hub: verifying a launch token on
// load and reporting this experience's outcome back to the hub when the
// launching player (the host) finishes their game.

const API_URL = import.meta.env.VITE_GUMMYGUM_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'gummygum_launch_session';

export interface GummyGumPlayer {
  id: string;
  name: string;
  email: string;
}

export interface GummyGumLaunchSession {
  sessionId: string;
  experienceId: string;
  isGuest: boolean;
  player: GummyGumPlayer | null;
  reportToken: string;
  roomCode: string | null;
  isHost: boolean;
  hubUrl: string;
  round: number;
  reported: boolean;
}

interface VerifyLaunchResponse {
  success: true;
  data: {
    sessionId: string;
    experienceId: string;
    isGuest: boolean;
    player: GummyGumPlayer | null;
    reportToken: string;
    roomCode?: string | null;
    isHost?: boolean;
    hubUrl?: string;
  };
}

export function getGummyGumSession(): GummyGumLaunchSession | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as GummyGumLaunchSession;
  } catch {
    return null;
  }
}

export async function resolveGummyGumLaunch(): Promise<GummyGumLaunchSession | null> {
  const params = new URLSearchParams(window.location.search);
  const ggt = params.get('ggt');

  if (!ggt) {
    return getGummyGumSession();
  }

  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: ggt }),
    });
    const body = (await res.json()) as VerifyLaunchResponse;
    if (!res.ok || !body.success) return null;

    const hubUrl = body.data.hubUrl || (typeof document !== 'undefined' && document.referrer ? new URL(document.referrer).origin : 'https://gummygum.app');

    const session: GummyGumLaunchSession = {
      sessionId: body.data.sessionId,
      experienceId: body.data.experienceId,
      isGuest: body.data.isGuest,
      player: body.data.player,
      reportToken: body.data.reportToken,
      roomCode: body.data.roomCode ?? null,
      isHost: Boolean(body.data.isHost),
      hubUrl,
      round: 1,
      reported: false,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    params.delete('ggt');
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));

    return session;
  } catch (err) {
    console.error('GummyGum launch verify failed', err);
    return null;
  }
}

export async function reportGummyGumResult(report: Record<string, unknown>): Promise<void> {
  const session = getGummyGumSession();
  if (!session || !session.reportToken) return;

  try {
    await fetch(`${API_URL}/api/gummygum/launch/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report }),
    });
    session.reported = true;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('GummyGum result report failed', err);
  }
}

// Host-only: explicitly close session, ensure final report submitted, and return to GummyGum
export async function closeGummyGumSession(finalReport?: Record<string, unknown>): Promise<void> {
  const session = getGummyGumSession();
  if (!session) {
    window.location.href = 'https://gummygum.app';
    return;
  }

  if (!session.isHost) {
    console.warn('Only the session host can close the session.');
    returnToGummyGum();
    return;
  }

  try {
    await fetch(`${API_URL}/api/gummygum/launch/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report: finalReport }),
    });
  } catch (err) {
    console.error('GummyGum close session failed', err);
  } finally {
    const hub = session.hubUrl || 'https://gummygum.app';
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = hub;
  }
}

// Player / guest return: safe navigation back to GummyGum without closing the host's room
export function returnToGummyGum(): void {
  const session = getGummyGumSession();
  const hub = session?.hubUrl || 'https://gummygum.app';
  sessionStorage.removeItem(STORAGE_KEY);
  window.location.href = hub;
}

// Host-only: start next round from within the experience, preserving tracking in GummyGum
export async function startNextRoundGummyGum(previousRoundReport?: Record<string, unknown>): Promise<GummyGumLaunchSession | null> {
  const session = getGummyGumSession();
  if (!session || !session.isHost || !session.reportToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/next-round`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report: previousRoundReport }),
    });
    const body = await res.json();
    if (res.ok && body.success && body.data) {
      session.sessionId = body.data.sessionId;
      session.reportToken = body.data.reportToken;
      session.round = body.data.round || (session.round + 1);
      session.reported = false;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }
  } catch (err) {
    console.error('GummyGum start next round failed', err);
  }
  return session;
}
