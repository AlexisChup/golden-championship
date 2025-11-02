/**
 * Bracket synthesis engine - generates brackets with matches for competitions.
 * Ensures non-empty brackets by grouping fighters into divisions and backfilling when needed.
 */

import type { BracketDivision } from '../types/Bracket'
import type { Fighter } from '../types/Fighter'
import type { SeedConfig } from './seedConfig'
import { SeededRandom } from './seedConfig'
import {
  type AgeGroup,
  type Discipline,
  type WeightClass,
  type Gender,
  getAgeGroupFromBirthDate,
  getWeightClassFromKg,
} from '../constants/enums'
import { createFighter } from './factories'
import { fightersRepo, bracketsRepo, clubsRepo, competitionsRepo } from './repositories'
// Legacy bracket generator removed - using bracketGeneratorV2 now
// import { generateSingleEliminationBracket, verifyBracketChain } from '../utils/bracketGenerator.legacy'

/**
 * Division key for grouping fighters
 */
export interface DivisionKey {
  ageGroup: AgeGroup
  discipline: Discipline
  weightClass: WeightClass
  gender: Gender
}

/**
 * Normalize division key to string for Map usage
 */
export const normalizeDivisionKey = (key: DivisionKey): string => {
  return `${key.ageGroup}|${key.discipline}|${key.weightClass}|${key.gender}`
}

/**
 * Parse division key from normalized string
 */
export const parseDivisionKey = (keyStr: string): DivisionKey => {
  const [ageGroup, discipline, weightClass, gender] = keyStr.split('|')
  return {
    ageGroup: ageGroup as AgeGroup,
    discipline: discipline as Discipline,
    weightClass: weightClass as WeightClass,
    gender: gender as Gender,
  }
}

/**
 * Group eligible fighters by division
 */
export const groupEligibleFightersByDivision = (
  fighters: Fighter[],
  allowedDivisions: SeedConfig['allowedDivisions']
): Map<string, number[]> => {
  const divisionMap = new Map<string, number[]>()

  for (const fighter of fighters) {
    const ageGroup = getAgeGroupFromBirthDate(fighter.birthDate)
    const weightClass = getWeightClassFromKg(fighter.weight, fighter.gender)

    // Check if this division is allowed
    if (
      !allowedDivisions.ageGroups.includes(ageGroup) ||
      !allowedDivisions.disciplines.includes(fighter.discipline) ||
      !allowedDivisions.weightClasses.includes(weightClass) ||
      !allowedDivisions.genders.includes(fighter.gender)
    ) {
      continue
    }

    const divisionKey: DivisionKey = {
      ageGroup,
      discipline: fighter.discipline,
      weightClass,
      gender: fighter.gender,
    }

    const key = normalizeDivisionKey(divisionKey)

    if (!divisionMap.has(key)) {
      divisionMap.set(key, [])
    }

    divisionMap.get(key)!.push(fighter.id)
  }

  return divisionMap
}

/**
 * Backfill fighters for a division to reach minimum count
 */
export const backfillFightersForDivision = (
  divisionKey: DivisionKey,
  neededCount: number,
  strategy: SeedConfig['backfillStrategy'],
  rng: SeededRandom
): number[] => {
  const backfilledIds: number[] = []
  const clubs = clubsRepo.getAll()

  if (clubs.length === 0) {
    console.warn('No clubs available for backfilling fighters')
    return backfilledIds
  }

  for (let i = 0; i < neededCount; i++) {
    let clubId: number

    switch (strategy) {
      case 'club-distributed':
        // Distribute evenly across clubs
        clubId = clubs[i % clubs.length].id
        break
      case 'balanced':
        // Pick clubs with fewer fighters
        const clubFighterCounts = clubs.map((club) => ({
          id: club.id,
          count: fightersRepo.getAll().filter((f) => f.clubId === club.id).length,
        }))
        clubFighterCounts.sort((a, b) => a.count - b.count)
        clubId = clubFighterCounts[0].id
        break
      case 'random':
      default:
        clubId = rng.pick(clubs).id
        break
    }

    const club = clubs.find((c) => c.id === clubId)!

    // Create fighter matching division requirements
    const newFighter = createFighter({
      clubId: club.id,
      club: club.name,
      gender: divisionKey.gender,
      discipline: divisionKey.discipline,
      ageGroup: divisionKey.ageGroup,
      weightClass: divisionKey.weightClass,
    })

    backfilledIds.push(newFighter.id)
  }

  return backfilledIds
}

/**
 * Choose optimal bracket size from preferred sizes
 */
const chooseBracketSize = (fighterCount: number, preferredSizes: number[]): number => {
  // Find smallest preferred size that can fit all fighters
  for (const size of preferredSizes.sort((a, b) => a - b)) {
    if (size >= fighterCount) {
      return size
    }
  }

  // If none fit, use next power of 2
  let size = 2
  while (size < fighterCount) {
    size *= 2
  }
  return size
}

/**
 * Synthesis result for a single competition
 */
export interface SynthesisResult {
  competitionId: number
  created: number
  attempted: number
  reasons: Record<string, string[]>
}

/**
 * Synthesize brackets for a competition
 */
export const synthesizeBracketsForCompetition = (
  competitionId: number,
  config: SeedConfig
): SynthesisResult => {
  const result: SynthesisResult = {
    competitionId,
    created: 0,
    attempted: 0,
    reasons: {},
  }

  // Fetch competition and its fighters
  const competition = competitionsRepo.getById(competitionId)
  if (!competition) {
    result.reasons['ERROR'] = ['Competition not found']
    return result
  }

  const competitionFighterIds = competition.fighters.map((cf) => cf.fighterId)
  const competitionFighters = fightersRepo.getByIds(competitionFighterIds)

  if (competitionFighters.length === 0) {
    result.reasons['NO_FIGHTERS'] = ['Competition has no registered fighters']
    return result
  }

  // Group fighters by division
  const divisionGroups = groupEligibleFightersByDivision(competitionFighters, config.allowedDivisions)

  if (divisionGroups.size === 0) {
    result.reasons['NO_ELIGIBLE_DIVISIONS'] = [
      'No fighters match allowed divisions',
      `Competition disciplines: ${competition.disciplines.join(', ')}`,
    ]
    return result
  }

  const rng = new SeededRandom(`${config.deterministicSeed}-${competitionId}`)

  // Process each division
  for (const [divisionKeyStr, fighterIds] of divisionGroups.entries()) {
    if (result.created >= config.maxBracketsPerCompetition) {
      result.reasons['MAX_BRACKETS_REACHED'] = [
        `Stopped at ${config.maxBracketsPerCompetition} brackets`,
      ]
      break
    }

    result.attempted++

    const divisionKey = parseDivisionKey(divisionKeyStr)
    let allFighterIds = [...fighterIds]

    // Backfill if needed
    if (allFighterIds.length < config.minFightersPerBracket) {
      if (config.autoBackfillFighters) {
        const needed = config.minFightersPerBracket - allFighterIds.length
        const backfilled = backfillFightersForDivision(
          divisionKey,
          needed,
          config.backfillStrategy,
          rng
        )

        if (backfilled.length > 0) {
          allFighterIds.push(...backfilled)

          // Add backfilled fighters to competition
          const updatedFighters = [
            ...competition.fighters,
            ...backfilled.map((id) => ({
              fighterId: id,
              discipline: divisionKey.discipline,
            })),
          ]
          competitionsRepo.update(competitionId, { fighters: updatedFighters })

          if (!result.reasons[divisionKeyStr]) {
            result.reasons[divisionKeyStr] = []
          }
          result.reasons[divisionKeyStr].push(
            `Backfilled ${backfilled.length} fighters (had ${fighterIds.length}, needed ${config.minFightersPerBracket})`
          )
        } else {
          result.reasons[divisionKeyStr] = [
            `Insufficient fighters: ${allFighterIds.length} < ${config.minFightersPerBracket}`,
            'Backfill failed',
          ]
          continue
        }
      } else {
        result.reasons[divisionKeyStr] = [
          `Insufficient fighters: ${allFighterIds.length} < ${config.minFightersPerBracket}`,
          'Auto-backfill disabled',
        ]
        continue
      }
    }

    // Choose bracket size
    const bracketSize = chooseBracketSize(allFighterIds.length, config.preferredBracketSizes)

    // Build fighter names map
    const fighterNames = new Map<number, string>()
    const allFighters = fightersRepo.getByIds(allFighterIds)
    allFighters.forEach((f) => {
      fighterNames.set(f.id, `${f.firstName} ${f.lastName}`)
    })

    // Generate matches
    try {
      const matches = generateSingleEliminationBracket({
        competitionId,
        bracketId: result.created + 1, // Temporary ID
        fighterIds: allFighterIds,
        fighterNames,
        seedMethod: 'random',
        randomSeed: rng.int(1, 1000000),
      })

      if (matches.length === 0) {
        result.reasons[divisionKeyStr] = ['Match generation returned empty array']
        continue
      }

      // Create bracket metadata
      const division: BracketDivision = {
        ageGroup: divisionKey.ageGroup,
        discipline: divisionKey.discipline,
        weightClass: divisionKey.weightClass,
        gender: divisionKey.gender,
      }

      const bracket = {
        division,
        fighterIds: allFighterIds,
        seedMethod: 'random' as const,
        status: 'published' as const,
      }

      // Validate bracket chain before persisting
      const validation = verifyBracketChain(matches)
      if (!validation.ok) {
        console.error(`Bracket validation failed for division ${divisionKeyStr}:`)
        validation.errors.forEach((err: string) => console.error(`  - ${err}`))
        throw new Error(`Bracket validation failed: ${validation.errors.join('; ')}`)
      }

      // Persist bracket and matches
      bracketsRepo.create(competitionId, bracket, matches)
      result.created++

      if (!result.reasons[divisionKeyStr]) {
        result.reasons[divisionKeyStr] = []
      }
      result.reasons[divisionKeyStr].push(
        `Created bracket: ${allFighterIds.length} fighters → ${bracketSize}-slot bracket with ${matches.length} matches`
      )
    } catch (error) {
      result.reasons[divisionKeyStr] = [
        `Bracket creation failed: ${error instanceof Error ? error.message : String(error)}`,
      ]
    }
  }

  return result
}

/**
 * Diagnose why a competition has no brackets
 */
export interface DiagnosisReason {
  category:
    | 'INSUFFICIENT_FIGHTERS'
    | 'INVALID_DIVISION_DATA'
    | 'PERSISTENCE_CONFLICT'
    | 'NO_ELIGIBLE_DIVISIONS'
    | 'UNKNOWN'
  details: string[]
}

export const diagnoseNoBracketReasons = (
  competitionId: number,
  config: SeedConfig
): DiagnosisReason[] => {
  const reasons: DiagnosisReason[] = []

  const competition = competitionsRepo.getById(competitionId)
  if (!competition) {
    reasons.push({
      category: 'UNKNOWN',
      details: ['Competition not found'],
    })
    return reasons
  }

  const competitionFighterIds = competition.fighters.map((cf) => cf.fighterId)
  const competitionFighters = fightersRepo.getByIds(competitionFighterIds)

  if (competitionFighters.length === 0) {
    reasons.push({
      category: 'INSUFFICIENT_FIGHTERS',
      details: ['Competition has 0 registered fighters'],
    })
    return reasons
  }

  // Check divisions
  const divisionGroups = groupEligibleFightersByDivision(competitionFighters, config.allowedDivisions)

  if (divisionGroups.size === 0) {
    reasons.push({
      category: 'NO_ELIGIBLE_DIVISIONS',
      details: [
        `No fighters match allowed divisions`,
        `Competition has ${competitionFighters.length} fighters but none in eligible divisions`,
      ],
    })
    return reasons
  }

  // Check each division
  for (const [divisionKeyStr, fighterIds] of divisionGroups.entries()) {
    if (fighterIds.length < config.minFightersPerBracket) {
      const divisionKey = parseDivisionKey(divisionKeyStr)
      reasons.push({
        category: 'INSUFFICIENT_FIGHTERS',
        details: [
          `Division ${divisionKeyStr}:`,
          `  Has ${fighterIds.length} fighters, needs ${config.minFightersPerBracket}`,
          `  Missing: ${config.minFightersPerBracket - fighterIds.length} fighters`,
          `  Age Group: ${divisionKey.ageGroup}`,
          `  Discipline: ${divisionKey.discipline}`,
          `  Weight Class: ${divisionKey.weightClass}`,
          `  Gender: ${divisionKey.gender}`,
        ],
      })
    }
  }

  // Check for existing brackets
  const existingBrackets = bracketsRepo.getAllForCompetition(competitionId)
  existingBrackets.forEach((bracket) => {
    const matches = bracketsRepo.getMatches(competitionId, bracket.id)
    if (matches.length === 0) {
      reasons.push({
        category: 'PERSISTENCE_CONFLICT',
        details: [
          `Bracket ${bracket.id} exists but has no matches`,
          `This may indicate a storage write failure`,
        ],
      })
    }
  })

  if (reasons.length === 0) {
    reasons.push({
      category: 'UNKNOWN',
      details: [
        'No obvious issues found',
        `Competition has ${competitionFighters.length} fighters in ${divisionGroups.size} divisions`,
        `Existing brackets: ${existingBrackets.length}`,
      ],
    })
  }

  return reasons
}
