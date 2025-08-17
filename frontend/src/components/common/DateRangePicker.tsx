import { Input } from '../ui/Input'

interface Props {
  from: string
  to: string
  onChange: (range: { from: string; to: string }) => void
}

export function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <Input type="date" value={from} onChange={e => onChange({ from: e.target.value, to })} />
      <Input type="date" value={to} onChange={e => onChange({ from, to: e.target.value })} />
    </div>
  )
}
