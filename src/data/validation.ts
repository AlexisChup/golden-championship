/**
 * Data validation layer for referential integrity checks.
 * Validates entity relationships before writes to prevent orphaned references.
 */

import type { Fighter } from '../types/Fighter'
import type { Competition } from '../types/Competition'
import type { Bracket } from '../types/Bracket'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from './repositories'

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate a fighter's references
 */
export const validateFighter = (fighter: Omit<Fighter, 'id'> | Fighter): ValidationResult => {
  const errors: string[] = []

  // Check club reference
  if (fighter.clubId !== null) {
    const club = clubsRepo.getById(fighter.clubId)
    if (!club) {
      errors.push(`Club with ID ${fighter.clubId} does not exist`)
    }
  }

  // Check discipline is valid
  if (!fighter.discipline) {
    errors.push('Discipline is required')
  }

  // Check gender is valid
  if (!fighter.gender) {
    errors.push('Gender is required')
  }

  // Check birth date is valid
  if (!fighter.birthDate || isNaN(Date.parse(fighter.birthDate))) {
    errors.push('Valid birth date is required')
  }

  // Check weight and height are positive
  if (fighter.weight <= 0) {
    errors.push('Weight must be greater than 0')
  }
  if (fighter.height <= 0) {
    errors.push('Height must be greater than 0')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate a competition's references
 */
export const validateCompetition = (
  competition: Omit<Competition, 'id'> | Competition
): ValidationResult => {
  const errors: string[] = []

  // Check dates are valid
  if (!competition.startDate || isNaN(Date.parse(competition.startDate))) {
    errors.push('Valid start date is required')
  }
  if (!competition.endDate || isNaN(Date.parse(competition.endDate))) {
    errors.push('Valid end date is required')
  }
  if (!competition.registrationDate || isNaN(Date.parse(competition.registrationDate))) {
    errors.push('Valid registration date is required')
  }

  // Check date order
  if (competition.startDate && competition.endDate) {
    const start = new Date(competition.startDate)
    const end = new Date(competition.endDate)
    if (start > end) {
      errors.push('Start date must be before or equal to end date')
    }
  }

  if (competition.registrationDate && competition.startDate) {
    const reg = new Date(competition.registrationDate)
    const start = new Date(competition.startDate)
    if (reg >= start) {
      errors.push('Registration date must be before start date')
    }
  }

  // Check fighter references
  const allFighters = fightersRepo.getAll()
  const fighterIds = new Set(allFighters.map((f) => f.id))

  competition.fighters.forEach((cf) => {
    if (!fighterIds.has(cf.fighterId)) {
      errors.push(`Fighter with ID ${cf.fighterId} does not exist`)
    }
  })

  // Check disciplines are valid
  if (!competition.disciplines || competition.disciplines.length === 0) {
    errors.push('At least one discipline is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate a bracket's references
 */
export const validateBracket = (
  competitionId: number,
  bracket: Omit<Bracket, 'id' | 'competitionId' | 'createdAt' | 'updatedAt'> | Bracket
): ValidationResult => {
  const errors: string[] = []

  // Check competition exists
  const competition = competitionsRepo.getById(competitionId)
  if (!competition) {
    errors.push(`Competition with ID ${competitionId} does not exist`)
  }

  // Check fighter references
  const allFighters = fightersRepo.getAll()
  const fighterIds = new Set(allFighters.map((f) => f.id))

  bracket.fighterIds.forEach((fighterId) => {
    if (!fighterIds.has(fighterId)) {
      errors.push(`Fighter with ID ${fighterId} does not exist`)
    }
  })

  // Check minimum fighters
  if (bracket.fighterIds.length < 2) {
    errors.push('Bracket must have at least 2 fighters')
  }

  // Check division fields are present
  if (!bracket.division.ageGroup) {
    errors.push('Division age group is required')
  }
  if (!bracket.division.discipline) {
    errors.push('Division discipline is required')
  }
  if (!bracket.division.weightClass) {
    errors.push('Division weight class is required')
  }
  if (!bracket.division.gender) {
    errors.push('Division gender is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate the entire data graph for referential integrity
 */
export const validateGraph = (): ValidationResult => {
  const errors: string[] = []

  console.log('🔍 Validating data graph...')

  // 1. Validate all fighters
  const fighters = fightersRepo.getAll()
  fighters.forEach((fighter) => {
    const result = validateFighter(fighter)
    if (!result.valid) {
      errors.push(`Fighter ${fighter.id} (${fighter.firstName} ${fighter.lastName}):`)
      errors.push(...result.errors.map((e) => `  - ${e}`))
    }
  })

  // 2. Validate all competitions
  const competitions = competitionsRepo.getAll()
  competitions.forEach((competition) => {
    const result = validateCompetition(competition)
    if (!result.valid) {
      errors.push(`Competition ${competition.id} (${competition.title}):`)
      errors.push(...result.errors.map((e) => `  - ${e}`))
    }
  })

  // 3. Validate all brackets
  competitions.forEach((competition) => {
    const brackets = bracketsRepo.getAllForCompetition(competition.id)
    brackets.forEach((bracket) => {
      const result = validateBracket(competition.id, bracket)
      if (!result.valid) {
        errors.push(`Bracket ${bracket.id} in Competition ${competition.id}:`)
        errors.push(...result.errors.map((e) => `  - ${e}`))
      }
    })
  })

  if (errors.length === 0) {
    console.log('✅ Graph validation passed - no integrity issues found')
  } else {
    console.error(`❌ Graph validation failed with ${errors.length} errors:`)
    errors.forEach((err) => console.error(err))
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check for orphaned fighters (fighters with clubId pointing to non-existent club)
 */
export const findOrphanedFighters = (): Fighter[] => {
  const fighters = fightersRepo.getAll()
  const clubs = clubsRepo.getAll()
  const clubIds = new Set(clubs.map((c) => c.id))

  return fighters.filter((f) => f.clubId !== null && !clubIds.has(f.clubId))
}

/**
 * Check for orphaned competition fighters (competitions referencing non-existent fighters)
 */
export const findOrphanedCompetitionFighters = (): Array<{
  competitionId: number
  competitionTitle: string
  missingFighterIds: number[]
}> => {
  const competitions = competitionsRepo.getAll()
  const fighters = fightersRepo.getAll()
  const fighterIds = new Set(fighters.map((f) => f.id))

  const results: Array<{
    competitionId: number
    competitionTitle: string
    missingFighterIds: number[]
  }> = []

  competitions.forEach((comp) => {
    const missingFighterIds = comp.fighters
      .map((cf) => cf.fighterId)
      .filter((id) => !fighterIds.has(id))

    if (missingFighterIds.length > 0) {
      results.push({
        competitionId: comp.id,
        competitionTitle: comp.title,
        missingFighterIds,
      })
    }
  })

  return results
}

/**
 * Auto-fix orphaned fighters by setting clubId to null
 */
export const fixOrphanedFighters = (): number => {
  const orphaned = findOrphanedFighters()
  orphaned.forEach((fighter) => {
    fightersRepo.update(fighter.id, { clubId: null, club: 'No Club' })
  })
  console.log(`✓ Fixed ${orphaned.length} orphaned fighters`)
  return orphaned.length
}

/**
 * Auto-fix orphaned competition fighters by removing invalid references
 */
export const fixOrphanedCompetitionFighters = (): number => {
  const orphaned = findOrphanedCompetitionFighters()
  const fighters = fightersRepo.getAll()
  const fighterIds = new Set(fighters.map((f) => f.id))

  orphaned.forEach(({ competitionId }) => {
    const competition = competitionsRepo.getById(competitionId)
    if (competition) {
      const validFighters = competition.fighters.filter((cf) => fighterIds.has(cf.fighterId))
      competitionsRepo.update(competitionId, { fighters: validFighters })
    }
  })

  const totalFixed = orphaned.reduce((sum, o) => sum + o.missingFighterIds.length, 0)
  console.log(`✓ Fixed ${totalFixed} orphaned competition fighter references`)
  return totalFixed
}
