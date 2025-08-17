import { http } from '../lib/http';
import type { WeekOut } from '../types/planning';

export function getPlanningWeek(startISO: string) {
  return http<WeekOut>(`/planning/week/${encodeURIComponent(startISO)}`);
}

export interface PublishRangeBody {
  start: string;
  end: string;
  message?: string;
}

export function publishRange(body: PublishRangeBody) {
  return http<void>('/planning/publish-range', { method: 'POST', body });
}
