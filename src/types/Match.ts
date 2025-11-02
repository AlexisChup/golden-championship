/**
 * CANONICAL MATCH TYPE - Single Source of Truth
 * All match state, participants, and results live here.
 * Brackets reference matches via matchId only.
 */

// ============================================================================
// CANONICAL ENUMS (App-level, unified)
// ============================================================================

export const MatchState = {
  Scheduled: 'scheduled',
  InProgress: 'in_progress',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const

export type MatchState = (typeof MatchState)[keyof typeof MatchState]

export const MatchOutcome = {
  Done: 'done',                 // Normal completion
  ScoreDone: 'score_done',      // Scored completion
  Walkover: 'walkover',         // One fighter no-show
  Disqualified: 'disqualified', // Fighter disqualified
  NoContest: 'no_contest',      // Match cancelled/void
} as const

export type MatchOutcome = (typeof MatchOutcome)[keyof typeof MatchOutcome]

export const ParticipantStatus = {
  Ready: 'ready',
  TBD: 'tbd',                   // Not yet determined (bye or parent match incomplete)
  Disqualified: 'disqualified',
  NoShow: 'no_show',
} as const

export type ParticipantStatus = (typeof ParticipantStatus)[keyof typeof ParticipantStatus]

// ============================================================================
// CANONICAL MATCH (SoT for all match data)
// ============================================================================

export interface MatchParticipant {
  fighterId: number | null      // null = TBD/BYE
  isWinner: boolean
  resultText: string | null     // e.g., "KO Round 2", "Decision"
  status: ParticipantStatus
}

export interface Match {
  id: number
  competitionId: number
  bracketId: number | null      // null = standalone match
  round: number | null          // 0 = final, 1 = semi, 2 = quarter, etc.
  nextMatchId: number | null    // null = final; otherwise parent match
  
  participants: [MatchParticipant, MatchParticipant]
  
  state: MatchState
  outcome: MatchOutcome | null  // only if state = Completed
  
  startTime: string | null      // ISO timestamp
  name: string | null           // e.g., "Final - Men K1 -70kg"
  notes: string | null
  
  createdAt: string
  updatedAt: string
}

// ============================================================================
// LIBRARY ADAPTER TYPES (View-layer only, for bracket renderer)
// ============================================================================

export type LibraryMatchState = 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE'
export type LibraryParticipantStatus = 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null

export interface LibraryMatchParticipant {
  id: string
  name: string
  isWinner: boolean
  resultText: string | null
  status: LibraryParticipantStatus
}

export interface LibraryMatch {
  id: number
  name: string
  nextMatchId: number | null
  tournamentRoundText: string
  startTime: string
  state: LibraryMatchState
  participants: [LibraryMatchParticipant, LibraryMatchParticipant]
}

// ============================================================================
// HELPERS
// ============================================================================

export const getMatchStateLabel = (state: MatchState): string => {
  const labels: Record<MatchState, string> = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[state]
}

export const getMatchStateColor = (state: MatchState): { bg: string; text: string } => {
  const colors: Record<MatchState, { bg: string; text: string }> = {
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
  }
  return colors[state]
}

export const getMatchOutcomeLabel = (outcome: MatchOutcome): string => {
  const labels: Record<MatchOutcome, string> = {
    done: 'Done',
    score_done: 'Score Done',
    walkover: 'Walkover',
    disqualified: 'Disqualified',
    no_contest: 'No Contest',
  }
  return labels[outcome]
}
