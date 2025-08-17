import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

interface AuthContextValue {
  token: string | null;
  user?: api.User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      api.login(username, password),
    onSuccess: data => {
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  function logout() {
    setToken(null);
    localStorage.removeItem('token');
    queryClient.clear();
  }

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => api.me(token!),
    enabled: !!token,
  });

  const value: AuthContextValue = {
    token,
    user: meQuery.data,
    login: async (username, password) => {
      await loginMutation.mutateAsync({ username, password });
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useMissions() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ['missions'],
    queryFn: () => api.getMissions(token!),
    enabled: !!token,
  });

  const publish = useMutation({
    mutationFn: (id: number) => api.publishMission(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] }),
  });

  const duplicate = useMutation({
    mutationFn: (id: number) => api.duplicateMission(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] }),
  });

  return { list, publish, duplicate };
}

export function useMission(id: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['mission', id],
    queryFn: () => api.getMission(id, token!),
    enabled: !!token && !!id,
  });
}

export function usePlanning(week: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['planning', week],
    queryFn: () => api.getPlanning(week, token!),
    enabled: !!token,
  });
}

export function useAdminUsers() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.getAdminUsers(token!),
    enabled: !!token,
  });
}
