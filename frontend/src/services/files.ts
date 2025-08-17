import { http } from '../lib/http'
import { FileMeta } from '../types/files'

export const listFiles = (missionId: number) => http.get<FileMeta[]>(`/missions/${missionId}/files`)
export const uploadFiles = (missionId: number, files: File[]) => {
  const form = new FormData()
  files.forEach(f => form.append('files', f))
  return http.post<FileMeta[]>(`/missions/${missionId}/files`, form)
}
export const deleteFile = (missionId: number, fileId: number) =>
  http.del<void>(`/missions/${missionId}/files/${fileId}`)
