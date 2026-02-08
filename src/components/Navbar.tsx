import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useThemeContext } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation() 
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) 
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, changeTheme } = useThemeContext()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeClass = (path: string) =>
    location.pathname === path
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-4 md:gap-10">
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

          <Link to="/" className="shrink-0">
            <span className="font-bold text-base md:text-lg text-gray-700 dark:text-white whitespace-nowrap">
              Aksamedia Test
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`transition-colors cursor-pointer ${activeClass('/')}`}>Home</Link>
            <Link to="/crud" className={`transition-colors cursor-pointer ${activeClass('/crud')}`}>CRUD Data</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden xs:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
            {['light', 'dark', 'system'].map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t as any)}
                className={`px-3 md:px-4 py-1.5 text-[10px] md:text-xs uppercase font-bold rounded-full transition-all cursor-pointer ${theme === t
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all outline-none cursor-pointer"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-sm">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {user?.fullName}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 md:w-60 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="p-1">
                  <p
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    {user?.fullName}
                  </p>
                  <button
                    onClick={() => { navigate('/profile'); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1 cursor-pointer font-medium"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 mt-3 py-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-2 py-2 rounded-lg ${activeClass('/')}`}
          >
            Home
          </Link>
          <Link 
            to="/crud" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-2 py-2 rounded-lg ${activeClass('/crud')}`}
          >
            CRUD Data
          </Link>
          <div className="xs:hidden pt-4 flex gap-2">
             {['light', 'dark', 'system'].map((t) => (
                <button 
                  key={t}
                  onClick={() => changeTheme(t as any)}
                  className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg border ${theme === t ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-500 border-gray-200'}`}
                >
                  {t}
                </button>
             ))}
          </div>
        </div>
      )}
    </nav>
  )
}