import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-gray-900 shadow">
        <div className="container mx-auto px-4 py-3">
          <span className="font-semibold">Coulisses Crew</span>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
