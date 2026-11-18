import type { Viewer } from './types';

const GUEST: Viewer = { role: 'guest' };

export function useViewer(): Viewer {
  // TODO: когда появится AuthContext, брать данные оттуда
  return GUEST;
}