const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export interface LoginResponse {
  access_token: string
}

export interface Mission {
  id: number
  title: string
  description?: string
  published: boolean
  owner_id: number
}

export interface User {
  id: number
  username: string
  role: string
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  const res = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    body: params
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export async function listMissions(token: string): Promise<Mission[]> {
  const res = await fetch(`${API_URL}/missions/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to load missions')
  return res.json()
}

export async function createMission(token: string, data: {title: string; description?: string}): Promise<Mission> {
  const res = await fetch(`${API_URL}/missions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create mission')
  return res.json()
}

export async function listUsers(token: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to load users')
  return res.json()
}
