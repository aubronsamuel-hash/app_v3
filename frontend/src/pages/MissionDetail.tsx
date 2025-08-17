import { useParams } from 'react-router-dom';
import { useMissions, useMission } from '../lib/hooks';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function MissionDetail() {
  const { id } = useParams();
  const missionId = Number(id);
  const { publish, duplicate } = useMissions();
  const mission = useMission(missionId).data;

  if (!mission) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-2">
          {mission.title}{' '}
          {mission.published && <Badge>published</Badge>}
        </h2>
        <p className="mb-4">{mission.description}</p>
        <div className="flex gap-2">
          <Button onClick={() => publish.mutate(missionId)} disabled={publish.isLoading}>
            Publish
          </Button>
          <Button onClick={() => duplicate.mutate(missionId)} disabled={duplicate.isLoading}>
            Duplicate
          </Button>
        </div>
      </Card>
    </div>
  );
}
