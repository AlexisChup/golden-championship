/**
 * Bracket Generator V2 - Uses matchesRepo as Single Source of Truth
 * 
 * Architecture:
 * 1. Create ALL matches in matchesRepo with proper participants
 * 2. Wire topology with nextMatchId references
 * 3. Store only topology metadata in bracketsRepo
 * 4. No embedded match data in brackets
 */

import type { Match, MatchParticipant } from '../types/Match'
import type { SeedMethod } from '../types/Bracket'
import { matchesRepo } from '../data/matchesRepository'

// ============================================================================
// SEEDING & HELPERS
// ============================================================================

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
 * Get round name based on round number (0 = Final, 1 = Semi, etc.)
 */
const getRoundName = (round: number, totalRounds: number): string => {
  if (round === 0) return 'Final'
  if (round === 1) return 'Semifinal'
  if (round === 2) return 'Quarterfinal'
  
  return `Round ${totalRounds - round}`
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
 * Seed fighters based on method
 */
const seedFighters = (
  fighterIds: number[],
  seedMethod: SeedMethod,
  randomSeed?: number
): number[] => {
  let orderedIds: number[]
  
  switch (seedMethod) {
    case 'random': {
      const rng = new SeededRandom(randomSeed ?? Date.now())
      orderedIds = rng.shuffle([...fighterIds])
      break
    }
    case 'ranking':
    case 'manual':
      // Assume input array is already in desired order
      orderedIds = [...fighterIds]
      break
  }
  
  const bracketSize = nextPowerOfTwo(orderedIds.length)
  
  // Apply standard seeding pattern
  if (bracketSize >= 4 && orderedIds.length > 1) {
    const pattern = generateSeedingPattern(bracketSize)
    const seeded: (number | null)[] = new Array(bracketSize).fill(null)
    
    for (let i = 0; i < bracketSize; i++) {
      const seedIndex = pattern[i] - 1
      if (seedIndex < orderedIds.length) {
        seeded[i] = orderedIds[seedIndex]
      }
    }
    
    return seeded.filter((id): id is number => id !== null)
  }
  
  return orderedIds
}

/**
 * Create TBD participant (for byes or future rounds)
 */
const createTBDParticipant = (): MatchParticipant => ({
  fighterId: null,
  isWinner: false,
  resultText: null,
  status: 'tbd',
})

/**
 * Create participant from fighter ID
 */
const createFighterParticipant = (fighterId: number): MatchParticipant => ({
  fighterId,
  isWinner: false,
  resultText: null,
  status: 'ready',
})

// ============================================================================
// BRACKET GENERATION
// ============================================================================

export interface GenerateBracketOptions {
  competitionId: number
  bracketId: number | null // Can be null initially
  fighterIds: number[]
  seedMethod: SeedMethod
  randomSeed?: number
  startTime?: string
  name?: string
}

export interface BracketTopology {
  rounds: number[][] // rounds[roundIndex] = [matchId, matchId, ...]
  totalMatches: number
  totalRounds: number
}

/**
 * Generate single-elimination bracket
 * Returns created matches and topology
 */
export const generateSingleEliminationBracket = (
  options: GenerateBracketOptions
): { matches: Match[]; topology: BracketTopology } => {
  const { competitionId, bracketId, fighterIds, seedMethod, randomSeed, startTime, name } = options
  
  if (fighterIds.length === 0) {
    throw new Error('Cannot generate bracket with 0 fighters')
  }
  
  // Seed fighters
  const seededFighters = seedFighters(fighterIds, seedMethod, randomSeed)
  const bracketSize = nextPowerOfTwo(seededFighters.length)
  
  // Calculate number of rounds (0-indexed, 0 = final)
  const totalRounds = Math.log2(bracketSize)
  
  // Create all matches bottom-up (first round → final)
  const matches: Match[] = []
  const roundMatches: number[][] = [] // roundMatches[round] = [matchId, ...]
  
  // Round totalRounds-1 is the first round (furthest from final)
  // Round 0 is the final
  for (let round = totalRounds - 1; round >= 0; round--) {
    const matchesInRound = Math.pow(2, round)
    const matchIds: number[] = []
    
    for (let i = 0; i < matchesInRound; i++) {
      let participants: [MatchParticipant, MatchParticipant]
      
      if (round === totalRounds - 1) {
        // First round: assign fighters or byes
        const slot1Index = i * 2
        const slot2Index = i * 2 + 1
        
        const fighter1 = slot1Index < seededFighters.length ? seededFighters[slot1Index] : null
        const fighter2 = slot2Index < seededFighters.length ? seededFighters[slot2Index] : null
        
        participants = [
          fighter1 !== null ? createFighterParticipant(fighter1) : createTBDParticipant(),
          fighter2 !== null ? createFighterParticipant(fighter2) : createTBDParticipant(),
        ]
      } else {
        // Higher rounds: TBD until results propagate
        participants = [createTBDParticipant(), createTBDParticipant()]
      }
      
      const match = matchesRepo.create({
        competitionId,
        bracketId,
        round,
        nextMatchId: null, // Will be wired later
        name: name ? `${name} - ${getRoundName(round, totalRounds)}` : getRoundName(round, totalRounds),
        startTime: startTime ?? null,
        state: 'scheduled',
        outcome: null,
        participants,
        notes: null,
      })
      
      matches.push(match)
      matchIds.push(match.id)
    }
    
    roundMatches.unshift(matchIds) // Prepend so index 0 = final
  }
  
  // Wire topology: each pair of matches in round R feeds into one match in round R-1
  for (let round = totalRounds - 1; round > 0; round--) {
    const currentRoundMatches = roundMatches[round]
    const parentRoundMatches = roundMatches[round - 1]
    
    for (let i = 0; i < currentRoundMatches.length; i += 2) {
      const childMatch1Id = currentRoundMatches[i]
      const childMatch2Id = currentRoundMatches[i + 1]
      const parentMatchId = parentRoundMatches[Math.floor(i / 2)]
      
      // Wire both children to same parent
      matchesRepo.wireNext(childMatch1Id, parentMatchId)
      matchesRepo.wireNext(childMatch2Id, parentMatchId)
    }
  }
  
  // Build topology
  const topology: BracketTopology = {
    rounds: roundMatches,
    totalMatches: matches.length,
    totalRounds,
  }
  
  return { matches, topology }
}

/**
 * Get all matches for a bracket from matchesRepo
 * @param competitionId - Competition ID
 * @param bracketId - Bracket ID (scoped to competition)
 */
export const getBracketMatches = (competitionId: number, bracketId: number): Match[] => {
  return matchesRepo.listByBracket(competitionId, bracketId)
}

/**
 * Rebuild topology from existing matches
 */
export const rebuildTopology = (matches: Match[]): BracketTopology => {
  if (matches.length === 0) {
    return { rounds: [], totalMatches: 0, totalRounds: 0 }
  }
  
  // Find total rounds (max round + 1)
  const maxRound = Math.max(...matches.map(m => m.round ?? 0))
  const totalRounds = maxRound + 1
  
  // Group by round
  const roundMatches: number[][] = Array.from({ length: totalRounds }, () => [])
  
  matches.forEach(match => {
    const round = match.round ?? 0
    roundMatches[round].push(match.id)
  })
  
  return {
    rounds: roundMatches,
    totalMatches: matches.length,
    totalRounds,
  }
}
