import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/templates';
import type { TemplateInput } from '../types/template';

export function useTemplatesList(params?: service.TemplateListParams) {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: () => service.listTemplates(params),
  });
}

export function useTemplate(id: number) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => service.getTemplate(id),
    enabled: typeof id === 'number',
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TemplateInput) => service.createTemplate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
}

export function useUpdateTemplate(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TemplateInput) => service.updateTemplate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] });
      qc.invalidateQueries({ queryKey: ['template', id] });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => service.deleteTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  });
}

export function useApplyTemplate(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: service.ApplyTemplateBody) => service.applyTemplate(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
  });
}
