import { ChangeEvent } from 'react';
import Input from '../ui/Input';
import Label from '../ui/Label';

interface Props {
  start: string;
  end: string;
  onChange: (range: { start: string; end: string }) => void;
}

export default function DateRangePicker({ start, end, onChange }: Props) {
  const onStart = (e: ChangeEvent<HTMLInputElement>) => onChange({ start: e.target.value, end });
  const onEnd = (e: ChangeEvent<HTMLInputElement>) => onChange({ start, end: e.target.value });
  return (
    <div className="flex items-end gap-2">
      <div>
        <Label htmlFor="date-start">Start</Label>
        <Input id="date-start" type="date" value={start} onChange={onStart} />
      </div>
      <div>
        <Label htmlFor="date-end">End</Label>
        <Input id="date-end" type="date" value={end} onChange={onEnd} />
      </div>
    </div>
  );
}
