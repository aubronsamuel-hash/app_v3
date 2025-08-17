import { http } from '../lib/http'
import { AvailabilityRule } from '../types/availability'

export const getAvailability = () => http.get<AvailabilityRule[]>('/me/availability')
export const updateAvailability = (data: AvailabilityRule[]) => http.put<void>('/me/availability', data)
export const exportAvailability = () => http.get<Blob>('/me/availability/ics')
