import { http } from '../lib/http';
import type { Mission, MissionInput } from '../types/mission';

export interface MissionListParams {
  q?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}

function qs(params?: Record<string, unknown>) {
  if (!params) return '';
  const s = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );
  const q = s.toString();
  return q ? `?${q}` : '';
}

export function listMissions(params?: MissionListParams) {
  return http<Mission[]>(`/missions${qs(params as Record<string, unknown> | undefined)}`);
}

export function getMission(id: number) {
  return http<Mission>(`/missions/${id}`);
}

export function createMission(data: MissionInput) {
  return http<Mission>('/missions', { method: 'POST', body: data });
}

export function updateMission(id: number, data: MissionInput) {
  return http<Mission>(`/missions/${id}`, { method: 'PUT', body: data });
}

export function deleteMission(id: number) {
  return http<void>(`/missions/${id}`, { method: 'DELETE' });
}
