import { Link } from 'react-router-dom'

export default function Topbar() {
  return (
    <nav className="bg-gray-800 text-white p-2 flex gap-4">
      <Link to="/missions">Missions</Link>
      <Link to="/planning">Planning</Link>
      <Link to="/admin/users">Users</Link>
    </nav>
  )
}
