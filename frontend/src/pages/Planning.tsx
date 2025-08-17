import { useState } from 'react'
import { usePlanning } from '../hooks/usePlanning'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/common/EmptyState'

export default function Planning() {
  const [week, setWeek] = useState('2023-01-01')
  const { list, publish } = usePlanning(week)
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input type="date" value={week} onChange={e => setWeek(e.target.value)} />
        <Button onClick={() => publish.mutate({ start: week, end: week })}>Publish range</Button>
      </div>
      {list.isLoading && <Skeleton className="h-20" />}
      {!list.isLoading && (list.data?.items.length ?? 0) === 0 && <EmptyState title="No planning" />}
      {!list.isLoading && (list.data?.items.length ?? 0) > 0 && (
        <ul>
          {list.data!.items.map(p => (
            <li key={p.id}>
              {p.date} mission {p.mission_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
