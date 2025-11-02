/**
 * Data factories for generating realistic mock data.
 * Uses deterministic patterns for reproducible datasets.
 */

import type { Club } from '../types/Club'
import type { Fighter } from '../types/Fighter'
import type { Competition } from '../types/Competition'
import {
  Gender,
  AgeGroup,
  DISCIPLINE_VALUES,
  getAgeGroupFromBirthDate,
  type WeightClass,
} from '../constants/enums'
import { clubsRepo, fightersRepo, competitionsRepo } from './repositories'

// ============================================================================
// CLUB NAMES (Romanian-flavored)
// ============================================================================

const CLUB_NAMES = [
  'Dinamo Fight Club',
  'Steaua Combat Academy',
  'Rapid Fighters',
  'CFR Kickboxing',
  'Petrolul Martial Arts',
  'Universitatea Fighting',
  'Astra Combat Sports',
  'Oțelul Warriors',
  'Poli Timișoara Fighters',
  'Gaz Metan Dojo',
  'Pandurii Strike Team',
  'Concordia Fighting Academy',
  'Viitorul Champions',
  'Sepsi Combat Club',
  'Voluntari Fight Academy',
]

const CITIES = [
  'București',
  'Cluj-Napoca',
  'Timișoara',
  'Iași',
  'Constanța',
  'Craiova',
  'Brașov',
  'Galați',
  'Ploiești',
  'Oradea',
  'Brăila',
  'Arad',
  'Pitești',
  'Sibiu',
  'Bacău',
]

// ============================================================================
// FIGHTER NAMES (Romanian)
// ============================================================================

const FIRST_NAMES_MALE = [
  'Andrei',
  'Alexandru',
  'Mihai',
  'Ionuț',
  'Gabriel',
  'Ștefan',
  'Cristian',
  'Vlad',
  'Răzvan',
  'Adrian',
  'Marian',
  'Florin',
  'Constantin',
  'Dan',
  'Radu',
  'Nicolae',
  'Bogdan',
  'Vasile',
  'Cosmin',
  'George',
]

const FIRST_NAMES_FEMALE = [
  'Maria',
  'Elena',
  'Andreea',
  'Ioana',
  'Ana',
  'Alexandra',
  'Cristina',
  'Mihaela',
  'Gabriela',
  'Alina',
  'Diana',
  'Daniela',
  'Simona',
  'Raluca',
  'Laura',
  'Oana',
  'Adriana',
  'Monica',
  'Nicoleta',
  'Valentina',
]

const LAST_NAMES = [
  'Popescu',
  'Ionescu',
  'Popa',
  'Radu',
  'Dumitrescu',
  'Gheorghe',
  'Stan',
  'Munteanu',
  'Stoica',
  'Dobre',
  'Barbu',
  'Marin',
  'Enache',
  'Năstase',
  'Tudor',
  'Preda',
  'Matei',
  'Oprea',
  'Dinu',
  'Rusu',
  'Stanciu',
  'Anghel',
  'Manole',
  'Vasile',
  'Constantin',
]

const NICKNAMES = [
  'The Hammer',
  'Iron Fist',
  'Lightning',
  'Shadow',
  'The Beast',
  'Thunder',
  'Viper',
  'Cobra',
  'Tiger',
  'Dragon',
  'Phoenix',
  'Eagle',
  'Wolf',
  'Lion',
  'Warrior',
  'The Rock',
  'Tornado',
  'Tsunami',
  'Blitz',
  'Fury',
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Pick a random element from an array
 */
const randomPick = <T>(arr: T[]): T => {
  return arr[randomInt(0, arr.length - 1)]
}

/**
 * Generate a birth date for a given age group
 */
const generateBirthDate = (ageGroup: AgeGroup): string => {
  const today = new Date()
  let minAge: number
  let maxAge: number

  switch (ageGroup) {
    case AgeGroup.U12:
      minAge = 8
      maxAge = 11
      break
    case AgeGroup.U15:
      minAge = 12
      maxAge = 14
      break
    case AgeGroup.U18:
      minAge = 15
      maxAge = 17
      break
    case AgeGroup.U21:
      minAge = 18
      maxAge = 20
      break
    case AgeGroup.Adult:
      minAge = 21
      maxAge = 34
      break
    case AgeGroup.Senior:
      minAge = 35
      maxAge = 50
      break
  }

  const age = randomInt(minAge, maxAge)
  const birthYear = today.getFullYear() - age
  const birthMonth = randomInt(1, 12)
  const birthDay = randomInt(1, 28) // Avoid date validation issues

  return `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`
}

/**
 * Generate weight based on gender and age group
 */
const generateWeight = (gender: Gender, ageGroup: AgeGroup): number => {
  if (gender === Gender.Male) {
    switch (ageGroup) {
      case AgeGroup.U12:
        return randomInt(30, 50)
      case AgeGroup.U15:
        return randomInt(45, 65)
      case AgeGroup.U18:
        return randomInt(55, 85)
      case AgeGroup.U21:
        return randomInt(60, 100)
      case AgeGroup.Adult:
        return randomInt(60, 100)
      case AgeGroup.Senior:
        return randomInt(65, 95)
    }
  } else if (gender === Gender.Female) {
    switch (ageGroup) {
      case AgeGroup.U12:
        return randomInt(25, 45)
      case AgeGroup.U15:
        return randomInt(40, 60)
      case AgeGroup.U18:
        return randomInt(50, 70)
      case AgeGroup.U21:
        return randomInt(50, 75)
      case AgeGroup.Adult:
        return randomInt(50, 75)
      case AgeGroup.Senior:
        return randomInt(55, 75)
    }
  }
  // Open
  return randomInt(50, 90)
}

/**
 * Generate height based on weight (rough correlation)
 */
const generateHeight = (weight: number): number => {
  // Height in cm, roughly correlated with weight
  const baseHeight = 140 + weight * 0.6
  return Math.round(baseHeight + randomInt(-10, 10))
}

/**
 * Generate weight within a specific weight class range
 */
const generateWeightForClass = (weightClass: WeightClass, gender: Gender): number => {
  // Parse weight class to get range
  const match = weightClass.match(/([+-])(\d+)kg/)
  if (!match) {
    // Fallback to gender-based weight
    return gender === Gender.Male ? randomInt(60, 90) : randomInt(50, 70)
  }

  const [, sign, value] = match
  const limit = parseInt(value, 10)

  if (sign === '-') {
    // Under limit: generate weight 2-8kg below limit
    return randomInt(Math.max(30, limit - 8), limit - 1)
  } else {
    // Over limit: generate weight 0-15kg above limit
    return randomInt(limit, limit + 15)
  }
}

/**
 * Generate a realistic fight record based on age group
 */
const generateRecord = (ageGroup: AgeGroup): { wins: number; losses: number; draws: number } => {
  let totalFights: number

  switch (ageGroup) {
    case AgeGroup.U12:
      totalFights = randomInt(0, 8)
      break
    case AgeGroup.U15:
      totalFights = randomInt(3, 15)
      break
    case AgeGroup.U18:
      totalFights = randomInt(5, 25)
      break
    case AgeGroup.U21:
      totalFights = randomInt(8, 35)
      break
    case AgeGroup.Adult:
      totalFights = randomInt(10, 50)
      break
    case AgeGroup.Senior:
      totalFights = randomInt(15, 60)
      break
  }

  if (totalFights === 0) {
    return { wins: 0, losses: 0, draws: 0 }
  }

  // Generate realistic win/loss ratio (most fighters have 40-60% win rate)
  const winRate = Math.random() * 0.4 + 0.3 // 30-70%
  const drawRate = Math.random() * 0.1 // 0-10%

  const wins = Math.round(totalFights * winRate)
  const draws = Math.round(totalFights * drawRate)
  const losses = totalFights - wins - draws

  return { wins, losses, draws }
}

/**
 * Generate a date in the past or future relative to today
 */
const generateDate = (daysOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a club
 */
export const createClub = (overrides?: Partial<Omit<Club, 'id'>>): Club => {
  const name = overrides?.name ?? randomPick(CLUB_NAMES)
  const city = overrides?.city ?? randomPick(CITIES)

  const disciplines = overrides?.disciplines ?? [
    randomPick(DISCIPLINE_VALUES),
    randomPick(DISCIPLINE_VALUES),
  ]

  return clubsRepo.create({
    name,
    city,
    address: overrides?.address ?? `${randomInt(1, 150)} Rue de la Victoire, ${city}`,
    description: overrides?.description ?? `Premier club de sports de combat à ${city}. Formation de qualité pour tous les niveaux.`,
    disciplines,
    logoUrl: overrides?.logoUrl ?? '',
  })
}

/**
 * Create a fighter
 */
export const createFighter = (overrides?: Partial<Omit<Fighter, 'id'>> & { ageGroup?: AgeGroup; weightClass?: WeightClass }): Fighter => {
  const gender = overrides?.gender ?? randomPick([Gender.Male, Gender.Female])
  
  // Determine age group - either from override or random
  const targetAgeGroup = overrides?.ageGroup ?? randomPick([
    AgeGroup.U12,
    AgeGroup.U15,
    AgeGroup.U18,
    AgeGroup.U21,
    AgeGroup.Adult,
    AgeGroup.Senior,
  ])
  
  const birthDate = overrides?.birthDate ?? generateBirthDate(targetAgeGroup)
  
  // Determine weight - either from override or based on age group/gender
  let weight: number
  if (overrides?.weight !== undefined) {
    weight = overrides.weight
  } else if (overrides?.weightClass !== undefined) {
    // Generate weight within the specified weight class range
    weight = generateWeightForClass(overrides.weightClass, gender)
  } else {
    weight = generateWeight(gender, targetAgeGroup)
  }
  
  const height = overrides?.height ?? generateHeight(weight)
  const discipline = overrides?.discipline ?? randomPick(DISCIPLINE_VALUES)

  const firstName =
    overrides?.firstName ??
    (gender === Gender.Male ? randomPick(FIRST_NAMES_MALE) : randomPick(FIRST_NAMES_FEMALE))
  const lastName = overrides?.lastName ?? randomPick(LAST_NAMES)
  const nickname = overrides?.nickname ?? randomPick(NICKNAMES)

  // Get club - either from overrides or pick a random existing club
  let clubId = overrides?.clubId ?? null
  let clubName = overrides?.club ?? 'No Club'

  if (clubId === null && overrides?.club === undefined) {
    const clubs = clubsRepo.getAll()
    if (clubs.length > 0) {
      const club = randomPick(clubs)
      clubId = club.id
      clubName = club.name
    }
  } else if (clubId !== null && overrides?.club === undefined) {
    const club = clubsRepo.getById(clubId)
    if (club) {
      clubName = club.name
    }
  }

  const record = generateRecord(getAgeGroupFromBirthDate(birthDate))

  return fightersRepo.create({
    firstName,
    lastName,
    nickname,
    club: clubName,
    clubId,
    birthDate,
    height,
    weight,
    discipline,
    gender,
    record,
    imageUrl: overrides?.imageUrl,
  })
}

/**
 * Create a competition
 */
export const createCompetition = (overrides?: Partial<Omit<Competition, 'id'>>): Competition => {
  const startDaysOffset = overrides?.startDate ? 0 : randomInt(-90, 180) // Past 3 months to future 6 months
  const startDate = overrides?.startDate ?? generateDate(startDaysOffset)
  const endDate = overrides?.endDate ?? generateDate(startDaysOffset + randomInt(1, 3))
  const registrationDate = overrides?.registrationDate ?? generateDate(startDaysOffset - randomInt(14, 60))

  const city = overrides?.location ?? randomPick(CITIES)
  const title = overrides?.title ?? `Golden Championship ${city} ${new Date().getFullYear()}`

  const disciplines = overrides?.disciplines ?? [
    randomPick(DISCIPLINE_VALUES),
    randomPick(DISCIPLINE_VALUES),
  ]

  return competitionsRepo.create({
    title,
    address: overrides?.address ?? `Palais des Sports, ${city}`,
    startDate,
    endDate,
    registrationDate,
    location: city,
    googleMapsUrl:
      overrides?.googleMapsUrl ?? `https://maps.google.com/?q=Palais+des+Sports+${city.replace(/\s+/g, '+')}`,
    contactName: overrides?.contactName ?? 'Jean Dupont',
    contactEmail: overrides?.contactEmail ?? 'contact@goldenchampionship.fr',
    contactPhone: overrides?.contactPhone ?? `0${randomInt(1, 7)} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
    description:
      overrides?.description ??
      `Compétition de ${disciplines.join(' et ')} ouverte à tous les âges et niveaux. Inscription obligatoire avant le ${registrationDate}.`,
    disciplines,
    fighters: overrides?.fighters ?? [],
  })
}
