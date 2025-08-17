import { useAuthStore } from '../app/store/auth';

export const API_BASE = import.meta.env.VITE_API_BASE as string;

interface HttpOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

interface HttpError {
  message: string;
  status: number;
}

async function request(path: string, options: HttpOptions = {}, retry = false): Promise<Response> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body,
    credentials: 'include',
  });
  if (res.status === 401 && !retry) {
    try {
      const refresh = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (refresh.ok) {
        const data: { token: string } = await refresh.json();
        useAuthStore.getState().login(data.token);
        return request(path, options, true);
      }
    } catch {
      // ignore
    }
    useAuthStore.getState().logout();
  }
  return res;
}

export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const res = await request(path, opts);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as { message?: string }).message ?? message;
    } catch {
      // ignore
    }
    const error: HttpError = { message, status: res.status };
    throw error;
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
