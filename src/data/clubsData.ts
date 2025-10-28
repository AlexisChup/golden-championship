import type { Club } from '../types/Club'

export const clubsData: Club[] = [
  {
    id: 1,
    name: 'Scorpions Iași',
    address: 'Str. Libertății 45',
    city: 'Iași',
    description:
      'Club sportiv specializat în K1 și MMA, fondé en 2015. Nous formons des champions nationaux et internationaux avec des entraîneurs certifiés et des installations modernes.',
    disciplines: ['K1', 'MMA'],
    logoUrl: '/assets/logos/scorpions.png',
  },
  {
    id: 2,
    name: 'Grizzly Gym',
    address: 'Șos. Păcurari 122',
    city: 'Iași',
    description:
      'Salle de kickboxing amateur et professionnel. Centre de formation reconnu pour son excellence technique et son approche pédagogique adaptée à tous les niveaux.',
    disciplines: ['Kickboxing', 'Kickboxing Light'],
    logoUrl: '/assets/logos/grizzly.png',
  },
  {
    id: 3,
    name: 'Bucharest Fight Academy',
    address: 'Bd. Unirii 15',
    city: 'Bucharest',
    description:
      'L\'une des plus grandes académies de combat de Roumanie. Spécialisée en MMA et Muay Thai avec des champions olympiques comme entraîneurs.',
    disciplines: ['MMA', 'Muay Thai', 'Grappling'],
    logoUrl: '/assets/logos/bucharest-academy.png',
  },
  {
    id: 4,
    name: 'Iron Fist Boxing Club',
    address: 'Str. Victoriei 78',
    city: 'Cluj-Napoca',
    description:
      'Club historique de boxe fondé en 1985. Formation de boxeurs professionnels et amateurs, avec une salle équipée de rings olympiques et matériel de pointe.',
    disciplines: ['Boxing'],
    logoUrl: '/assets/logos/iron-fist.png',
  },
  {
    id: 5,
    name: 'Warriors Gym Timișoara',
    address: 'Str. Republicii 34',
    city: 'Timișoara',
    description:
      'Centre multi-disciplines proposant K1, Kickboxing et MMA. Entraînement professionnel dans une ambiance familiale avec un focus sur le développement personnel.',
    disciplines: ['K1', 'Kickboxing', 'MMA'],
    logoUrl: '/assets/logos/warriors.png',
  },
]

// Helper: Get unique cities from all clubs
export const getUniqueCities = (): string[] => {
  const cities = clubsData.map(club => club.city)
  return [...new Set(cities)].sort()
}

// Helper: Get all unique disciplines from all clubs
export const getAllDisciplines = (): string[] => {
  const allDisciplines = clubsData.flatMap(club => club.disciplines)
  return [...new Set(allDisciplines)].sort()
}
