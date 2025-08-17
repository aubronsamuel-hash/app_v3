import { http } from '../lib/http';
import type { User, UserInput, UserUpdate } from '../types/user';

export function listUsers() {
  return http<User[]>('/admin/users');
}

export function getUser(id: number) {
  return http<User>(`/admin/users/${id}`);
}

export function createUser(data: UserInput) {
  return http<User>('/admin/users', { method: 'POST', body: data });
}

export function updateUser(id: number, data: UserUpdate) {
  return http<User>(`/admin/users/${id}`, { method: 'PUT', body: data });
}

export function deleteUser(id: number) {
  return http<void>(`/admin/users/${id}`, { method: 'DELETE' });
}
