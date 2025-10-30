// Library-compatible enums (EXACT for brackets library)
export type LibraryMatchState = 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE'
export type LibraryParticipantStatus = 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null

// Participant in a match (library-compatible)
export type MatchParticipant = {
  id: string // fighter UUID (required by library)
  name: string // fighter display name
  isWinner: boolean
  resultText: string | null // e.g., "WON", "TKO", "Decision", null
  status: LibraryParticipantStatus
}

// App-specific metadata (extensions safe for UI, ignored by library)
export type MatchMeta = {
  competitionUuid: string // link to competition (UUID)
  bracketUuid?: string | null // reserved for future brackets
  ruleType?: string // e.g., "K1 Rules"
  gender?: 'Male' | 'Female'
  ageGroup?: string // e.g., "16-17"
  weightClass?: string // e.g., "Boys -85kg"
  ring?: string // e.g., "Ring 1"
  notes?: string | null
}

// Match type: EXACT library shape + app extensions
export type Match = {
  // Library-required fields (EXACT for brackets library compatibility)
  id: number // numeric for the library
  name: string // e.g., "Semifinal - Match"
  nextMatchId: number | null // null/undefined for final or if unknown
  tournamentRoundText: string // e.g., "3" for Round header
  startTime: string // e.g., "2025-11-01T10:00:00Z" (ISO)
  state: LibraryMatchState
  participants: [MatchParticipant, MatchParticipant]

  // App-specific extensions (safe for our UI/filters, ignored by the lib)
  uuid?: string // internal UUID if we want to track matches by UUID too
  meta?: MatchMeta
}

// Helper to get state label for display
export const getMatchStateLabel = (state: LibraryMatchState): string => {
  const labels: Record<LibraryMatchState, string> = {
    NO_SHOW: 'No Show',
    WALK_OVER: 'Walk Over',
    NO_PARTY: 'No Party',
    DONE: 'Done',
    SCORE_DONE: 'Score Done',
  }
  return labels[state]
}

// Helper to get state color
export const getMatchStateColor = (state: LibraryMatchState): { bg: string; text: string } => {
  const colors: Record<LibraryMatchState, { bg: string; text: string }> = {
    NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-700' },
    WALK_OVER: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    NO_PARTY: { bg: 'bg-red-100', text: 'text-red-700' },
    DONE: { bg: 'bg-blue-100', text: 'text-blue-700' },
    SCORE_DONE: { bg: 'bg-green-100', text: 'text-green-700' },
  }
  return colors[state]
}
