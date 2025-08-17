import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listTemplates, createTemplate, updateTemplate, deleteTemplate, applyTemplate } from '../services/templates'
import { Template } from '../types/template'

export function useTemplates() {
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['templates'], queryFn: listTemplates })
  return {
    list,
    create: useMutation({ mutationFn: createTemplate, onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }) }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Template> }) => updateTemplate(id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
    }),
    remove: useMutation({ mutationFn: deleteTemplate, onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }) }),
    apply: useMutation({
      mutationFn: ({ id, data }: { id: number; data: { start: string; end: string } }) => applyTemplate(id, data),
    }),
  }
}
