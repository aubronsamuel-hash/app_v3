import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { login, getMe } from '../services/auth'
import { useAuthStore } from '../app/store/auth'

export function useAuth() {
  const { token, setToken, logout } = useAuthStore()
  const qc = useQueryClient()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token,
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      setToken(data.access_token)
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })

  return {
    token,
    user: meQuery.data,
    login: (username: string, password: string) => loginMutation.mutateAsync({ username, password }),
    logout: () => {
      logout()
      qc.clear()
    },
  }
}
