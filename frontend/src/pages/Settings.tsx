import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

export default function Settings() {
  const { user, logout } = useAuth()
  return (
    <div>
      <div>Name: {user?.username}</div>
      <div>Email: {user?.email}</div>
      <Button className="mt-4" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}
