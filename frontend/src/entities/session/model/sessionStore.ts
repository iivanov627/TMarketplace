// entities/session/model/sessionStore.ts
import { useSyncExternalStore } from 'react';

import type { Viewer } from './types';

const STORAGE_KEY = 'marketplace.session';

interface SessionData {
  accessToken: string | null;
  refreshToken: string | null;
  viewer: Viewer;
}

const EMPTY: SessionData = { accessToken: null, refreshToken: null, viewer: { role: 'guest' } };

function load(): SessionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SessionData;
  } catch {
    /* битые данные игнорируем */
  }
  return EMPTY;
}

let state = load();
const listeners = new Set<() => void>();

function set(next: SessionData) {
  state = next;
  try {
    if (next.accessToken) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
  listeners.forEach((listener) => listener());
}

export const sessionStore = {
  getState: () => state,
  setSession: (accessToken: string, refreshToken: string, viewer: Viewer) =>
    set({ accessToken, refreshToken, viewer }),
  clear: () => set(EMPTY),
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useViewer(): Viewer {
  return useSyncExternalStore(sessionStore.subscribe, () => state.viewer);
}