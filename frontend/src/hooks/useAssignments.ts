import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listAssignments, addAssignment, updateAssignment } from '../services/assignments'
import { Assignment } from '../types/assignment'

export function useAssignments(missionId: number) {
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['assignments', missionId], queryFn: () => listAssignments(missionId) })
  return {
    list,
    add: useMutation({
      mutationFn: (data: Partial<Assignment>) => addAssignment(missionId, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments', missionId] }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Assignment> }) => updateAssignment(missionId, id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments', missionId] }),
    }),
  }
}
