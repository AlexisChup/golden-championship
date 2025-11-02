import type { Discipline, CompetitionStatus } from '../constants/enums'
import { getCompetitionStatusFromDates } from '../constants/enums'

export interface CompetitionFighter {
  fighterId: number
  discipline: Discipline
}

export interface Competition {
  id: number
  title: string
  address: string
  startDate: string // ISO format
  endDate: string // ISO format
  registrationDate: string // ISO format - deadline
  location: string // readable location (city/venue)
  googleMapsUrl: string
  contactName: string
  contactEmail: string
  contactPhone: string
  description: string
  disciplines: Discipline[]
  fighters: CompetitionFighter[]
}

// Helper to get competition status based on dates (using centralized enum helper)
export const getCompetitionStatus = (
  startDate: string,
  endDate: string
): CompetitionStatus => {
  return getCompetitionStatusFromDates(startDate, endDate)
}

// Helper to check if registration is still open
export const isRegistrationOpen = (registrationDate: string): boolean => {
  const now = new Date()
  const deadline = new Date(registrationDate)
  return now <= deadline
}
