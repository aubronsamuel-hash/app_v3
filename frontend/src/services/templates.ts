import { http } from '../lib/http'
import { Template } from '../types/template'
import { Paginated } from '../types/common'

export const listTemplates = () => http.get<Paginated<Template>>('/templates')
export const createTemplate = (data: Partial<Template>) => http.post<Template>('/templates', data)
export const updateTemplate = (id: number, data: Partial<Template>) => http.put<Template>(`/templates/${id}`, data)
export const deleteTemplate = (id: number) => http.del<void>(`/templates/${id}`)
export const applyTemplate = (id: number, data: { start: string; end: string }) =>
  http.post<{ mission_id: number }>(`/templates/${id}/apply`, data)
