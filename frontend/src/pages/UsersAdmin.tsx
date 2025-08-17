import { useEffect, useState } from 'react'
import { useAuth } from '../lib/hooks'
import * as api from '../lib/api'

export default function UsersAdmin() {
  const { token } = useAuth()
  const [users, setUsers] = useState<api.User[]>([])

  useEffect(() => {
    if (token) api.listUsers(token).then(setUsers)
  }, [token])

  return (
    <div className="p-4">
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} - {u.role}</li>
        ))}
      </ul>
    </div>
  )
}
