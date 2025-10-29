import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Competition, CompetitionFighter } from '../types/Competition'
import { competitionsData as initialCompetitionsData } from '../data/competitionsData'

interface CompetitionsContextType {
  competitions: Competition[]
  getCompetitionById: (id: number) => Competition | undefined
  addCompetition: (competition: Omit<Competition, 'id'>) => number
  updateCompetition: (id: number, competition: Omit<Competition, 'id'>) => void
  deleteCompetition: (id: number) => void
  addFighterToCompetition: (competitionId: number, fighter: CompetitionFighter) => void
  removeFighterFromCompetition: (competitionId: number, fighter: CompetitionFighter) => void
}

const CompetitionsContext = createContext<CompetitionsContextType | undefined>(undefined)

const STORAGE_KEY = 'competitions_data'

export const CompetitionsProvider = ({ children }: { children: ReactNode }) => {
  const [competitions, setCompetitions] = useState<Competition[]>(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Ensure all numeric fields are properly typed
        // Support both old 'participants' and new 'fighters' property names for migration
        return parsed.map((c: any) => ({
          ...c,
          id: Number(c.id),
          fighters: (c.fighters || c.participants || []).map((p: any) => ({
            fighterId: Number(p.fighterId),
            discipline: p.discipline,
          })),
        }))
      } catch (e) {
        console.error('Failed to parse competitions data from localStorage', e)
        return initialCompetitionsData
      }
    }
    return initialCompetitionsData
  })

  // Sync to localStorage whenever competitions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(competitions))
  }, [competitions])

  const getCompetitionById = (id: number): Competition | undefined => {
    return competitions.find(competition => competition.id === id)
  }

  const addCompetition = (competitionData: Omit<Competition, 'id'>): number => {
    const newId = competitions.length > 0 ? Math.max(...competitions.map(c => c.id)) + 1 : 1
    const newCompetition: Competition = { ...competitionData, id: newId }
    setCompetitions(prev => [...prev, newCompetition])
    return newId
  }

  const updateCompetition = (id: number, updatedCompetition: Omit<Competition, 'id'>): void => {
    setCompetitions(prev =>
      prev.map(competition =>
        competition.id === id ? { ...updatedCompetition, id } : competition
      )
    )
  }

  const deleteCompetition = (id: number): void => {
    setCompetitions(prev => prev.filter(competition => competition.id !== id))
  }

  const addFighterToCompetition = (competitionId: number, fighter: CompetitionFighter): void => {
    setCompetitions(prev =>
      prev.map(competition => {
        if (competition.id === competitionId) {
          // Avoid duplicate exact fighter (same fighterId + discipline)
          const exists = competition.fighters.some(
            f => f.fighterId === fighter.fighterId && f.discipline === fighter.discipline
          )
          if (exists) {
            return competition
          }
          return {
            ...competition,
            fighters: [...competition.fighters, fighter],
          }
        }
        return competition
      })
    )
  }

  const removeFighterFromCompetition = (competitionId: number, fighter: CompetitionFighter): void => {
    setCompetitions(prev =>
      prev.map(competition => {
        if (competition.id === competitionId) {
          return {
            ...competition,
            fighters: competition.fighters.filter(
              f => !(f.fighterId === fighter.fighterId && f.discipline === fighter.discipline)
            ),
          }
        }
        return competition
      })
    )
  }

  const value: CompetitionsContextType = {
    competitions,
    getCompetitionById,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    addFighterToCompetition,
    removeFighterFromCompetition,
  }

  return <CompetitionsContext.Provider value={value}>{children}</CompetitionsContext.Provider>
}

export const useCompetitions = (): CompetitionsContextType => {
  const context = useContext(CompetitionsContext)
  if (!context) {
    throw new Error('useCompetitions must be used within a CompetitionsProvider')
  }
  return context
}
