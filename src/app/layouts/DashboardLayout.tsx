import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useMe } from '../../hooks/useAuth';

export default function DashboardLayout() {
  useMe();
  const me = useAuthStore((s) => s.me);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-gray-900 shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between">
          <span className="font-semibold">Coulisses Crew</span>
          {me && <span>{me.name}</span>}
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

