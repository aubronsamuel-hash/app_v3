import { useQuery, useMutation } from '@tanstack/react-query'
import { getWeek, publishRange } from '../services/planning'

export function usePlanning(week: string) {
  const list = useQuery({ queryKey: ['planning', week], queryFn: () => getWeek(week) })
  const publish = useMutation({ mutationFn: publishRange })
  return { list, publish }
}
