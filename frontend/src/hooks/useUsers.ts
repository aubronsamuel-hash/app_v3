import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listUsers, createUser, updateUser, deleteUser } from '../services/users'
import { User } from '../types/user'

export function useUsers() {
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['users'], queryFn: listUsers })
  return {
    list,
    create: useMutation({ mutationFn: createUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
    }),
    remove: useMutation({ mutationFn: deleteUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) }),
  }
}
