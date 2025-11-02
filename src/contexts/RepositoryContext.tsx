/**
 * Repository Context - Single source of truth for all data access
 * Exposes all repositories and provides typed hooks for components
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Fighter } from '../types/Fighter'
import type { Club } from '../types/Club'
import type { Competition } from '../types/Competition'
import type { Bracket, BracketMetadata } from '../types/Bracket'
import type { Match } from '../types/Match'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from '../data/repositories'

interface RepositoryContextType {
  // Clubs
  clubs: Club[]
  getClubById: (id: number) => Club | undefined
  addClub: (club: Omit<Club, 'id'>) => Club
  updateClub: (id: number, updates: Partial<Omit<Club, 'id'>>) => Club | undefined
  deleteClub: (id: number) => boolean
  refreshClubs: () => void

  // Fighters
  fighters: Fighter[]
  getFighterById: (id: number) => Fighter | undefined
  getFightersByClubId: (clubId: number) => Fighter[]
  getFightersByIds: (ids: number[]) => Fighter[]
  addFighter: (fighter: Omit<Fighter, 'id'>) => Fighter
  updateFighter: (id: number, updates: Partial<Omit<Fighter, 'id'>>) => Fighter | undefined
  deleteFighter: (id: number) => boolean
  refreshFighters: () => void

  // Competitions
  competitions: Competition[]
  getCompetitionById: (id: number) => Competition | undefined
  addCompetition: (competition: Omit<Competition, 'id'>) => Competition
  updateCompetition: (id: number, updates: Partial<Omit<Competition, 'id'>>) => Competition | undefined
  deleteCompetition: (id: number) => boolean
  refreshCompetitions: () => void

  // Brackets
  getBracketsByCompetition: (competitionId: number) => BracketMetadata[]
  getBracketById: (competitionId: number, bracketId: number) => Bracket | undefined
  getBracketMatches: (competitionId: number, bracketId: number) => Match[]
  createBracket: (competitionId: number, bracket: Omit<Bracket, 'id' | 'competitionId' | 'createdAt' | 'updatedAt'>, matches: Match[]) => Bracket
  updateBracket: (competitionId: number, bracketId: number, updates: Partial<Omit<Bracket, 'id' | 'competitionId' | 'createdAt'>>) => Bracket | undefined
  updateBracketMatches: (competitionId: number, bracketId: number, matches: Match[]) => void
  deleteBracket: (competitionId: number, bracketId: number) => boolean
  refreshBrackets: (competitionId: number) => void

  // Global refresh
  refreshAll: () => void
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined)

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
  // State for cached data
  const [clubs, setClubs] = useState<Club[]>([])
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [bracketCache, setBracketCache] = useState<Map<number, BracketMetadata[]>>(new Map())

  // Load initial data
  useEffect(() => {
    setClubs(clubsRepo.getAll())
    setFighters(fightersRepo.getAll())
    setCompetitions(competitionsRepo.getAll())
  }, [])

  // Clubs
  const refreshClubs = useCallback(() => {
    setClubs(clubsRepo.getAll())
  }, [])

  const getClubById = useCallback((id: number) => {
    return clubs.find(c => c.id === id)
  }, [clubs])

  const addClub = useCallback((club: Omit<Club, 'id'>) => {
    const newClub = clubsRepo.create(club)
    setClubs(clubsRepo.getAll())
    return newClub
  }, [])

  const updateClub = useCallback((id: number, updates: Partial<Omit<Club, 'id'>>) => {
    const updated = clubsRepo.update(id, updates)
    if (updated) {
      setClubs(clubsRepo.getAll())
    }
    return updated
  }, [])

  const deleteClub = useCallback((id: number) => {
    const success = clubsRepo.delete(id)
    if (success) {
      setClubs(clubsRepo.getAll())
    }
    return success
  }, [])

  // Fighters
  const refreshFighters = useCallback(() => {
    setFighters(fightersRepo.getAll())
  }, [])

  const getFighterById = useCallback((id: number) => {
    return fighters.find(f => f.id === id)
  }, [fighters])

  const getFightersByClubId = useCallback((clubId: number) => {
    return fighters.filter(f => f.clubId === clubId)
  }, [fighters])

  const getFightersByIds = useCallback((ids: number[]) => {
    const idSet = new Set(ids)
    return fighters.filter(f => idSet.has(f.id))
  }, [fighters])

  const addFighter = useCallback((fighter: Omit<Fighter, 'id'>) => {
    const newFighter = fightersRepo.create(fighter)
    setFighters(fightersRepo.getAll())
    return newFighter
  }, [])

  const updateFighter = useCallback((id: number, updates: Partial<Omit<Fighter, 'id'>>) => {
    const updated = fightersRepo.update(id, updates)
    if (updated) {
      setFighters(fightersRepo.getAll())
    }
    return updated
  }, [])

  const deleteFighter = useCallback((id: number) => {
    const success = fightersRepo.delete(id)
    if (success) {
      setFighters(fightersRepo.getAll())
    }
    return success
  }, [])

  // Competitions
  const refreshCompetitions = useCallback(() => {
    setCompetitions(competitionsRepo.getAll())
  }, [])

  const getCompetitionById = useCallback((id: number) => {
    return competitions.find(c => c.id === id)
  }, [competitions])

  const addCompetition = useCallback((competition: Omit<Competition, 'id'>) => {
    const newCompetition = competitionsRepo.create(competition)
    setCompetitions(competitionsRepo.getAll())
    return newCompetition
  }, [])

  const updateCompetition = useCallback((id: number, updates: Partial<Omit<Competition, 'id'>>) => {
    const updated = competitionsRepo.update(id, updates)
    if (updated) {
      setCompetitions(competitionsRepo.getAll())
    }
    return updated
  }, [])

  const deleteCompetition = useCallback((id: number) => {
    const success = competitionsRepo.delete(id)
    if (success) {
      setCompetitions(competitionsRepo.getAll())
      // Also clean up brackets
      setBracketCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(id)
        return newCache
      })
    }
    return success
  }, [])

  // Brackets
  const refreshBrackets = useCallback((competitionId: number) => {
    const brackets = bracketsRepo.getAllForCompetition(competitionId)
    setBracketCache(prev => new Map(prev).set(competitionId, brackets))
  }, [])

  const getBracketsByCompetition = useCallback((competitionId: number) => {
    if (!bracketCache.has(competitionId)) {
      const brackets = bracketsRepo.getAllForCompetition(competitionId)
      setBracketCache(prev => new Map(prev).set(competitionId, brackets))
      return brackets
    }
    return bracketCache.get(competitionId) || []
  }, [bracketCache])

  const getBracketById = useCallback((competitionId: number, bracketId: number) => {
    return bracketsRepo.getById(competitionId, bracketId)
  }, [])

  const getBracketMatches = useCallback((competitionId: number, bracketId: number) => {
    return bracketsRepo.getMatches(competitionId, bracketId)
  }, [])

  const createBracket = useCallback((
    competitionId: number,
    bracket: Omit<Bracket, 'id' | 'competitionId' | 'createdAt' | 'updatedAt'>,
    matches: Match[]
  ) => {
    const newBracket = bracketsRepo.create(competitionId, bracket, matches)
    refreshBrackets(competitionId)
    return newBracket
  }, [refreshBrackets])

  const updateBracket = useCallback((
    competitionId: number,
    bracketId: number,
    updates: Partial<Omit<Bracket, 'id' | 'competitionId' | 'createdAt'>>
  ) => {
    const updated = bracketsRepo.update(competitionId, bracketId, updates)
    if (updated) {
      refreshBrackets(competitionId)
    }
    return updated
  }, [refreshBrackets])

  const updateBracketMatches = useCallback((
    competitionId: number,
    bracketId: number,
    matches: Match[]
  ) => {
    bracketsRepo.updateMatches(competitionId, bracketId, matches)
    refreshBrackets(competitionId)
  }, [refreshBrackets])

  const deleteBracket = useCallback((competitionId: number, bracketId: number) => {
    const success = bracketsRepo.delete(competitionId, bracketId)
    if (success) {
      refreshBrackets(competitionId)
    }
    return success
  }, [refreshBrackets])

  // Global refresh
  const refreshAll = useCallback(() => {
    refreshClubs()
    refreshFighters()
    refreshCompetitions()
    setBracketCache(new Map())
  }, [refreshClubs, refreshFighters, refreshCompetitions])

  const value: RepositoryContextType = {
    // Clubs
    clubs,
    getClubById,
    addClub,
    updateClub,
    deleteClub,
    refreshClubs,

    // Fighters
    fighters,
    getFighterById,
    getFightersByClubId,
    getFightersByIds,
    addFighter,
    updateFighter,
    deleteFighter,
    refreshFighters,

    // Competitions
    competitions,
    getCompetitionById,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    refreshCompetitions,

    // Brackets
    getBracketsByCompetition,
    getBracketById,
    getBracketMatches,
    createBracket,
    updateBracket,
    updateBracketMatches,
    deleteBracket,
    refreshBrackets,

    // Global
    refreshAll,
  }

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  )
}

// Main hook
export const useRepositories = () => {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepositories must be used within RepositoryProvider')
  }
  return context
}

// Granular hooks for convenience
export const useClubs = () => {
  const { clubs, getClubById, addClub, updateClub, deleteClub, refreshClubs } = useRepositories()
  return { clubs, getClubById, addClub, updateClub, deleteClub, refreshClubs }
}

export const useFighters = () => {
  const {
    fighters,
    getFighterById,
    getFightersByClubId,
    getFightersByIds,
    addFighter,
    updateFighter,
    deleteFighter,
    refreshFighters,
  } = useRepositories()
  return {
    fighters,
    getFighterById,
    getFightersByClubId,
    getFightersByIds,
    addFighter,
    updateFighter,
    deleteFighter,
    refreshFighters,
  }
}

export const useCompetitions = () => {
  const {
    competitions,
    getCompetitionById,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    refreshCompetitions,
  } = useRepositories()
  return {
    competitions,
    getCompetitionById,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    refreshCompetitions,
  }
}

export const useBrackets = (competitionId?: number) => {
  const {
    getBracketsByCompetition,
    getBracketById,
    getBracketMatches,
    createBracket,
    updateBracket,
    updateBracketMatches,
    deleteBracket,
    refreshBrackets,
  } = useRepositories()

  return {
    getBracketsByCompetition,
    getBracketById,
    getBracketMatches,
    createBracket,
    updateBracket,
    updateBracketMatches,
    deleteBracket,
    refreshBrackets: competitionId ? () => refreshBrackets(competitionId) : refreshBrackets,
  }
}
