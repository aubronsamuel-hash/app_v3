import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listFiles, uploadFiles, deleteFile } from '../services/files'

export function useFiles(missionId: number) {
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['files', missionId], queryFn: () => listFiles(missionId) })
  const upload = useMutation({
    mutationFn: (files: File[]) => uploadFiles(missionId, files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files', missionId] }),
  })
  const remove = useMutation({
    mutationFn: (fileId: number) => deleteFile(missionId, fileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files', missionId] }),
  })
  return { list, upload, remove }
}
