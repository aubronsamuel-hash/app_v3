import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from '../lib/http';
import { useAuthStore, User, UserPrefs } from '../app/store/auth';

type LoginInput = { username: string; password: string };
export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (data: LoginInput) =>
      http<{ token: string }>('/auth/token-json', {
        method: 'POST',
        body: data,
      }),
    onSuccess: (data) => {
      login(data.token);
    },
  });
}

export function useMe(options?: { enabled?: boolean }) {
  const token = useAuthStore((s) => s.token);
  const query = useQuery<User>({
    queryKey: ['me', token],
    queryFn: () => http<User>('/auth/me'),
    enabled: options?.enabled ?? Boolean(token),
  });
  useEffect(() => {
    if (query.data) {
      useAuthStore.setState({ me: query.data });
    }
  }, [query.data]);
  return query;
}

export function useUpdatePrefs() {
  const setPrefs = useAuthStore((s) => s.setPrefs);
  return useMutation({
    mutationFn: (prefs: UserPrefs) =>
      http<User>('/auth/me/prefs', { method: 'PUT', body: prefs }),
    onSuccess: (user) => {
      if (user.prefs) {
        setPrefs(user.prefs);
      }
    },
  });
}

