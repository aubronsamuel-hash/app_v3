import { useState } from 'react'
import * as api from './api'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  async function login(username: string, password: string) {
    const res = await api.login(username, password)
    setToken(res.access_token)
    localStorage.setItem('token', res.access_token)
  }

  function logout() {
    setToken(null)
    localStorage.removeItem('token')
  }

  return { token, login, logout }
}
