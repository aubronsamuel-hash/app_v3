import { useMutation, useQuery } from '@tanstack/react-query';
import * as service from '../services/planning';

export function usePlanningWeek(startISO: string) {
  return useQuery({
    queryKey: ['planning', startISO],
    queryFn: () => service.getPlanningWeek(startISO),
    enabled: Boolean(startISO),
  });
}

export function usePublishRange() {
  return useMutation({
    mutationFn: (body: service.PublishRangeBody) => service.publishRange(body),
  });
}
