import { http } from '../lib/http';
import type { User, UserPrefs } from '../types/user';

export interface LoginInput {
  username: string;
  password: string;
}

export function login(data: LoginInput) {
  return http<{ token: string }>('/auth/token-json', { method: 'POST', body: data });
}

export function getMe() {
  return http<User>('/auth/me');
}

export function updatePrefs(prefs: UserPrefs) {
  return http<User>('/auth/me/prefs', { method: 'PUT', body: prefs });
}
