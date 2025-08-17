import { create } from 'zustand';

export interface UserPrefs {
  [key: string]: unknown;
}

export interface User {
  id: string;
  name: string;
  prefs?: UserPrefs;
}

interface AuthState {
  token: string | null;
  me: User | null;
  login: (token: string) => void;
  logout: () => void;
  setPrefs: (prefs: UserPrefs) => void;
}

const tokenKey = 'token';
const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem(tokenKey) : null;

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  me: null,
  login: (token) => {
    localStorage.setItem(tokenKey, token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    set({ token: null, me: null });
  },
  setPrefs: (prefs) =>
    set((state) =>
      state.me ? { me: { ...state.me, prefs } } : state
    ),
}));

