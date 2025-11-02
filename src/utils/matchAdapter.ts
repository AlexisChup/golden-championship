/**
 * Match Adapter - Converts between domain Match and library-specific formats
 * 
 * Purpose: Separate domain model (Single Source of Truth) from view layer requirements
 * Direction: Match (repo) → LibraryMatch (bracket viewer component)
 */

import type { Match, MatchParticipant } from '../types/Match'
import type { LibraryMatch, LibraryMatchState, LibraryParticipantStatus } from '../types/Match'
import { fightersRepo } from '../data/repositories'

// ============================================================================
// STATE CONVERSION
// ============================================================================

/**
 * Convert domain MatchState to library format
 */
const convertMatchState = (match: Match): LibraryMatchState => {
  if (match.state === 'completed') {
    // If completed with scores, use SCORE_DONE, else DONE
    return match.outcome === 'score_done' ? 'SCORE_DONE' : 'DONE'
  }
  if (match.state === 'scheduled') {
    // Check if both participants are TBD
    const hasTBD = match.participants.some(p => p.fighterId === null)
    if (hasTBD) {
      return 'NO_PARTY'
    }
    // Scheduled with both fighters ready
    return 'NO_PARTY' // Library doesn't have SCHEDULED, use NO_PARTY as default
  }
  // in_progress or cancelled
  return match.state === 'cancelled' ? 'WALK_OVER' : 'NO_PARTY'
}

/**
 * Convert domain ParticipantStatus to library format
 */
const convertParticipantStatus = (status: MatchParticipant['status']): LibraryParticipantStatus => {
  switch (status) {
    case 'ready':
      return 'PLAYED'
    case 'tbd':
      return 'NO_SHOW'
    case 'disqualified':
      return 'NO_SHOW' // Library doesn't have DISQUALIFIED
    case 'no_show':
      return 'NO_SHOW'
    default:
      return 'NO_SHOW'
  }
}

// ============================================================================
// PARTICIPANT CONVERSION
// ============================================================================

interface LibraryParticipant {
  id: string
  name: string
  isWinner: boolean
  resultText: string | null
  status: LibraryParticipantStatus | null
}

/**
 * Convert domain participant to library format
 * Resolves fighterId to name via fightersRepo
 */
const convertParticipant = (participant: MatchParticipant): LibraryParticipant => {
  if (participant.fighterId === null) {
    return {
      id: 'TBD',
      name: 'TBD',
      isWinner: false,
      resultText: null,
      status: null,
    }
  }
  
  const fighter = fightersRepo.getById(participant.fighterId)
  const name = fighter 
    ? `${fighter.firstName} ${fighter.lastName}`.trim() 
    : `Fighter ${participant.fighterId}`
  
  return {
    id: String(participant.fighterId),
    name,
    isWinner: participant.isWinner,
    resultText: participant.resultText,
    status: convertParticipantStatus(participant.status),
  }
}

// ============================================================================
// MATCH CONVERSION
// ============================================================================

/**
 * Convert domain Match to library format for bracket viewer
 */
export const convertMatchToLibrary = (match: Match): LibraryMatch => {
  const state = convertMatchState(match)
  
  // Convert participants
  const participants = match.participants.map(convertParticipant) as [LibraryParticipant, LibraryParticipant]
  
  // Derive tournamentRoundText from round (0 = final = round 1 in display)
  // Round numbering: 0 = final, 1 = semi, 2 = quarter, etc.
  // Display: final = 1, semi = 2, quarter = 3, etc.
  const tournamentRoundText = match.round !== null ? String(match.round + 1) : '1'
  
  return {
    id: match.id,
    name: match.name ?? `Match ${match.id}`,
    nextMatchId: match.nextMatchId,
    tournamentRoundText,
    startTime: match.startTime ?? new Date().toISOString(),
    state,
    participants,
  }
}

/**
 * Convert array of domain matches to library format
 */
export const convertMatchesToLibrary = (matches: Match[]): LibraryMatch[] => {
  return matches.map(convertMatchToLibrary)
}

/**
 * Convert matches for a specific bracket
 * Includes sorting by round and match order
 */
export const convertBracketMatchesToLibrary = (matches: Match[]): LibraryMatch[] => {
  // Sort by round (descending, so first round comes first) then by id
  const sorted = [...matches].sort((a, b) => {
    const roundA = a.round ?? 0
    const roundB = b.round ?? 0
    
    if (roundA !== roundB) {
      return roundB - roundA // Higher round (first round) first
    }
    
    return a.id - b.id
  })
  
  return convertMatchesToLibrary(sorted)
}

// ============================================================================
// REVERSE CONVERSION (for forms/editors)
// ============================================================================

/**
 * Extract fighter IDs from library match participants
 * Used when editing matches
 */
export const extractFighterIds = (libraryMatch: LibraryMatch): (number | null)[] => {
  return libraryMatch.participants.map(p => {
    if (p.id === 'TBD') return null
    const id = Number(p.id)
    return isNaN(id) ? null : id
  })
}

/**
 * Get match display summary
 */
export const getMatchSummary = (match: Match): string => {
  const fighters = fightersRepo.getAll()
  const getFighterName = (fighterId: number | null): string => {
    if (fighterId === null) return 'TBD'
    const fighter = fighters.find(f => f.id === fighterId)
    return fighter ? `${fighter.firstName} ${fighter.lastName}`.trim() : `Fighter ${fighterId}`
  }
  
  const p1 = getFighterName(match.participants[0].fighterId)
  const p2 = getFighterName(match.participants[1].fighterId)
  
  return `${p1} vs ${p2}`
}
