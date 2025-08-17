import { useEffect, useState } from 'react'
import { useAuth } from '../lib/hooks'
import * as api from '../lib/api'
import MissionForm from '../components/MissionForm'

export default function Missions() {
  const { token } = useAuth()
  const [missions, setMissions] = useState<api.Mission[]>([])

  useEffect(() => {
    if (token) api.listMissions(token).then(setMissions)
  }, [token])

  async function create(title: string, description: string) {
    if (!token) return
    const m = await api.createMission(token, { title, description })
    setMissions([...missions, m])
  }

  return (
    <div className="p-4">
      <MissionForm onCreate={create} />
      <ul>
        {missions.map(m => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </div>
  )
}
