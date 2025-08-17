import { useMutation, useQuery } from '@tanstack/react-query';
import * as service from '../services/availability';

export function useAvailability() {
  return useQuery({
    queryKey: ['availability'],
    queryFn: service.getAvailability,
  });
}

export function useAvailabilityUpdate() {
  return useMutation({
    mutationFn: service.updateAvailability,
  });
}

export function useAvailabilityIcs() {
  return useMutation({
    mutationFn: service.downloadIcs,
  });
}
