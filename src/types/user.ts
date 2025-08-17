export interface UserPrefs {
  [key: string]: unknown;
}

export type UserRole = 'admin' | 'intermittent';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  prefs: UserPrefs;
  created_at: string;
}

export interface UserInput {
  username: string;
  email: string;
  role: UserRole;
  password: string;
  prefs?: UserPrefs;
}

export type UserUpdate = Partial<Omit<UserInput, 'password'>>;
