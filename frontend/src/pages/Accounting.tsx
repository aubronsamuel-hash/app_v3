import { useState } from 'react'
import { useAccounting } from '../hooks/useAccounting'
import { DateRangePicker } from '../components/common/DateRangePicker'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

export default function Accounting() {
  const [range, setRange] = useState({ from: '', to: '' })
  const { summary, exportData } = useAccounting(range)
  return (
    <div>
      <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
      {summary.isLoading && <Skeleton className="h-20" />}
      {summary.data && (
        <div className="flex gap-4 mt-4">
          <div>Missions: {summary.data.missions}</div>
          <div>Hours: {summary.data.hours}</div>
          <div>Total: {summary.data.total_estimated}</div>
        </div>
      )}
      <Button className="mt-4" onClick={() => exportData.mutate(range)}>
        Export CSV
      </Button>
    </div>
  )
}
