import type { Matches, BracketMatch, SeedMethod } from '../types/Bracket'
import type { MatchParticipant } from '../types/Match'

/**
 * Seeded random number generator for deterministic randomness
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  shuffle<T>(array: T[]): T[] {
    const copy = [...array]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }
}

/**
 * Calculate the next power of 2 >= n
 */
const nextPowerOfTwo = (n: number): number => {
  if (n <= 0) return 1
  let power = 1
  while (power < n) {
    power *= 2
  }
  return power
}

/**
 * Get round name based on round number and total rounds
 */
const getRoundName = (roundNumber: number, totalRounds: number): string => {
  const fromEnd = totalRounds - roundNumber
  
  if (fromEnd === 0) return 'Final'
  if (fromEnd === 1) return 'Semifinal'
  if (fromEnd === 2) return 'Quarterfinal'
  
  return `Round ${roundNumber}`
}

/**
 * Create a TBD (to be determined) participant
 */
const createTBDParticipant = (): MatchParticipant => ({
  id: 'TBD',
  name: 'TBD',
  isWinner: false,
  resultText: null,
  status: null,
})

/**
 * Create a participant from a fighter ID
 */
const createFighterParticipant = (fighterId: number, fighterName: string): MatchParticipant => ({
  id: String(fighterId),
  name: fighterName,
  isWinner: false,
  resultText: null,
  status: null,
})

/**
 * Generate seeded fighter order based on seed method
 */
const seedFighters = (
  fighterIds: number[],
  fighterNames: Map<number, string>,
  seedMethod: SeedMethod,
  randomSeed?: number
): Array<{ id: number; name: string } | null> => {
  let orderedIds: number[]
  
  switch (seedMethod) {
    case 'random': {
      const rng = new SeededRandom(randomSeed ?? Date.now())
      orderedIds = rng.shuffle([...fighterIds])
      break
    }
    case 'ranking':
    case 'manual':
      // Both assume the input array is already in the desired order
      orderedIds = [...fighterIds]
      break
  }
  
  // Convert to fighter objects
  const fighters = orderedIds.map((id) => ({
    id,
    name: fighterNames.get(id) ?? `Fighter ${id}`,
  }))
  
  // Calculate bracket size
  const bracketSize = nextPowerOfTwo(fighters.length)
  
  // Standard single-elimination seeding with byes at strategic positions
  const seeded: Array<{ id: number; name: string } | null> = []
  
  if (fighters.length === 0) return seeded
  
  // Fill bracket with fighters and byes
  for (let i = 0; i < bracketSize; i++) {
    if (i < fighters.length) {
      seeded.push(fighters[i])
    } else {
      seeded.push(null) // bye
    }
  }
  
  // Rearrange to standard bracket seeding pattern (1 vs 16, 8 vs 9, etc.)
  if (bracketSize >= 4 && fighters.length > 1) {
    const standardSeeded: Array<{ id: number; name: string } | null> = new Array(bracketSize).fill(null)
    const pattern = generateSeedingPattern(bracketSize)
    
    for (let i = 0; i < bracketSize; i++) {
      const seedIndex = pattern[i] - 1
      if (seedIndex < fighters.length) {
        standardSeeded[i] = fighters[seedIndex]
      }
    }
    
    return standardSeeded
  }
  
  return seeded
}

/**
 * Generate standard seeding pattern (1-16, 8-9, 5-12, 4-13, etc.)
 */
const generateSeedingPattern = (size: number): number[] => {
  if (size === 2) return [1, 2]
  if (size === 4) return [1, 4, 2, 3]
  if (size === 8) return [1, 8, 4, 5, 2, 7, 3, 6]
  if (size === 16) return [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15]
  if (size === 32) {
    return [
      1, 32, 16, 17, 8, 25, 9, 24, 5, 28, 12, 21, 4, 29, 13, 20,
      6, 27, 11, 22, 3, 30, 14, 19, 7, 26, 10, 23, 2, 31, 15, 18,
    ]
  }
  
  // Fallback: sequential
  return Array.from({ length: size }, (_, i) => i + 1)
}

/**
 * Generate a single-elimination bracket
 */
export interface GenerateBracketOptions {
  competitionId: number
  bracketId: number
  fighterIds: number[]
  fighterNames: Map<number, string> // Map of fighter ID to display name
  seedMethod: SeedMethod
  randomSeed?: number // For deterministic random seeding
  startTime?: string // Base start time (ISO)
}

export const generateSingleEliminationBracket = (options: GenerateBracketOptions): Matches => {
  const { competitionId, bracketId, fighterIds, fighterNames, seedMethod, randomSeed, startTime } = options
  
  if (fighterIds.length === 0) {
    return []
  }
  
  if (fighterIds.length === 1) {
    // Single fighter - champion by default
    const fighter = {
      id: fighterIds[0],
      name: fighterNames.get(fighterIds[0]) ?? `Fighter ${fighterIds[0]}`,
    }
    
    return [
      {
        id: 1,
        name: 'Final',
        nextMatchId: null,
        tournamentRoundText: '1',
        startTime: startTime ?? new Date().toISOString(),
        state: 'DONE',
        participants: [
          createFighterParticipant(fighter.id, fighter.name),
          createTBDParticipant(),
        ] as [MatchParticipant, MatchParticipant],
        meta: {
          competitionUuid: String(competitionId),
          bracketUuid: String(bracketId),
        },
      },
    ]
  }
  
  // Seed fighters
  const seededFighters = seedFighters(fighterIds, fighterNames, seedMethod, randomSeed)
  const bracketSize = seededFighters.length
  
  // Calculate number of rounds
  const totalRounds = Math.log2(bracketSize)
  
  // Generate all matches
  const matches: BracketMatch[] = []
  let matchId = 1
  
  // Build from first round to final
  const roundMatchCounts: number[] = []
  for (let round = 1; round <= totalRounds; round++) {
    roundMatchCounts.push(bracketSize / Math.pow(2, round))
  }
  
  // Track match IDs by round and position for linking
  const matchIdsByRound: number[][] = []
  
  for (let round = 0; round < totalRounds; round++) {
    const matchCount = roundMatchCounts[round]
    const roundMatchIds: number[] = []
    
    for (let matchIndex = 0; matchIndex < matchCount; matchIndex++) {
      const currentMatchId = matchId++
      roundMatchIds.push(currentMatchId)
      
      // Determine nextMatchId
      let nextMatchId: number | null = null
      if (round < totalRounds - 1) {
        // Link to parent match in next round
        const nextRoundMatchIndex = Math.floor(matchIndex / 2)
        const nextRoundStartId = matches.length + matchCount + 1
        nextMatchId = nextRoundStartId + nextRoundMatchIndex
      }
      
      // Create participants
      let participant1: MatchParticipant
      let participant2: MatchParticipant
      
      if (round === 0) {
        // First round: use seeded fighters
        const fighter1Index = matchIndex * 2
        const fighter2Index = matchIndex * 2 + 1
        
        const fighter1 = seededFighters[fighter1Index]
        const fighter2 = seededFighters[fighter2Index]
        
        participant1 = fighter1
          ? createFighterParticipant(fighter1.id, fighter1.name)
          : createTBDParticipant()
        participant2 = fighter2
          ? createFighterParticipant(fighter2.id, fighter2.name)
          : createTBDParticipant()
      } else {
        // Later rounds: TBD (winners determined later)
        participant1 = createTBDParticipant()
        participant2 = createTBDParticipant()
      }
      
      const match: BracketMatch = {
        id: currentMatchId,
        name: `${getRoundName(round + 1, totalRounds)} - Match ${matchIndex + 1}`,
        nextMatchId,
        tournamentRoundText: String(round + 1),
        startTime: startTime ?? new Date().toISOString(),
        state: 'NO_PARTY',
        participants: [participant1, participant2],
        meta: {
          competitionUuid: String(competitionId),
          bracketUuid: String(bracketId),
        },
      }
      
      matches.push(match)
    }
    
    matchIdsByRound.push(roundMatchIds)
  }
  
  return matches
}

/**
 * Validate bracket integrity (all nextMatchId references are valid)
 */
export const validateBracketIntegrity = (matches: Matches): boolean => {
  const matchIds = new Set(matches.map((m) => m.id))
  
  for (const match of matches) {
    if (match.nextMatchId !== null && !matchIds.has(match.nextMatchId)) {
      console.error(`Invalid nextMatchId ${match.nextMatchId} in match ${match.id}`)
      return false
    }
  }
  
  return true
}

/**
 * Get bracket statistics
 */
export interface BracketStats {
  totalMatches: number
  totalRounds: number
  participantSlots: number
  byeCount: number
}

export const getBracketStats = (matches: Matches): BracketStats => {
  if (matches.length === 0) {
    return { totalMatches: 0, totalRounds: 0, participantSlots: 0, byeCount: 0 }
  }
  
  const totalMatches = matches.length
  const totalRounds = Math.max(...matches.map((m) => Number(m.tournamentRoundText)))
  const participantSlots = Math.pow(2, totalRounds)
  
  // Count TBD in first round to determine byes
  const firstRoundMatches = matches.filter((m) => m.tournamentRoundText === '1')
  const byeCount = firstRoundMatches.reduce((count, match) => {
    const tbdCount = match.participants.filter((p) => p.id === 'TBD').length
    return count + tbdCount
  }, 0)
  
  return { totalMatches, totalRounds, participantSlots, byeCount }
}
