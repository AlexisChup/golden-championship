/**
 * Seed orchestrator for generating coherent mock datasets.
 * Creates a realistic graph of clubs, fighters, competitions, and brackets.
 */

import type { CompetitionFighter } from '../types/Competition'
import {
  Gender,
  AgeGroup,
  Discipline,
  DISCIPLINE_VALUES,
  getAgeGroupFromBirthDate,
  getWeightClassFromKg,
} from '../constants/enums'
import { createClub, createFighter, createCompetition } from './factories'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from './repositories'
import { generateSingleEliminationBracket } from '../utils/bracketGenerator'
import type { BracketDivision } from '../types/Bracket'

/**
 * Configuration for seed generation
 */
interface SeedConfig {
  clubs: {
    min: number
    max: number
  }
  fighters: {
    min: number
    max: number
  }
  competitions: {
    min: number
    max: number
  }
  generateBrackets: boolean
}

const DEFAULT_CONFIG: SeedConfig = {
  clubs: { min: 8, max: 15 },
  fighters: { min: 60, max: 120 },
  competitions: { min: 4, max: 8 },
  generateBrackets: true,
}

/**
 * Random utility
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomPick = <T>(arr: T[]): T => {
  return arr[randomInt(0, arr.length - 1)]
}

/**
 * Clear all data from localStorage
 */
export const clearAllData = (): void => {
  const clubs = clubsRepo.getAll()
  const fighters = fightersRepo.getAll()
  const competitions = competitionsRepo.getAll()

  // Delete all clubs
  clubs.forEach((club) => clubsRepo.delete(club.id))

  // Delete all fighters
  fighters.forEach((fighter) => fightersRepo.delete(fighter.id))

  // Delete all competitions and their brackets
  competitions.forEach((comp) => {
    const brackets = bracketsRepo.getAllForCompetition(comp.id)
    brackets.forEach((bracket) => bracketsRepo.delete(comp.id, bracket.id))
    competitionsRepo.delete(comp.id)
  })

  console.log('✓ All data cleared')
}

/**
 * Generate a complete, coherent dataset
 */
export const seedAll = (config: Partial<SeedConfig> = {}): void => {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  console.log('🌱 Starting seed generation...')

  // Clear existing data
  clearAllData()

  // 1. Generate clubs
  const numClubs = randomInt(cfg.clubs.min, cfg.clubs.max)
  console.log(`📍 Creating ${numClubs} clubs...`)
  const clubs = Array.from({ length: numClubs }, () => createClub())

  // 2. Generate fighters
  const numFighters = randomInt(cfg.fighters.min, cfg.fighters.max)
  console.log(`🥊 Creating ${numFighters} fighters...`)

  // Distribute fighters across age groups and genders
  const genders = [Gender.Male, Gender.Female]

  const fighters = Array.from({ length: numFighters }, () => {
    const club = randomPick(clubs)
    const gender = randomPick(genders)
    const discipline = randomPick(club.disciplines)

    return createFighter({
      clubId: club.id,
      club: club.name,
      gender,
      discipline,
    })
  })

  console.log(
    `  ├─ ${fighters.filter((f) => f.gender === Gender.Male).length} men, ${fighters.filter((f) => f.gender === Gender.Female).length} women`
  )

  // 3. Generate competitions
  const numCompetitions = randomInt(cfg.competitions.min, cfg.competitions.max)
  console.log(`🏆 Creating ${numCompetitions} competitions...`)

  const competitions = Array.from({ length: numCompetitions }, (_, idx) => {
    // Distribute competitions across time (past, ongoing, upcoming)
    let startDaysOffset: number
    if (idx % 3 === 0) {
      startDaysOffset = randomInt(-90, -7) // Past
    } else if (idx % 3 === 1) {
      startDaysOffset = randomInt(-3, 3) // Ongoing
    } else {
      startDaysOffset = randomInt(7, 180) // Upcoming
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + startDaysOffset)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + randomInt(1, 3))
    const registrationDate = new Date(startDate)
    registrationDate.setDate(registrationDate.getDate() - randomInt(14, 60))

    // Pick 2-4 disciplines for this competition
    const numDisciplines = randomInt(2, 4)
    const disciplines: Discipline[] = []
    while (disciplines.length < numDisciplines) {
      const d = randomPick(DISCIPLINE_VALUES)
      if (!disciplines.includes(d)) {
        disciplines.push(d)
      }
    }

    // Assign 10-30 fighters to this competition (matching disciplines)
    const eligibleFighters = fighters.filter((f) => disciplines.includes(f.discipline))
    const numParticipants = Math.min(randomInt(10, 30), eligibleFighters.length)
    const selectedFighters = eligibleFighters
      .sort(() => Math.random() - 0.5)
      .slice(0, numParticipants)

    const competitionFighters: CompetitionFighter[] = selectedFighters.map((f) => ({
      fighterId: f.id,
      discipline: f.discipline,
    }))

    return createCompetition({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      registrationDate: registrationDate.toISOString().split('T')[0],
      disciplines,
      fighters: competitionFighters,
    })
  })

  // 4. Generate brackets for each competition
  if (cfg.generateBrackets) {
    console.log('🌳 Generating brackets...')
    let totalBrackets = 0

    competitions.forEach((comp) => {
      const compFighters = fightersRepo.getByIds(comp.fighters.map((cf) => cf.fighterId))

      // Group fighters by division
      const divisionMap = new Map<string, number[]>()

      compFighters.forEach((fighter) => {
        const ageGroup = getAgeGroupFromBirthDate(fighter.birthDate)
        const weightClass = getWeightClassFromKg(fighter.weight, fighter.gender)

        const divisionKey = `${ageGroup}_${fighter.discipline}_${weightClass}_${fighter.gender}`

        if (!divisionMap.has(divisionKey)) {
          divisionMap.set(divisionKey, [])
        }
        divisionMap.get(divisionKey)!.push(fighter.id)
      })

      // Create brackets for divisions with 4+ fighters
      divisionMap.forEach((fighterIds, divisionKey) => {
        if (fighterIds.length < 4) return // Skip divisions with too few fighters

        const [ageGroup, discipline, weightClass, gender] = divisionKey.split('_')

        const division: BracketDivision = {
          ageGroup: ageGroup as AgeGroup,
          discipline: discipline as Discipline,
          weightClass: weightClass as any,
          gender: gender as Gender,
        }

        // Build fighter names map
        const fighterNames = new Map<number, string>()
        fighterIds.forEach((id) => {
          const fighter = compFighters.find((f) => f.id === id)
          if (fighter) {
            fighterNames.set(id, `${fighter.firstName} ${fighter.lastName}`)
          }
        })

        // Generate bracket with random seeding
        const matches = generateSingleEliminationBracket({
          competitionId: comp.id,
          bracketId: totalBrackets + 1, // Temporary ID (will be replaced)
          fighterIds,
          fighterNames,
          seedMethod: 'random',
        })

        if (matches.length > 0) {
          // Create bracket metadata and store
          const bracket = {
            division,
            fighterIds,
            seedMethod: 'random' as const,
            status: 'published' as const,
          }

          bracketsRepo.create(comp.id, bracket, matches)
          totalBrackets++
        }
      })
    })

    console.log(`  ├─ Generated ${totalBrackets} brackets`)
  }

  console.log('✅ Seed generation complete!')
  console.log(`Summary:`)
  console.log(`  ├─ ${clubs.length} clubs`)
  console.log(`  ├─ ${fighters.length} fighters`)
  console.log(`  ├─ ${competitions.length} competitions`)
  if (cfg.generateBrackets) {
    const totalBrackets = competitions.reduce(
      (sum, comp) => sum + bracketsRepo.getAllForCompetition(comp.id).length,
      0
    )
    console.log(`  └─ ${totalBrackets} brackets`)
  }
}

/**
 * Quick seed for development (small dataset)
 */
export const seedDev = (): void => {
  seedAll({
    clubs: { min: 5, max: 8 },
    fighters: { min: 30, max: 50 },
    competitions: { min: 2, max: 4 },
    generateBrackets: true,
  })
}

/**
 * Full seed for demo/testing (large dataset)
 */
export const seedDemo = (): void => {
  seedAll({
    clubs: { min: 12, max: 15 },
    fighters: { min: 100, max: 120 },
    competitions: { min: 6, max: 8 },
    generateBrackets: true,
  })
}
