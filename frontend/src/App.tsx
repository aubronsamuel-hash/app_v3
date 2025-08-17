import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Missions from './pages/Missions'
import Planning from './pages/Planning'
import UsersAdmin from './pages/UsersAdmin'
import Topbar from './components/Topbar'

export default function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/admin/users" element={<UsersAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
