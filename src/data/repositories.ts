/**
 * Repository layer for data access.
 * Provides standardized CRUD interfaces for all entities.
 * Abstracts localStorage implementation, making it easy to replace with real API calls later.
 */

import type { Club } from '../types/Club'
import type { Fighter } from '../types/Fighter'
import type { Competition } from '../types/Competition'
import type { Bracket, BracketMetadata } from '../types/Bracket'
import type { Match } from '../types/Match'

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  CLUBS: 'clubs',
  FIGHTERS: 'fighters',
  COMPETITIONS: 'competitions',
  // Bracket storage uses dynamic keys: competitions:<id>:brackets, competitions:<id>:bracket:<bracketId>:matches
} as const

// ============================================================================
// CLUBS REPOSITORY
// ============================================================================

export const clubsRepo = {
  getAll(): Club[] {
    const json = localStorage.getItem(STORAGE_KEYS.CLUBS)
    return json ? JSON.parse(json) : []
  },

  getById(id: number): Club | undefined {
    return this.getAll().find((club) => club.id === id)
  },

  create(club: Omit<Club, 'id'>): Club {
    const clubs = this.getAll()
    const newClub: Club = {
      ...club,
      id: this._generateId(clubs),
    }
    clubs.push(newClub)
    this._save(clubs)
    return newClub
  },

  update(id: number, updates: Partial<Omit<Club, 'id'>>): Club | undefined {
    const clubs = this.getAll()
    const index = clubs.findIndex((c) => c.id === id)
    if (index === -1) return undefined

    clubs[index] = { ...clubs[index], ...updates }
    this._save(clubs)
    return clubs[index]
  },

  delete(id: number): boolean {
    const clubs = this.getAll()
    const filtered = clubs.filter((c) => c.id !== id)
    if (filtered.length === clubs.length) return false

    this._save(filtered)
    return true
  },

  _generateId(clubs: Club[]): number {
    return clubs.length === 0 ? 1 : Math.max(...clubs.map((c) => c.id)) + 1
  },

  _save(clubs: Club[]): void {
    localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs))
  },
}

// ============================================================================
// FIGHTERS REPOSITORY
// ============================================================================

export const fightersRepo = {
  getAll(): Fighter[] {
    const json = localStorage.getItem(STORAGE_KEYS.FIGHTERS)
    return json ? JSON.parse(json) : []
  },

  getById(id: number): Fighter | undefined {
    return this.getAll().find((fighter) => fighter.id === id)
  },

  getByClubId(clubId: number): Fighter[] {
    return this.getAll().filter((fighter) => fighter.clubId === clubId)
  },

  getByIds(ids: number[]): Fighter[] {
    const fighters = this.getAll()
    const idSet = new Set(ids)
    return fighters.filter((f) => idSet.has(f.id))
  },

  create(fighter: Omit<Fighter, 'id'>): Fighter {
    const fighters = this.getAll()
    const newFighter: Fighter = {
      ...fighter,
      id: this._generateId(fighters),
    }
    fighters.push(newFighter)
    this._save(fighters)
    return newFighter
  },

  update(id: number, updates: Partial<Omit<Fighter, 'id'>>): Fighter | undefined {
    const fighters = this.getAll()
    const index = fighters.findIndex((f) => f.id === id)
    if (index === -1) return undefined

    fighters[index] = { ...fighters[index], ...updates }
    this._save(fighters)
    return fighters[index]
  },

  delete(id: number): boolean {
    const fighters = this.getAll()
    const filtered = fighters.filter((f) => f.id !== id)
    if (filtered.length === fighters.length) return false

    this._save(filtered)
    return true
  },

  _generateId(fighters: Fighter[]): number {
    return fighters.length === 0 ? 1 : Math.max(...fighters.map((f) => f.id)) + 1
  },

  _save(fighters: Fighter[]): void {
    localStorage.setItem(STORAGE_KEYS.FIGHTERS, JSON.stringify(fighters))
  },
}

// ============================================================================
// COMPETITIONS REPOSITORY
// ============================================================================

export const competitionsRepo = {
  getAll(): Competition[] {
    const json = localStorage.getItem(STORAGE_KEYS.COMPETITIONS)
    return json ? JSON.parse(json) : []
  },

  getById(id: number): Competition | undefined {
    return this.getAll().find((comp) => comp.id === id)
  },

  create(competition: Omit<Competition, 'id'>): Competition {
    const competitions = this.getAll()
    const newCompetition: Competition = {
      ...competition,
      id: this._generateId(competitions),
    }
    competitions.push(newCompetition)
    this._save(competitions)
    return newCompetition
  },

  update(id: number, updates: Partial<Omit<Competition, 'id'>>): Competition | undefined {
    const competitions = this.getAll()
    const index = competitions.findIndex((c) => c.id === id)
    if (index === -1) return undefined

    competitions[index] = { ...competitions[index], ...updates }
    this._save(competitions)
    return competitions[index]
  },

  delete(id: number): boolean {
    const competitions = this.getAll()
    const filtered = competitions.filter((c) => c.id !== id)
    if (filtered.length === competitions.length) return false

    this._save(filtered)
    return true
  },

  _generateId(competitions: Competition[]): number {
    return competitions.length === 0 ? 1 : Math.max(...competitions.map((c) => c.id)) + 1
  },

  _save(competitions: Competition[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions))
  },
}

// ============================================================================
// BRACKETS REPOSITORY
// ============================================================================

export const bracketsRepo = {
  /**
   * Get all bracket metadata for a competition
   */
  getAllForCompetition(competitionId: number): BracketMetadata[] {
    const key = `competitions:${competitionId}:brackets`
    const json = localStorage.getItem(key)
    return json ? JSON.parse(json) : []
  },

  /**
   * Get full bracket with matches
   */
  getById(competitionId: number, bracketId: number): Bracket | undefined {
    const metadata = this.getAllForCompetition(competitionId).find((b) => b.id === bracketId)
    if (!metadata) return undefined

    // Convert metadata to full Bracket (same structure for now)
    return {
      id: metadata.id,
      competitionId: metadata.competitionId,
      division: metadata.division,
      fighterIds: metadata.fighterIds,
      seedMethod: metadata.seedMethod,
      status: metadata.status,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
    }
  },

  /**
   * Get matches for a bracket
   */
  getMatches(competitionId: number, bracketId: number): Match[] {
    const key = `competitions:${competitionId}:bracket:${bracketId}:matches`
    const json = localStorage.getItem(key)
    return json ? JSON.parse(json) : []
  },

  /**
   * Create a new bracket with matches
   */
  create(
    competitionId: number,
    bracket: Omit<Bracket, 'id' | 'competitionId' | 'createdAt' | 'updatedAt'>,
    matches: Match[]
  ): Bracket {
    const existing = this.getAllForCompetition(competitionId)
    const newId = this._generateId(existing)
    const now = new Date().toISOString()

    const newBracket: Bracket = {
      ...bracket,
      id: newId,
      competitionId,
      createdAt: now,
      updatedAt: now,
    }

    // Save metadata
    const metadata: BracketMetadata = {
      ...newBracket,
      fighterCount: bracket.fighterIds.length,
    }
    existing.push(metadata)
    this._saveMetadata(competitionId, existing)

    // Save matches
    this._saveMatches(competitionId, newId, matches)

    return newBracket
  },

  /**
   * Update bracket metadata
   */
  update(
    competitionId: number,
    bracketId: number,
    updates: Partial<Omit<Bracket, 'id' | 'competitionId' | 'createdAt'>>
  ): Bracket | undefined {
    const brackets = this.getAllForCompetition(competitionId)
    const index = brackets.findIndex((b) => b.id === bracketId)
    if (index === -1) return undefined

    const now = new Date().toISOString()
    brackets[index] = {
      ...brackets[index],
      ...updates,
      updatedAt: now,
      fighterCount: updates.fighterIds?.length ?? brackets[index].fighterCount,
    }
    this._saveMetadata(competitionId, brackets)

    return this.getById(competitionId, bracketId)
  },

  /**
   * Update matches for a bracket
   */
  updateMatches(competitionId: number, bracketId: number, matches: Match[]): void {
    this._saveMatches(competitionId, bracketId, matches)

    // Update bracket's updatedAt timestamp
    const brackets = this.getAllForCompetition(competitionId)
    const index = brackets.findIndex((b) => b.id === bracketId)
    if (index !== -1) {
      brackets[index].updatedAt = new Date().toISOString()
      this._saveMetadata(competitionId, brackets)
    }
  },

  /**
   * Delete a bracket and its matches
   */
  delete(competitionId: number, bracketId: number): boolean {
    const brackets = this.getAllForCompetition(competitionId)
    const filtered = brackets.filter((b) => b.id !== bracketId)
    if (filtered.length === brackets.length) return false

    this._saveMetadata(competitionId, filtered)

    // Delete matches
    const matchesKey = `competitions:${competitionId}:bracket:${bracketId}:matches`
    localStorage.removeItem(matchesKey)

    return true
  },

  _generateId(brackets: BracketMetadata[]): number {
    return brackets.length === 0 ? 1 : Math.max(...brackets.map((b) => b.id)) + 1
  },

  _saveMetadata(competitionId: number, brackets: BracketMetadata[]): void {
    const key = `competitions:${competitionId}:brackets`
    localStorage.setItem(key, JSON.stringify(brackets))
  },

  _saveMatches(competitionId: number, bracketId: number, matches: Match[]): void {
    const key = `competitions:${competitionId}:bracket:${bracketId}:matches`
    localStorage.setItem(key, JSON.stringify(matches))
  },
}