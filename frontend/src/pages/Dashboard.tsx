import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export default function Dashboard() {
  return (
    <div className="p-4 space-y-2">
      <Card><Link to="/missions">Missions</Link></Card>
      <Card><Link to="/planning">Planning</Link></Card>
      <Card><Link to="/admin/users">Admin Users</Link></Card>
      <Card><Link to="/settings">Settings</Link></Card>
    </div>
  );
}
