import { API_BASE } from '../lib/http';
import { useAuthStore } from '../app/store/auth';
import type { FileMeta } from '../types/files';
import { http } from '../lib/http';

export function listFiles(missionId: number) {
  return http<FileMeta[]>(`/missions/${missionId}/files`);
}

export async function uploadFile(missionId: number, file: File): Promise<FileMeta> {
  const token = useAuthStore.getState().token;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/missions/${missionId}/files`, {
    method: 'POST',
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as { message?: string }).message ?? message;
    } catch { /* ignore */ }
    throw { message, status: res.status };
  }
  return (await res.json()) as FileMeta;
}

export async function downloadIcs(missionId: number): Promise<Blob> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_BASE}/missions/${missionId}/ics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = (data as { message?: string }).message ?? message;
    } catch { /* ignore */ }
    throw { message, status: res.status };
  }
  return await res.blob();
}
