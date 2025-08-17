import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../app/store/auth';
import { login, getMe, updatePrefs } from '../services/auth';
import type { User, UserPrefs } from '../types/user';

export function useLogin() {
  const loginStore = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginStore(data.token);
    },
  });
}

export function useMe(options?: { enabled?: boolean }) {
  const token = useAuthStore((s) => s.token);
  const query = useQuery<User>({
    queryKey: ['me', token],
    queryFn: getMe,
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
    mutationFn: (prefs: UserPrefs) => updatePrefs(prefs),
    onSuccess: (user) => {
      if (user.prefs) {
        setPrefs(user.prefs);
      }
    },
  });
}
