export interface HttpError extends Error {
  status: number;
  info?: unknown;
}

const API_BASE = import.meta.env.VITE_API_BASE as string;

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let info: unknown;
    try {
      info = await res.json();
    } catch (_) {
      info = await res.text();
    }
    const message = (info as { detail?: string } | undefined)?.detail || res.statusText;
    const error: HttpError = new Error(message) as HttpError;
    error.status = res.status;
    error.info = info;
    throw error;
    }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export interface LoginResponse { access_token: string }
export interface User { id: number; username: string; role: string }
export interface Mission {
  id: number;
  title: string;
  description?: string;
  published: boolean;
}
export interface PlanningItem {
  id: number;
  mission_id: number;
  date: string;
}

export function login(username: string, password: string) {
  const body = new URLSearchParams({ username, password });
  return request<LoginResponse>('/auth/token', { method: 'POST', body });
}

export const me = (token: string) => request<User>('/auth/me', {}, token);

export const getMissions = (token: string) => request<Mission[]>('/missions/', {}, token);
export const getMission = (id: number, token: string) => request<Mission>(`/missions/${id}`, {}, token);
export const publishMission = (id: number, token: string) => request<Mission>(`/missions/${id}/publish`, { method: 'POST' }, token);
export const duplicateMission = (id: number, token: string) => request<Mission>(`/missions/${id}/duplicate`, { method: 'POST' }, token);

export const getPlanning = (week: string, token: string) => request<PlanningItem[]>(`/planning/week?week=${week}`, {}, token);

export const getAdminUsers = (token: string) => request<User[]>('/admin/users', {}, token);

export { request };
