import { sessionApi } from '../api/sessionApi';
import { sessionStore } from './sessionStore';

export async function signOut(): Promise<void> {
  const { refreshToken } = sessionStore.getState();

  try {
    if (refreshToken) {
      await sessionApi.logout(refreshToken);
    }
  } catch {
    
  } finally {
    sessionStore.clear();
  }
}

