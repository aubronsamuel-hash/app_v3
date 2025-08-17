import { useAuthStore } from '../app/store/auth'

const API_BASE = import.meta.env.VITE_API_BASE as string

export interface HttpError {
  message: string
  status: number
}

interface HttpOptions extends RequestInit {
  json?: unknown
}

async function request<T>(path: string, options: HttpOptions = {}, retry = true): Promise<T> {
  const token = useAuthStore.getState().token
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.json !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
    options.body = JSON.stringify(options.json)
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401 && retry) {
    useAuthStore.getState().logout()
    if (typeof window !== 'undefined') window.location.href = '/login'
    return request<T>(path, options, false)
  }
  if (!res.ok) {
    const message = await res.text()
    const err: HttpError = { message, status: res.status }
    throw err
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, json?: unknown, options: HttpOptions = {}) => request<T>(path, { ...options, method: 'POST', json }),
  put: <T>(path: string, json?: unknown, options: HttpOptions = {}) => request<T>(path, { ...options, method: 'PUT', json }),
  del: <T>(path: string, options: HttpOptions = {}) => request<T>(path, { ...options, method: 'DELETE' }),
}

export default request
