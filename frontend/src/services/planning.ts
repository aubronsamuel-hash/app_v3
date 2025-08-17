import { http } from '../lib/http'
import { PlanningItem } from '../types/planning'
import { Paginated } from '../types/common'

export const getWeek = (week: string) => http.get<Paginated<PlanningItem>>(`/planning/week?week=${week}`)
export const publishRange = (data: { start: string; end: string; message?: string }) =>
  http.post<void>('/planning/publish-range', data)
