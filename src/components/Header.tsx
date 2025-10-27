import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const Header = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Successfully logged out')
    navigate('/')
    setMobileMenuOpen(false)
  }

  // Navigation for non-authenticated users
  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/competitions', label: 'Competitions' },
    { to: '/fighters', label: 'Fighters' },
    { to: '/clubs', label: 'Clubs' },
    { to: '/news', label: 'News' },
  ]

  // Navigation for authenticated users
  const authenticatedLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/competitions', label: 'Competitions' },
    { to: '/fighters', label: 'Fighters' },
  ]

  const links = isAuthenticated ? authenticatedLinks : publicLinks

  return (
    <header className="bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🥊</span>
            <span className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
              Golden Championship
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-yellow-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Boutons d'authentification */}
            <div className="flex items-center space-x-3 ml-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-yellow-400 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-yellow-400 transition-colors font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-3 border-t border-gray-700 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-yellow-400 transition-colors font-medium py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}