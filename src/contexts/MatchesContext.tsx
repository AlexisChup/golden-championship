import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Match } from '../types/Match'
import { matchesData as initialMatchesData } from '../data/matchesData'

interface MatchesContextType {
  matches: Match[]
  getMatchById: (id: number) => Match | undefined
  getMatchesByCompetition: (competitionUuid: string) => Match[]
  addMatch: (match: Omit<Match, 'id'>) => number
  updateMatch: (id: number, match: Omit<Match, 'id'>) => void
  deleteMatch: (id: number) => void
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined)

const STORAGE_KEY = 'matches'

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Ensure all numeric fields are properly typed
        return parsed.map((m: any) => ({
          ...m,
          id: Number(m.id),
          nextMatchId: m.nextMatchId !== null ? Number(m.nextMatchId) : null,
          participants: m.participants.map((p: any) => ({
            ...p,
            id: String(p.id), // Ensure participant ID is string (fighter UUID)
          })),
        }))
      } catch (e) {
        console.error('Failed to parse matches data from localStorage', e)
        return initialMatchesData
      }
    }
    return initialMatchesData
  })

  // Sync to localStorage whenever matches change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
  }, [matches])

  const getMatchById = (id: number): Match | undefined => {
    return matches.find(match => match.id === id)
  }

  const getMatchesByCompetition = (competitionUuid: string): Match[] => {
    return matches.filter(match => match.meta?.competitionUuid === competitionUuid)
  }

  const addMatch = (matchData: Omit<Match, 'id'>): number => {
    const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1
    const newMatch: Match = { ...matchData, id: newId }
    setMatches(prev => [...prev, newMatch])
    return newId
  }

  const updateMatch = (id: number, updatedMatch: Omit<Match, 'id'>): void => {
    setMatches(prev =>
      prev.map(match => (match.id === id ? { ...updatedMatch, id } : match))
    )
  }

  const deleteMatch = (id: number): void => {
    setMatches(prev => prev.filter(match => match.id !== id))
  }

  const value: MatchesContextType = {
    matches,
    getMatchById,
    getMatchesByCompetition,
    addMatch,
    updateMatch,
    deleteMatch,
  }

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>
}

export const useMatches = (): MatchesContextType => {
  const context = useContext(MatchesContext)
  if (!context) {
    throw new Error('useMatches must be used within a MatchesProvider')
  }
  return context
}
