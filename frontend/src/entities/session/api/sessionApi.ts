import { apiClient } from '../../../shared/api';
import type { Role } from '../model/types';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

interface UserResponse {
  id: string;
  login: string;
  roles?: string[];
}

export const sessionApi = {
  async login(body: { login: string; password: string }): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/auth/login', body, {
      baseURL: '',
      skipAuth: true,
    });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(
      '/auth/logout',
      { refreshToken },
      { baseURL: '' },
    );
  },

  // Токен передаём вручную, так как в хранилище он ещё не сохранён
  async whoami(accessToken: string): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/auth/whoami', {
      baseURL: '',
      skipAuth: true,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },

  async register(body: { login: string; password: string }): Promise<UserResponse> {
    const { data } = await apiClient.post<UserResponse>('/auth/register', body, {
      baseURL: '',
      skipAuth: true,
    });
    return data;
  },
};

export function pickRole(roles: string[] = []): Role {
  if (roles.includes('ADMIN')) return 'admin';
  if (roles.includes('SELLER')) return 'seller';
  return 'buyer';
}