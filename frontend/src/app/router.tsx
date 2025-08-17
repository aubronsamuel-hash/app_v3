import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Missions from '../pages/Missions'
import MissionDetail from '../pages/MissionDetail'
import Templates from '../pages/Templates'
import Planning from '../pages/Planning'
import AdminUsers from '../pages/AdminUsers'
import Availability from '../pages/Availability'
import Accounting from '../pages/Accounting'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import { useAuth } from '../hooks/useAuth'

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Protected>
              <DashboardLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="missions" element={<Missions />} />
          <Route path="missions/:id" element={<MissionDetail />} />
          <Route path="templates" element={<Templates />} />
          <Route path="planning" element={<Planning />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="availability" element={<Availability />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="settings" element={<Settings />} />
          <Route path="_dev" element={<div>Dev</div>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
