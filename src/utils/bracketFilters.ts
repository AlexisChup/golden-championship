import type { Fighter } from '../types/Fighter'
import type { BracketDivision } from '../types/Bracket'
import type { Discipline } from '../types/common'
import { calculateAge } from '../types/Fighter'

/**
 * Get age group from fighter's birth date
 */
export const getAgeGroup = (birthDate: string): string => {
  const age = calculateAge(birthDate)
  
  if (age < 12) return 'U12'
  if (age < 15) return 'U15'
  if (age < 18) return 'U18'
  if (age < 21) return 'U21'
  return 'Adult'
}

/**
 * Get weight class from fighter's weight (kg)
 * These are example categories - adjust per your competition rules
 */
export const getWeightClass = (weight: number, gender: 'M' | 'F' | 'Open'): string => {
  if (gender === 'M') {
    if (weight < 60) return '-60kg'
    if (weight < 65) return '-65kg'
    if (weight < 70) return '-70kg'
    if (weight < 75) return '-75kg'
    if (weight < 81) return '-81kg'
    if (weight < 86) return '-86kg'
    if (weight < 91) return '-91kg'
    return '+91kg'
  } else if (gender === 'F') {
    if (weight < 50) return '-50kg'
    if (weight < 55) return '-55kg'
    if (weight < 60) return '-60kg'
    if (weight < 65) return '-65kg'
    if (weight < 70) return '-70kg'
    return '+70kg'
  }
  
  // Open category - gender-neutral
  if (weight < 60) return '-60kg'
  if (weight < 70) return '-70kg'
  if (weight < 80) return '-80kg'
  return '+80kg'
}

/**
 * Get fighter's gender classification
 * Note: Current Fighter type doesn't have gender field, defaulting to 'Open'
 * TODO: Extend Fighter type with gender field for proper filtering
 */
export const getFighterGender = (_fighter: Fighter): 'M' | 'F' | 'Open' => {
  // Since Fighter type doesn't have a gender field, we'd need to infer or extend the type
  // For now, return 'Open' - this should be extended in the Fighter type
  return 'Open'
}

/**
 * Filter fighters by division criteria
 */
export const filterFightersByDivision = (
  fighters: Fighter[],
  division: Partial<BracketDivision>
): Fighter[] => {
  return fighters.filter((fighter) => {
    // Filter by discipline
    if (division.discipline && fighter.discipline !== division.discipline) {
      return false
    }
    
    // Filter by age group
    if (division.ageGroup) {
      const fighterAgeGroup = getAgeGroup(fighter.birthDate)
      if (fighterAgeGroup !== division.ageGroup) {
        return false
      }
    }
    
    // Filter by weight class
    if (division.weightClass && division.gender) {
      const fighterWeightClass = getWeightClass(fighter.weight, division.gender)
      if (fighterWeightClass !== division.weightClass) {
        return false
      }
    }
    
    // Gender filter (if needed - currently using 'Open' for all)
    // In a real implementation, you'd check fighter.gender === division.gender
    
    return true
  })
}

/**
 * Get unique age groups from fighters
 */
export const getUniqueAgeGroups = (fighters: Fighter[]): string[] => {
  const ageGroups = fighters.map((f) => getAgeGroup(f.birthDate))
  return Array.from(new Set(ageGroups)).sort()
}

/**
 * Get unique disciplines from fighters
 */
export const getUniqueDisciplines = (fighters: Fighter[]): Discipline[] => {
  const disciplines = fighters.map((f) => f.discipline)
  return Array.from(new Set(disciplines)).sort()
}

/**
 * Get unique weight classes for a given gender
 */
export const getUniqueWeightClasses = (
  fighters: Fighter[],
  gender: 'M' | 'F' | 'Open'
): string[] => {
  const weightClasses = fighters.map((f) => getWeightClass(f.weight, gender))
  return Array.from(new Set(weightClasses)).sort()
}

/**
 * Get all possible gender options
 */
export const getGenderOptions = (): Array<'M' | 'F' | 'Open'> => {
  return ['M', 'F', 'Open']
}

/**
 * Check if two divisions are identical (for duplicate detection)
 */
export const isDivisionDuplicate = (
  div1: BracketDivision,
  div2: BracketDivision
): boolean => {
  return (
    div1.ageGroup === div2.ageGroup &&
    div1.discipline === div2.discipline &&
    div1.weightClass === div2.weightClass &&
    div1.gender === div2.gender
  )
}
