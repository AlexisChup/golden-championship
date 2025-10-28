import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Fighter } from '../types/Fighter'
import { fightersData as initialFightersData } from '../data/fightersData'

interface FightersContextType {
  fighters: Fighter[]
  getFighterById: (id: number) => Fighter | undefined
  addFighter: (fighter: Omit<Fighter, 'id'>) => void
  updateFighter: (id: number, fighter: Omit<Fighter, 'id'>) => void
  deleteFighter: (id: number) => void
}

const FightersContext = createContext<FightersContextType | undefined>(undefined)

const STORAGE_KEY = 'fighters_data'

export const FightersProvider = ({ children }: { children: ReactNode }) => {
  const [fighters, setFighters] = useState<Fighter[]>(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse fighters data from localStorage', e)
        return initialFightersData
      }
    }
    return initialFightersData
  })

  // Sync to localStorage whenever fighters change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fighters))
  }, [fighters])

  const getFighterById = (id: number): Fighter | undefined => {
    return fighters.find(fighter => fighter.id === id)
  }

  const addFighter = (fighter: Omit<Fighter, 'id'>): void => {
    const newId = fighters.length > 0 ? Math.max(...fighters.map(f => f.id)) + 1 : 1
    const newFighter: Fighter = { ...fighter, id: newId }
    setFighters(prev => [...prev, newFighter])
  }

  const updateFighter = (id: number, updatedFighter: Omit<Fighter, 'id'>): void => {
    setFighters(prev =>
      prev.map(fighter =>
        fighter.id === id ? { ...updatedFighter, id } : fighter
      )
    )
  }

  const deleteFighter = (id: number): void => {
    setFighters(prev => prev.filter(fighter => fighter.id !== id))
  }

  const value: FightersContextType = {
    fighters,
    getFighterById,
    addFighter,
    updateFighter,
    deleteFighter,
  }

  return (
    <FightersContext.Provider value={value}>
      {children}
    </FightersContext.Provider>
  )
}

export const useFighters = (): FightersContextType => {
  const context = useContext(FightersContext)
  if (!context) {
    throw new Error('useFighters must be used within a FightersProvider')
  }
  return context
}
