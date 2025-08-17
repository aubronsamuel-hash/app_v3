import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/files';

export function useFilesList(missionId: number) {
  return useQuery({
    queryKey: ['files', missionId],
    queryFn: () => service.listFiles(missionId),
    enabled: typeof missionId === 'number',
  });
}

export function useUploadFile(missionId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => service.uploadFile(missionId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files', missionId] }),
  });
}

export function useMissionIcs(missionId: number) {
  return useMutation({
    mutationFn: () => service.downloadIcs(missionId),
  });
}
