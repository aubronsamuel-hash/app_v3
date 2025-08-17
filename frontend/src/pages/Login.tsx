import { useState } from 'react'
import { useAuth } from '../lib/hooks'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await login(username, password)
    navigate('/')
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <Card>
        <form onSubmit={submit} className="flex flex-col gap-2">
          <input className="border p-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  )
}
