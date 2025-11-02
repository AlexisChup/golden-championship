import type { Discipline, Gender } from '../constants/enums'

export type WeightCategory = 'Lightweight' | 'Middleweight' | 'Heavyweight'

export interface FighterRecord {
  wins: number
  losses: number
  draws: number
}

export interface Fighter {
  id: number
  firstName: string
  lastName: string
  nickname: string
  club: string // Keep for display purposes
  clubId: number | null // Primary relation to club
  birthDate: string // ISO format: YYYY-MM-DD
  height: number // in cm
  weight: number // in kg
  discipline: Discipline
  gender: Gender // Added for bracket filtering
  record: FighterRecord
  imageUrl?: string // optional profile image
}

export interface FighterFormData {
  firstName: string
  lastName: string
  nickname: string
  club: string
  birthDate: string
  height: number
  weight: number
  discipline: Discipline
  recordWins: number
  recordLosses: number
  recordDraws: number
}

// Helper functions
export const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export const getWeightCategory = (weight: number): WeightCategory => {
  if (weight < 60) return 'Lightweight'
  if (weight <= 70) return 'Middleweight'
  return 'Heavyweight'
}

export const formatRecord = (record: FighterRecord): string => {
  return `${record.wins}-${record.losses}-${record.draws}`
}

export const getRecordColor = (record: FighterRecord): 'green' | 'red' | 'gray' => {
  if (record.wins > record.losses) return 'green'
  if (record.losses > record.wins) return 'red'
  return 'gray'
}
