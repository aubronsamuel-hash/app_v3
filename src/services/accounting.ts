import { API_BASE, http } from '../lib/http';
import { useAuthStore } from '../app/store/auth';
import type { SummaryOut } from '../types/accounting';

export interface SummaryParams {
  from?: string;
  to?: string;
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

export function getSummary(params?: SummaryParams) {
  return http<SummaryOut>(`/accounting/summary${qs(params as Record<string, unknown> | undefined)}`);
}

export async function exportCsv(params?: SummaryParams): Promise<Blob> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_BASE}/accounting/export${qs(params as Record<string, unknown> | undefined)}`, {
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
