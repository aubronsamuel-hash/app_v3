import { useState } from 'react';
import { usePlanning } from '../lib/hooks';
import { Card } from '../components/ui/Card';

export default function Planning() {
  const [week, setWeek] = useState('2024-W01');
  const planning = usePlanning(week);

  return (
    <div className="p-4 space-y-2">
      <input className="border p-2" value={week} onChange={e => setWeek(e.target.value)} />
      {planning.data?.map(item => (
        <Card key={item.id}>
          {item.date} - mission {item.mission_id}
        </Card>
      ))}
    </div>
  );
}
