import { http } from '../lib/http'
import { Mission } from '../types/mission'
import { Paginated } from '../types/common'

export interface MissionFilters {
  q?: string
  status?: string
  page?: number
}

export const listMissions = (filters: MissionFilters = {}) => {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.status) params.set('status', filters.status)
  if (filters.page) params.set('page', String(filters.page))
  const query = params.toString()
  return http.get<Paginated<Mission>>(`/missions${query ? `?${query}` : ''}`)
}

export const publishMission = (id: number) => http.post<Mission>(`/missions/${id}/publish`)
export const duplicateMission = (id: number) => http.post<Mission>(`/missions/${id}/duplicate`)
export const closeMission = (id: number) => http.post<Mission>(`/missions/${id}/close`)
export const cancelMission = (id: number) => http.post<Mission>(`/missions/${id}/cancel`)
export const getMission = (id: number) => http.get<Mission>(`/missions/${id}`)
