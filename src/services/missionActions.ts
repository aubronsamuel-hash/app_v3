import { http } from '../lib/http';
import type { Mission } from '../types/mission';

export function publishMission(id: number) {
  return http<Mission>(`/missions/${id}/publish`, { method: 'POST' });
}

export interface DuplicateBody {
  title_suffix: string;
  shift_days?: number;
}

export function duplicateMission(id: number, body: DuplicateBody) {
  return http<Mission>(`/missions/${id}/duplicate`, { method: 'POST', body });
}

export function closeMission(id: number) {
  return http<Mission>(`/missions/${id}/close`, { method: 'POST' });
}

export function cancelMission(id: number) {
  return http<Mission>(`/missions/${id}/cancel`, { method: 'POST' });
}
