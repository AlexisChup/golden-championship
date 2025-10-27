import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour gérer l'authentification
 * Version simplifiée - À remplacer par une vraie gestion d'auth plus tard
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (localStorage temporaire)
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
    setLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout
  }
}