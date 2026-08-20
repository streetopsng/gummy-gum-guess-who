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
}

interface VerifyLaunchResponse {
  success: true;
  data: {
    sessionId: string;
    experienceId: string;
    isGuest: boolean;
    player: GummyGumPlayer | null;
    reportToken: string;
  };
}

function readStoredSession(): GummyGumLaunchSession | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as GummyGumLaunchSession;
  } catch {
    return null;
  }
}

/**
 * Resolves a GummyGum hub launch. If a `?ggt=` token is present in the URL,
 * verifies it against the backend and persists the resulting session
 * (including the report token) to sessionStorage. If no token is present,
 * falls back to whatever was already stored. Never throws — any failure
 * resolves to `null` so gameplay is never blocked by this integration.
 */
export async function resolveGummyGumLaunch(): Promise<GummyGumLaunchSession | null> {
  const params = new URLSearchParams(window.location.search);
  const ggt = params.get('ggt');

  if (!ggt) {
    return readStoredSession();
  }

  try {
    const res = await fetch(`${API_URL}/api/gummygum/launch/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: ggt }),
    });
    const body = (await res.json()) as VerifyLaunchResponse;
    if (!res.ok || !body.success) return null;

    const session: GummyGumLaunchSession = {
      sessionId: body.data.sessionId,
      experienceId: body.data.experienceId,
      isGuest: body.data.isGuest,
      player: body.data.player,
      reportToken: body.data.reportToken,
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

/**
 * Reports this experience's outcome back to the GummyGum hub for the
 * launching player, using the report token stashed by resolveGummyGumLaunch.
 * No-ops silently if there is no stored launch session. Never throws.
 */
export async function reportGummyGumResult(report: Record<string, unknown>): Promise<void> {
  const session = readStoredSession();
  if (!session) return;

  try {
    await fetch(`${API_URL}/api/gummygum/launch/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportToken: session.reportToken, report }),
    });
  } catch (err) {
    console.error('GummyGum result report failed', err);
  } finally {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
