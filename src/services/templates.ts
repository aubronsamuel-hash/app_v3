import { http } from '../lib/http';
import type { Template, TemplateInput } from '../types/template';
import type { Mission } from '../types/mission';

export interface TemplateListParams {
  q?: string;
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

export function listTemplates(params?: TemplateListParams) {
  return http<Template[]>(`/templates${qs(params as Record<string, unknown> | undefined)}`);
}

export function getTemplate(id: number) {
  return http<Template>(`/templates/${id}`);
}

export function createTemplate(data: TemplateInput) {
  return http<Template>('/templates', { method: 'POST', body: data });
}

export function updateTemplate(id: number, data: TemplateInput) {
  return http<Template>(`/templates/${id}`, { method: 'PUT', body: data });
}

export function deleteTemplate(id: number) {
  return http<void>(`/templates/${id}`, { method: 'DELETE' });
}

export interface ApplyTemplateBody {
  start: string;
  end: string;
  title_override?: string;
  notes?: string;
}

export function applyTemplate(id: number, body: ApplyTemplateBody) {
  return http<Mission>(`/templates/${id}/apply`, { method: 'POST', body });
}
