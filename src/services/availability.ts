import { API_BASE, http } from '../lib/http';
import { useAuthStore } from '../app/store/auth';

export interface Availability {
  [key: string]: unknown;
}

export function getAvailability() {
  return http<Availability>('/me/availability');
}

export function updateAvailability(data: Availability) {
  return http<Availability>('/me/availability', { method: 'PUT', body: data });
}

export async function downloadIcs(): Promise<Blob> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_BASE}/me/availability/ics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as { message?: string }).message ?? message;
    } catch {
      /* ignore */
    }
    throw { message, status: res.status };
  }
  return await res.blob();
}
