/**
 * Matches Repository - Single Source of Truth for all match data
 * Handles participants, results, status, and automatic propagation
 */

import type { Match, MatchParticipant, MatchOutcome } from '../types/Match'
import { emitMatchResultRecorded } from '../events/matchEvents'
import { competitionsRepo } from './repositories'

const STORAGE_KEY = 'matches'

// ============================================================================
// TYPE GUARDS & VALIDATORS
// ============================================================================

const isResultedOutcome = (outcome: MatchOutcome | null): boolean => {
  // All outcomes except null mean the match has a result that can propagate
  return outcome !== null
}

// ============================================================================
// MATCHES REPOSITORY
// ============================================================================

export const matchesRepo = {
  /**
   * Read all matches
   */
  readAll(): Match[] {
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? JSON.parse(json) : []
  },

  /**
   * Read match by ID
   */
  readById(id: number): Match | undefined {
    return this.readAll().find(m => m.id === id)
  },

  /**
   * List matches by competition
   */
  listByCompetition(competitionId: number): Match[] {
    return this.readAll().filter(m => m.competitionId === competitionId)
  },

  /**
   * List matches by bracket (requires both competitionId and bracketId since bracketId is only unique within a competition)
   */
  listByBracket(competitionId: number, bracketId: number): Match[] {
    return this.readAll().filter(m => m.competitionId === competitionId && m.bracketId === bracketId)
  },

  /**
   * Create a new match
   */
  create(input: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Match {
    this._validateCreate(input)

    const matches = this.readAll()
    const now = new Date().toISOString()

    const newMatch: Match = {
      ...input,
      id: this._generateId(matches),
      createdAt: now,
      updatedAt: now,
    }

    matches.push(newMatch)
    this._save(matches)

    return newMatch
  },

  /**
   * Update a match
   * Handles result recording and automatic propagation
   */
  update(id: number, patch: Partial<Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'competitionId'>>): Match {
    const matches = this.readAll()
    const index = matches.findIndex(m => m.id === id)
    
    if (index === -1) {
      throw new Error(`Match ${id} not found`)
    }

    const existing = matches[index]
    this._validateUpdate(existing, patch)

    const now = new Date().toISOString()
    const updated: Match = {
      ...existing,
      ...patch,
      updatedAt: now,
    }

    matches[index] = updated
    this._save(matches)

    // If match completed with a winner, emit event for propagation
    if (
      updated.state === 'completed' &&
      updated.outcome &&
      isResultedOutcome(updated.outcome)
    ) {
      const winner = updated.participants.find(p => p.isWinner)
      const winnerId = winner?.fighterId ?? null
      
      if (winnerId !== null) {
        emitMatchResultRecorded(updated, winnerId)
        
        // Auto-propagate to next match if exists
        if (updated.nextMatchId) {
          this._propagateWinner(updated.nextMatchId, winnerId, updated.id)
        }
      }
    }

    return updated
  },

  /**
   * Remove a match
   */
  remove(id: number): boolean {
    const matches = this.readAll()
    const match = matches.find(m => m.id === id)
    
    if (!match) return false

    // Check if match is referenced by others
    const hasChildren = matches.some(m => m.nextMatchId === id)
    if (hasChildren) {
      throw new Error('Cannot delete match: it is referenced by other matches as nextMatchId')
    }

    const filtered = matches.filter(m => m.id !== id)
    this._save(filtered)
    return true
  },

  /**
   * Assign match to bracket
   */
  assignToBracket(matchId: number, bracketId: number): Match {
    const match = this.readById(matchId)
    if (!match) throw new Error(`Match ${matchId} not found`)

    return this.update(matchId, { bracketId })
  },

  /**
   * Unassign match from bracket
   */
  unassignFromBracket(matchId: number): Match {
    const match = this.readById(matchId)
    if (!match) throw new Error(`Match ${matchId} not found`)

    // Check if match has children
    const matches = this.readAll()
    const hasChildren = matches.some(m => m.nextMatchId === matchId)
    if (hasChildren) {
      throw new Error('Cannot unassign match: it has child matches')
    }

    return this.update(matchId, {
      bracketId: null,
      round: null,
      nextMatchId: null,
    })
  },

  /**
   * Wire child match to parent (set nextMatchId)
   */
  wireNext(childId: number, parentId: number): Match {
    const child = this.readById(childId)
    const parent = this.readById(parentId)

    if (!child) throw new Error(`Child match ${childId} not found`)
    if (!parent) throw new Error(`Parent match ${parentId} not found`)

    // Validate same competition
    if (child.competitionId !== parent.competitionId) {
      throw new Error('Child and parent must belong to same competition')
    }

    // If both assigned to brackets, must be same bracket
    if (child.bracketId && parent.bracketId && child.bracketId !== parent.bracketId) {
      throw new Error('Child and parent must belong to same bracket')
    }

    // Parent round must be one less (closer to final)
    if (
      child.round !== null &&
      parent.round !== null &&
      parent.round !== child.round - 1
    ) {
      throw new Error(`Invalid round: parent (${parent.round}) must be child (${child.round}) - 1`)
    }

    return this.update(childId, { nextMatchId: parentId })
  },

  /**
   * Record match result and trigger propagation
   * Convenience method that updates state, outcome, and winner
   */
  recordResult(
    matchId: number,
    winnerId: number,
    outcome: MatchOutcome,
    resultText?: string
  ): Match {
    const match = this.readById(matchId)
    if (!match) throw new Error(`Match ${matchId} not found`)

    // Find participant indices
    const winnerIndex = match.participants.findIndex(p => p.fighterId === winnerId)
    if (winnerIndex === -1) {
      throw new Error(`Fighter ${winnerId} not in match ${matchId}`)
    }

    const loserIndex = winnerIndex === 0 ? 1 : 0

    // Update participants
    const updatedParticipants: [MatchParticipant, MatchParticipant] = [...match.participants] as [MatchParticipant, MatchParticipant]
    updatedParticipants[winnerIndex] = {
      ...updatedParticipants[winnerIndex],
      isWinner: true,
      resultText: resultText ?? null,
      status: 'ready',
    }
    updatedParticipants[loserIndex] = {
      ...updatedParticipants[loserIndex],
      isWinner: false,
      status: outcome === 'walkover' ? 'no_show' : outcome === 'disqualified' ? 'disqualified' : 'ready',
    }

    return this.update(matchId, {
      state: 'completed',
      outcome,
      participants: updatedParticipants,
    })
  },

  // ============================================================================
  // INTERNAL HELPERS
  // ============================================================================

  /**
   * Propagate winner to parent match
   */
  _propagateWinner(parentMatchId: number, winnerId: number, sourceMatchId: number): void {
    const parent = this.readById(parentMatchId)
    if (!parent) {
      console.warn(`[Propagation] Parent match ${parentMatchId} not found`)
      return
    }

    // Find which slot should receive the winner (slot 0 or 1)
    // This is determined by which child matches feed into this parent
    const matches = this.readAll()
    const children = matches.filter(m => m.nextMatchId === parentMatchId)
    
    if (children.length !== 2) {
      console.warn(`[Propagation] Parent ${parentMatchId} should have exactly 2 children, has ${children.length}`)
    }

    // Determine slot index based on match order
    const sourceIndex = children.findIndex(c => c.id === sourceMatchId)
    if (sourceIndex === -1) {
      console.warn(`[Propagation] Source ${sourceMatchId} not found in children of ${parentMatchId}`)
      return
    }

    const slotIndex = sourceIndex as 0 | 1

    // Update parent participant slot
    const updatedParticipants: [MatchParticipant, MatchParticipant] = [...parent.participants] as [MatchParticipant, MatchParticipant]
    updatedParticipants[slotIndex] = {
      fighterId: winnerId,
      isWinner: false,
      resultText: null,
      status: 'ready',
    }

    // Update parent match
    this.update(parentMatchId, {
      participants: updatedParticipants,
    })
  },

  /**
   * Validate match creation
   */
  _validateCreate(input: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): void {
    // Competition must exist
    const competition = competitionsRepo.getById(input.competitionId)
    if (!competition) {
      throw new Error(`Competition ${input.competitionId} not found`)
    }

    // Must have exactly 2 participants
    if (input.participants.length !== 2) {
      throw new Error('Match must have exactly 2 participants')
    }

    // If completed, must have outcome
    if (input.state === 'completed' && !input.outcome) {
      throw new Error('Completed match must have outcome')
    }

    // If has outcome, must be completed
    if (input.outcome && input.state !== 'completed') {
      throw new Error('Only completed matches can have outcome')
    }

    // At most one winner
    const winners = input.participants.filter(p => p.isWinner)
    if (winners.length > 1) {
      throw new Error('Match can have at most one winner')
    }
  },

  /**
   * Validate match update
   */
  _validateUpdate(
    existing: Match,
    patch: Partial<Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'competitionId'>>
  ): void {
    // Cannot change competition
    if ('competitionId' in patch) {
      throw new Error('Cannot change match competition')
    }

    // If setting outcome, state must be completed
    if (patch.outcome) {
      const finalState = patch.state ?? existing.state
      if (finalState !== 'completed') {
        throw new Error('Only completed matches can have outcome')
      }
    }

    // If setting state to completed, must have outcome
    if (patch.state === 'completed') {
      const finalOutcome = patch.outcome ?? existing.outcome
      if (!finalOutcome) {
        throw new Error('Completed match must have outcome')
      }
    }

    // Validate participants if provided
    if (patch.participants) {
      if (patch.participants.length !== 2) {
        throw new Error('Match must have exactly 2 participants')
      }

      const winners = patch.participants.filter(p => p.isWinner)
      if (winners.length > 1) {
        throw new Error('Match can have at most one winner')
      }
    }
  },

  _generateId(matches: Match[]): number {
    return matches.length === 0 ? 1 : Math.max(...matches.map(m => m.id)) + 1
  },

  _save(matches: Match[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
  },
}
