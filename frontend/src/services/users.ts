import { http } from '../lib/http'
import { User } from '../types/user'
import { Paginated } from '../types/common'

export const listUsers = () => http.get<Paginated<User>>('/admin/users')
export const createUser = (data: Partial<User>) => http.post<User>('/admin/users', data)
export const updateUser = (id: number, data: Partial<User>) => http.put<User>(`/admin/users/${id}`, data)
export const deleteUser = (id: number) => http.del<void>(`/admin/users/${id}`)
