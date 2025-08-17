import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listMissions,
  MissionFilters,
  publishMission,
  duplicateMission,
  closeMission,
  cancelMission,
} from '../services/missions'

export function useMissions(filters: MissionFilters) {
  return useQuery({
    queryKey: ['missions', filters],
    queryFn: () => listMissions(filters),
  })
}

export function useMissionActions() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['missions'] })
  return {
    publish: useMutation({ mutationFn: publishMission, onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: duplicateMission, onSuccess: invalidate }),
    close: useMutation({ mutationFn: closeMission, onSuccess: invalidate }),
    cancel: useMutation({ mutationFn: cancelMission, onSuccess: invalidate }),
  }
}
