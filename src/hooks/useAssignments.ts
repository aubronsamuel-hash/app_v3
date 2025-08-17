import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/assignments';
import type { AssignmentInput } from '../types/assignment';

export function useAssignments(missionId: number) {
  return useQuery({
    queryKey: ['assignments', missionId],
    queryFn: () => service.listAssignments(missionId),
    enabled: typeof missionId === 'number',
  });
}

export function useAssignmentsAdd() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentInput) => service.addAssignment(data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['assignments', data.mission_id] });
    },
  });
}

export function useAssignmentsUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; data: Partial<AssignmentInput> }) =>
      service.updateAssignment(vars.id, vars.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['assignments', data.mission_id] });
    },
  });
}
