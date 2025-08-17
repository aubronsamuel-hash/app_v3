import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as actions from '../services/missionActions';

export function usePublish(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actions.publishMission(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', id], data);
    },
  });
}

export function useDuplicate(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: actions.DuplicateBody) => actions.duplicateMission(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useClose(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actions.closeMission(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', id], data);
    },
  });
}

export function useCancel(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => actions.cancelMission(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', id], data);
    },
  });
}
