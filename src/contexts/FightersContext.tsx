import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Fighter } from '../types/Fighter'
import { fightersData as initialFightersData } from '../data/fightersData'

interface FightersContextType {
  fighters: Fighter[]
  getFighterById: (id: number) => Fighter | undefined
  addFighter: (fighter: Omit<Fighter, 'id'>) => number
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
        const parsed = JSON.parse(stored)
        
        // Ensure all numeric fields are properly typed
        return parsed.map((f: any) => ({
          ...f,
          id: Number(f.id),
          clubId: f.clubId === null ? null : Number(f.clubId),
          height: Number(f.height),
          weight: Number(f.weight),
          record: {
            wins: Number(f.record.wins),
            losses: Number(f.record.losses),
            draws: Number(f.record.draws),
          },
        }))
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

  const addFighter = (fighter: Omit<Fighter, 'id'>): number => {
    const newId = fighters.length > 0 ? Math.max(...fighters.map(f => f.id)) + 1 : 1
    const newFighter: Fighter = { ...fighter, id: newId }
    setFighters(prev => [...prev, newFighter])
    return newId
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
