import { useMutation, useQuery } from '@tanstack/react-query';
import * as service from '../services/accounting';

export function useAccountingSummary(params?: service.SummaryParams) {
  return useQuery({
    queryKey: ['accounting', params],
    queryFn: () => service.getSummary(params),
  });
}

export function useExportCsv() {
  return useMutation({
    mutationFn: (params?: service.SummaryParams) => service.exportCsv(params),
  });
}
