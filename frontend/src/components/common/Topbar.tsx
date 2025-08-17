import { Link } from 'react-router-dom'
import { SearchInput } from './SearchInput'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../app/providers/ThemeProvider'
import { Sun, Moon, User } from 'lucide-react'
import { useState } from 'react'

export function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const [menu, setMenu] = useState(false)
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold">
          Coulisses Crew
        </Link>
        <SearchInput placeholder="Search" aria-label="Search" />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="relative">
          <button onClick={() => setMenu(m => !m)} className="flex items-center gap-1" aria-haspopup="menu">
            <User className="h-4 w-4" /> {user?.username}
          </button>
          {menu && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow w-40" role="menu">
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/settings" onClick={() => setMenu(false)}>
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  logout()
                  setMenu(false)
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
