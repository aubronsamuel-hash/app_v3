import { http } from '../lib/http';
import type { Assignment, AssignmentInput } from '../types/assignment';

export function listAssignments(missionId: number) {
  return http<Assignment[]>(`/assignments/mission/${missionId}`);
}

export function addAssignment(data: AssignmentInput) {
  return http<Assignment>('/assignments', { method: 'POST', body: data });
}

export function updateAssignment(id: number, data: Partial<AssignmentInput>) {
  return http<Assignment>(`/assignments/${id}`, { method: 'PUT', body: data });
}
