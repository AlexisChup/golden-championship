import type { Discipline } from './common'

export interface Club {
  id: number
  name: string
  address: string
  city: string
  description: string
  disciplines: Discipline[]
  logoUrl: string
  // fighters array removed - use fighter.clubId instead
}

export interface ClubFormData extends Omit<Club, 'id'> {
  // Form data for creating/updating clubs
}

// Note: Discipline emoji and color helpers moved to src/utils/getDisciplineEmoji.ts

// Helper: Format disciplines for display
export const formatDisciplines = (disciplines: Discipline[]): string => {
  return disciplines.join(', ')
}
