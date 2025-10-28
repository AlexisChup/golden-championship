import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Club } from '../types/Club'
import { clubsData as initialClubsData } from '../data/clubsData'

interface ClubsContextType {
  clubs: Club[]
  getClubById: (id: number) => Club | undefined
  addClub: (club: Omit<Club, 'id'>) => number
  updateClub: (id: number, club: Omit<Club, 'id'>) => void
  deleteClub: (id: number) => void
}

const ClubsContext = createContext<ClubsContextType | undefined>(undefined)

const STORAGE_KEY = 'clubs_data'

export const ClubsProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Ensure all numeric fields are properly typed
        return parsed.map((c: any) => ({
          ...c,
          id: Number(c.id),
        }))
      } catch (e) {
        console.error('Failed to parse clubs data from localStorage', e)
        return initialClubsData
      }
    }
    return initialClubsData
  })

  // Sync to localStorage whenever clubs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs))
  }, [clubs])

  const getClubById = (id: number): Club | undefined => {
    return clubs.find(club => club.id === id)
  }

  const addClub = (clubData: Omit<Club, 'id'>): number => {
    const newId = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1
    const newClub: Club = { ...clubData, id: newId }
    setClubs(prev => [...prev, newClub])
    return newId
  }

  const updateClub = (id: number, updatedClub: Omit<Club, 'id'>): void => {
    setClubs(prev =>
      prev.map(club =>
        club.id === id ? { ...updatedClub, id } : club
      )
    )
  }

  const deleteClub = (id: number): void => {
    setClubs(prev => prev.filter(club => club.id !== id))
  }

  const value: ClubsContextType = {
    clubs,
    getClubById,
    addClub,
    updateClub,
    deleteClub,
  }

  return <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>
}

export const useClubs = (): ClubsContextType => {
  const context = useContext(ClubsContext)
  if (!context) {
    throw new Error('useClubs must be used within a ClubsProvider')
  }
  return context
}
