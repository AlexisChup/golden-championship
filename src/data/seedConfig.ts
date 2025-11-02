/**
 * Centralized configuration for seed generation and bracket synthesis.
 * Controls how mock data is generated to ensure non-empty brackets.
 */

import {
  AgeGroup,
  Discipline,
  Gender,
  AGE_GROUP_VALUES,
  DISCIPLINE_VALUES,
  GENDER_VALUES,
  WeightClassMen,
  WeightClassWomen,
  WeightClassOpen,
  type WeightClass,
} from '../constants/enums'

export interface SeedConfig {
  // Target ratio of competitions that should have at least 1 bracket
  targetCompetitionsWithBracketsRatio: number

  // Minimum fighters required to create a bracket (absolute minimum 2)
  minFightersPerBracket: number

  // Preferred bracket sizes (power of 2)
  preferredBracketSizes: number[]

  // Maximum brackets per competition
  maxBracketsPerCompetition: number

  // Allowed divisions for bracket generation
  allowedDivisions: {
    ageGroups: AgeGroup[]
    disciplines: Discipline[]
    weightClasses: WeightClass[]
    genders: Gender[]
  }

  // Auto-backfill fighters when a division is short
  autoBackfillFighters: boolean

  // Strategy for backfilling fighters
  backfillStrategy: 'club-distributed' | 'random' | 'balanced'

  // Deterministic seed for reproducible results
  deterministicSeed: string

  // Minimum competitions in the dataset
  minCompetitions: number
}

/**
 * Default seed configuration
 */
export const DEFAULT_SEED_CONFIG: SeedConfig = {
  targetCompetitionsWithBracketsRatio: 0.75,
  minFightersPerBracket: 4,
  preferredBracketSizes: [4, 8, 16],
  maxBracketsPerCompetition: 6,
  allowedDivisions: {
    ageGroups: AGE_GROUP_VALUES.filter(
      (ag) => ag !== AgeGroup.U12 // Exclude very young for demo
    ),
    disciplines: DISCIPLINE_VALUES,
    weightClasses: [
      ...Object.values(WeightClassMen),
      ...Object.values(WeightClassWomen),
      ...Object.values(WeightClassOpen),
    ],
    genders: GENDER_VALUES,
  },
  autoBackfillFighters: true,
  backfillStrategy: 'club-distributed',
  deterministicSeed: 'golden-championship-2025',
  minCompetitions: 4,
}

/**
 * Development seed config (smaller, faster)
 */
export const DEV_SEED_CONFIG: Partial<SeedConfig> = {
  targetCompetitionsWithBracketsRatio: 0.6,
  minFightersPerBracket: 4,
  preferredBracketSizes: [4, 8],
  maxBracketsPerCompetition: 3,
  minCompetitions: 2,
}

/**
 * Demo seed config (rich, comprehensive)
 */
export const DEMO_SEED_CONFIG: Partial<SeedConfig> = {
  targetCompetitionsWithBracketsRatio: 0.85,
  minFightersPerBracket: 4,
  preferredBracketSizes: [4, 8, 16],
  maxBracketsPerCompetition: 8,
  minCompetitions: 6,
}

/**
 * Seeded random number generator for deterministic results
 */
export class SeededRandom {
  private seed: number

  constructor(seed: string) {
    // Convert string to numeric seed
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    this.seed = Math.abs(hash)
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)]
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
