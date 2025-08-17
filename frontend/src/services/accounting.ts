import { http } from '../lib/http'
import { AccountingSummary } from '../types/accounting'

export const getSummary = (params: { from?: string; to?: string }) => {
  const q = new URLSearchParams(params as Record<string, string>)
  return http.get<AccountingSummary>(`/accounting/summary?${q.toString()}`)
}
export const exportCsv = (params: { from?: string; to?: string }) => {
  const q = new URLSearchParams(params as Record<string, string>)
  return http.get<Blob>(`/accounting/summary.csv?${q.toString()}`)
}
