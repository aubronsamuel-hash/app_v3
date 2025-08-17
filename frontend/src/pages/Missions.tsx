import { Link } from 'react-router-dom';
import { useMissions } from '../lib/hooks';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Missions() {
  const { list } = useMissions();
  return (
    <div className="p-4 space-y-2">
      {list.data?.map(m => (
        <Card key={m.id}>
          <Link to={`/missions/${m.id}`} className="font-bold">
            {m.title}
          </Link>{' '}
          {m.published && <Badge>published</Badge>}
        </Card>
      ))}
    </div>
  );
}
