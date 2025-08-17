import { http } from '../lib/http'
import { LoginResponse, User } from '../types/auth'

export const login = (data: { username: string; password: string }) =>
  http.post<LoginResponse>('/auth/token', new URLSearchParams(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })

export const getMe = () => http.get<User>('/auth/me')
