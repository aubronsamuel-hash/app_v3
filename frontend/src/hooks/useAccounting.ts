import { useQuery, useMutation } from '@tanstack/react-query'
import { getSummary, exportCsv } from '../services/accounting'

export function useAccounting(params: { from?: string; to?: string }) {
  const summary = useQuery({ queryKey: ['accounting', params], queryFn: () => getSummary(params) })
  const exportData = useMutation({ mutationFn: exportCsv })
  return { summary, exportData }
}
