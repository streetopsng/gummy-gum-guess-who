import type { GameSession } from '../hooks/useGameState';

export type ExpiryContext = 'lobby' | 'game';

export const LOBBY_EXPIRY_MS = 20 * 60 * 1000;
// Hours, not the lobby's 20 min: this only catches rooms nobody has had open for a long time.
export const ABANDON_THRESHOLD_MS = 3 * 60 * 60 * 1000;
export const HEARTBEAT_INTERVAL_MS = 60 * 1000;
export const EXPIRY_CHECK_INTERVAL_MS = 10 * 1000;

export function getExpiryReason(session: GameSession | null, now = Date.now()): ExpiryContext | null {
  if (!session) return null;
  if (session.status === 'expired') return session.abandoned ? 'game' : 'lobby';
  if (session.status === 'lobby') {
    return session.createdAt && now - session.createdAt >= LOBBY_EXPIRY_MS ? 'lobby' : null;
  }
  if (session.status === 'playing') {
    const lastActivity = session.lastActivity || session.startedAt || session.createdAt;
    return lastActivity && now - lastActivity >= ABANDON_THRESHOLD_MS ? 'game' : null;
  }
  return null;
}

// The hub reuses a PIN when a session is re-run, so the room under it may belong to an earlier hosted session.
export function isFromEarlierRoom(session: GameSession | null, hostedSessionId?: string | null): boolean {
  if (!session || !hostedSessionId) return false;
  if (session.hostedSessionId) return session.hostedSessionId !== hostedSessionId;
  return session.status === 'ended' || getExpiryReason(session) !== null;
}
