import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as actions from '../services/missionActions';

export function usePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: number; message?: string }) =>
      actions.publishMission(id, message ? { message } : undefined),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', variables.id], data);
    },
  });
}

export function useDuplicate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      vars: { id: number } & actions.DuplicateBody
    ) => actions.duplicateMission(vars.id, { title_suffix: vars.title_suffix, shift_days: vars.shift_days }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useClose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => actions.closeMission(id),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', variables.id], data);
    },
  });
}

export function useCancel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => actions.cancelMission(id),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      qc.setQueryData(['mission', variables.id], data);
    },
  });
}
