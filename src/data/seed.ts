/**
 * Seed orchestrator for generating coherent mock datasets.
 * Creates a realistic graph of clubs, fighters, competitions, and brackets.
 */

import type { CompetitionFighter } from '../types/Competition'
import {
  Gender,
  Discipline,
  DISCIPLINE_VALUES,
} from '../constants/enums'
import { createClub, createFighter, createCompetition } from './factories'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from './repositories'
import { validateGraph } from './validation'
import {
  type SeedConfig as BracketSeedConfig,
  DEFAULT_SEED_CONFIG,
  SeededRandom,
} from './seedConfig'
import {
  synthesizeBracketsForCompetition,
  diagnoseNoBracketReasons,
} from './bracketSynthesis'

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
 * Generate a complete, coherent dataset with strong bracket generation
 */
export const seedAll = (config: Partial<SeedConfig> = {}): void => {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const bracketCfg: BracketSeedConfig = {
    ...DEFAULT_SEED_CONFIG,
    minCompetitions: cfg.competitions.min,
  }

  console.log('🌱 Starting seed generation with bracket synthesis...')

  // Clear existing data
  clearAllData()

  const rng = new SeededRandom(bracketCfg.deterministicSeed)

  // 1. Generate clubs
  const numClubs = rng.int(cfg.clubs.min, cfg.clubs.max)
  console.log(`📍 Creating ${numClubs} clubs...`)
  const clubs = Array.from({ length: numClubs }, () => createClub())

  // 2. Generate fighters
  const numFighters = rng.int(cfg.fighters.min, cfg.fighters.max)
  console.log(`🥊 Creating ${numFighters} fighters...`)

  // Distribute fighters across age groups and genders
  const genders = [Gender.Male, Gender.Female]

  const fighters = Array.from({ length: numFighters }, () => {
    const club = rng.pick(clubs)
    const gender = rng.pick(genders)
    const discipline = rng.pick(club.disciplines)

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
  const numCompetitions = rng.int(cfg.competitions.min, cfg.competitions.max)
  console.log(`🏆 Creating ${numCompetitions} competitions...`)

  const competitions = Array.from({ length: numCompetitions }, (_, idx) => {
    // Distribute competitions across time (past, ongoing, upcoming)
    let startDaysOffset: number
    if (idx % 3 === 0) {
      startDaysOffset = rng.int(-90, -7) // Past
    } else if (idx % 3 === 1) {
      startDaysOffset = rng.int(-3, 3) // Ongoing
    } else {
      startDaysOffset = rng.int(7, 180) // Upcoming
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + startDaysOffset)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + rng.int(1, 3))
    const registrationDate = new Date(startDate)
    registrationDate.setDate(registrationDate.getDate() - rng.int(14, 60))

    // Pick 2-4 disciplines for this competition
    const numDisciplines = rng.int(2, 4)
    const disciplines: Discipline[] = []
    while (disciplines.length < numDisciplines) {
      const d = rng.pick(DISCIPLINE_VALUES)
      if (!disciplines.includes(d)) {
        disciplines.push(d)
      }
    }

    // Assign 20-40 fighters to this competition (matching disciplines)
    const eligibleFighters = fighters.filter((f) => disciplines.includes(f.discipline))
    const numParticipants = Math.min(rng.int(20, 40), eligibleFighters.length)
    const selectedFighters = rng.shuffle(eligibleFighters).slice(0, numParticipants)

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

  // 4. Synthesize brackets for each competition
  if (cfg.generateBrackets) {
    console.log('🌳 Synthesizing brackets with automatic backfilling...')
    
    let totalBracketsCreated = 0
    let totalBracketsAttempted = 0
    let competitionsWithBrackets = 0

    competitions.forEach((comp) => {
      const result = synthesizeBracketsForCompetition(comp.id, bracketCfg)
      
      totalBracketsCreated += result.created
      totalBracketsAttempted += result.attempted
      
      if (result.created > 0) {
        competitionsWithBrackets++
      }

      // Log details
      if (result.created > 0) {
        console.log(`  ├─ Competition ${comp.id}: Created ${result.created}/${result.attempted} brackets`)
      } else {
        console.log(`  ├─ Competition ${comp.id}: No brackets created`)
        // Diagnose issues
        const diagnosis = diagnoseNoBracketReasons(comp.id, bracketCfg)
        diagnosis.forEach((d) => {
          console.log(`      └─ ${d.category}:`, d.details.join('; '))
        })
      }
    })

    const ratio = competitions.length > 0 ? competitionsWithBrackets / competitions.length : 0

    console.log(`  ├─ Total brackets: ${totalBracketsCreated} (attempted ${totalBracketsAttempted})`)
    console.log(`  ├─ Competitions with brackets: ${competitionsWithBrackets}/${competitions.length} (${(ratio * 100).toFixed(0)}%)`)

    // If ratio is below target, try backfilling more competitions
    if (ratio < bracketCfg.targetCompetitionsWithBracketsRatio && competitions.length > 0) {
      console.log(`⚠️  Bracket ratio ${(ratio * 100).toFixed(0)}% is below target ${(bracketCfg.targetCompetitionsWithBracketsRatio * 100).toFixed(0)}%`)
      console.log('   Consider increasing fighter count or reducing minFightersPerBracket in config')
    }
  }

  // 5. Validate graph integrity
  console.log('🔍 Validating data graph...')
  const validation = validateGraph()
  if (!validation.valid) {
    console.error('❌ Graph validation failed:')
    validation.errors.forEach((err) => console.error(`   - ${err}`))
    throw new Error('Seed generation failed: Graph validation errors detected')
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
    fighters: { min: 40, max: 60 },
    competitions: { min: 3, max: 5 },
    generateBrackets: true,
  })
}

/**
 * Full seed for demo/testing (large dataset)
 */
export const seedDemo = (): void => {
  seedAll({
    clubs: { min: 12, max: 15 },
    fighters: { min: 120, max: 150 },
    competitions: { min: 6, max: 10 },
    generateBrackets: true,
  })
}
