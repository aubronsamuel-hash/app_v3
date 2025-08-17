import { useAdminUsers } from '../lib/hooks';
import { Card } from '../components/ui/Card';

export default function AdminUsers() {
  const users = useAdminUsers();
  return (
    <div className="p-4 space-y-2">
      {users.data?.map(u => (
        <Card key={u.id}>{u.username} - {u.role}</Card>
      ))}
    </div>
  );
}
