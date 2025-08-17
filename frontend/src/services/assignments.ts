import { http } from '../lib/http'
import { Assignment } from '../types/assignment'

export const listAssignments = (missionId: number) =>
  http.get<Assignment[]>(`/missions/${missionId}/assignments`)
export const addAssignment = (missionId: number, data: Partial<Assignment>) =>
  http.post<Assignment>(`/missions/${missionId}/assignments`, data)
export const updateAssignment = (missionId: number, id: number, data: Partial<Assignment>) =>
  http.put<Assignment>(`/missions/${missionId}/assignments/${id}`, data)
