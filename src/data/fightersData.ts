import type { Fighter } from '../types/Fighter'

export const fightersData: Fighter[] = [
  {
    id: 1,
    firstName: 'Adelin',
    lastName: 'Bucătaru',
    nickname: 'The Hammer',
    club: 'Scorpions Iași',
    clubId: 1,
    birthDate: '2003-05-15',
    height: 182,
    weight: 77,
    discipline: 'K1',
    record: {
      wins: 8,
      losses: 2,
      draws: 1
    }
  },
  {
    id: 2,
    firstName: 'Mihai',
    lastName: 'Popescu',
    nickname: 'Iron Fist',
    club: 'Bucharest Fight Academy',
    clubId: 3,
    birthDate: '2001-08-22',
    height: 175,
    weight: 68,
    discipline: 'MMA',
    record: {
      wins: 12,
      losses: 3,
      draws: 0
    }
  },
  {
    id: 3,
    firstName: 'Alexandru',
    lastName: 'Ionescu',
    nickname: 'The Wolf',
    club: 'Bucharest Fight Academy',
    clubId: 3,
    birthDate: '1999-12-10',
    height: 180,
    weight: 85,
    discipline: 'Muay Thai',
    record: {
      wins: 15,
      losses: 5,
      draws: 2
    }
  },
  {
    id: 4,
    firstName: 'Cristian',
    lastName: 'Dumitrescu',
    nickname: 'The Tank',
    club: 'Scorpions Iași',
    clubId: 1,
    birthDate: '2002-03-18',
    height: 188,
    weight: 92,
    discipline: 'K1',
    record: {
      wins: 6,
      losses: 1,
      draws: 0
    }
  },
  {
    id: 5,
    firstName: 'Andrei',
    lastName: 'Georgescu',
    nickname: 'Lightning',
    club: 'Grizzly Gym',
    clubId: 2,
    birthDate: '2004-07-05',
    height: 170,
    weight: 58,
    discipline: 'Kickboxing',
    record: {
      wins: 10,
      losses: 4,
      draws: 1
    }
  },
  {
    id: 6,
    firstName: 'Vlad',
    lastName: 'Marinescu',
    nickname: 'The Beast',
    club: 'Iron Fist Boxing Club',
    clubId: 4,
    birthDate: '2000-11-30',
    height: 185,
    weight: 80,
    discipline: 'Boxing',
    record: {
      wins: 18,
      losses: 2,
      draws: 0
    }
  }
]

// Helper to get unique clubs
export const getUniqueClubs = (): string[] => {
  return Array.from(new Set(fightersData.map(f => f.club))).sort()
}

// Helper to get unique disciplines
export const getUniqueDisciplines = (): string[] => {
  return Array.from(new Set(fightersData.map(f => f.discipline))).sort()
}
