import { useState } from 'react'
import { useAuth } from '../lib/hooks'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await login(username, password)
    navigate('/missions')
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input className="border p-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" type="submit">Login</button>
      </form>
    </div>
  )
}
