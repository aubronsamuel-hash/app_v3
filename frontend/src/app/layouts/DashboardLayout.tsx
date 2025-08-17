import { Outlet } from 'react-router-dom'
import { Topbar } from '../../components/common/Topbar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Topbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
