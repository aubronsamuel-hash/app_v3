import { useQuery } from '@tanstack/react-query'
import { getMission } from '../services/missions'

export function useMission(id: number) {
  return useQuery({ queryKey: ['mission', id], queryFn: () => getMission(id), enabled: !!id })
}
