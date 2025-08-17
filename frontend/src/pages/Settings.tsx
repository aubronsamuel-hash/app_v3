import { useAuth } from '../lib/hooks';
import { Button } from '../components/ui/Button';

export default function Settings() {
  const { logout } = useAuth();
  return (
    <div className="p-4">
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
