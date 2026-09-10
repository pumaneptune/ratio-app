const STORAGE_KEY = 'ratio:lastSession';

export type SessionState = {
  methodIndex: number;
  ratio: number;
  coffee: number;
  water: number;
  inputMode: 'coffee' | 'water';
};

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (
      typeof parsed.methodIndex !== 'number' ||
      typeof parsed.ratio !== 'number' ||
      typeof parsed.coffee !== 'number' ||
      typeof parsed.water !== 'number' ||
      (parsed.inputMode !== 'coffee' && parsed.inputMode !== 'water')
    ) {
      return null;
    }
    return parsed as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — non-fatal, session just won't persist
  }
}
