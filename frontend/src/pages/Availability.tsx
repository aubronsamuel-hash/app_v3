import { useAvailability } from '../hooks/useAvailability'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

export default function Availability() {
  const { list, update } = useAvailability()
  const rules = list.data ?? []
  const toggle = (day: string) => {
    const newRules = rules.map(r => (r.day === day ? { ...r, available: !r.available } : r))
    update.mutate(newRules)
  }
  if (list.isLoading) return <Skeleton className="h-20" />
  return (
    <div>
      <ul>
        {rules.map(r => (
          <li key={r.day} className="flex items-center gap-2">
            <input type="checkbox" checked={r.available} onChange={() => toggle(r.day)} />
            {r.day}
          </li>
        ))}
      </ul>
      <Button className="mt-2" onClick={() => update.mutate(rules)}>
        Save
      </Button>
    </div>
  )
}
