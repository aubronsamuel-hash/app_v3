import { useQuery, useMutation } from '@tanstack/react-query'
import { getAvailability, updateAvailability, exportAvailability } from '../services/availability'

export function useAvailability() {
  const list = useQuery({ queryKey: ['availability'], queryFn: getAvailability })
  const update = useMutation({ mutationFn: updateAvailability })
  const exportIcs = useMutation({ mutationFn: exportAvailability })
  return { list, update, exportIcs }
}
