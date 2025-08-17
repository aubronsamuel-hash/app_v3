import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/missions';
import type { MissionInput, Mission } from '../types/mission';
import type { Paginated } from '../types/common';

export function useMissionsList(params?: service.MissionListParams) {
  return useQuery<Paginated<Mission>>({
    queryKey: ['missions', params],
    queryFn: () => service.listMissions(params),
  });
}

export function useMission(id: number) {
  return useQuery({
    queryKey: ['mission', id],
    queryFn: () => service.getMission(id),
    enabled: typeof id === 'number',
  });
}

export function useCreateMission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MissionInput) => service.createMission(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useUpdateMission(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MissionInput) => service.updateMission(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', id], data);
    },
  });
}

export function useDeleteMission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => service.deleteMission(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}
