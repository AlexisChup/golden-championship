import type { Competition } from '../types/Competition'

export const competitionsData: Competition[] = [
  {
    id: 1,
    title: 'Golden Championship 2025 - Spring Edition',
    address: 'Sala Polivalentă, Str. Libertății 45, Iași 700020',
    startDate: '2025-11-15',
    endDate: '2025-11-17',
    registrationDate: '2025-11-01',
    location: 'Iași, Sala Polivalentă',
    googleMapsUrl: 'https://maps.google.com/?q=Sala+Polivalenta+Iasi',
    contactName: 'Alexandru Popescu',
    contactEmail: 'contact@goldenchampionship.ro',
    contactPhone: '+40 755 123 456',
    description:
      'Premier tournament of the 2025 season, gathering the best K1, Kickboxing and MMA fighters from Romania. Amateur and professional categories.',
    disciplines: ['K1', 'Kickboxing', 'MMA'],
    fighters: [
      { fighterId: 1, discipline: 'K1' },
      { fighterId: 4, discipline: 'K1' },
      { fighterId: 2, discipline: 'MMA' },
    ],
  },
  {
    id: 2,
    title: 'Bucharest Fight Night 2025',
    address: 'Arena Națională, Bd. Basarabia 37-39, București',
    startDate: '2025-12-10',
    endDate: '2025-12-10',
    registrationDate: '2025-11-25',
    location: 'Bucharest, Arena Națională',
    googleMapsUrl: 'https://maps.google.com/?q=Arena+Nationala+Bucuresti',
    contactName: 'Mihai Ionescu',
    contactEmail: 'info@fightnight.ro',
    contactPhone: '+40 721 987 654',
    description:
      'Exceptional fight night in the capital. Muay Thai and Boxing matches with international champions.',
    disciplines: ['Muay Thai', 'Boxing'],
    fighters: [
      { fighterId: 3, discipline: 'Muay Thai' },
      { fighterId: 6, discipline: 'Boxing' },
    ],
  },
  {
    id: 3,
    title: 'Winter Warriors Tournament 2024',
    address: 'Complex Sportiv Central, Str. Victoriei 12, Cluj-Napoca',
    startDate: '2024-12-05',
    endDate: '2024-12-07',
    registrationDate: '2024-11-20',
    location: 'Cluj-Napoca, Complex Sportiv Central',
    googleMapsUrl: 'https://maps.google.com/?q=Complex+Sportiv+Cluj',
    contactName: 'Cristian Dumitrescu',
    contactEmail: 'winter@warriors.ro',
    contactPhone: '+40 744 555 777',
    description:
      'Winter tournament successfully completed. Over 50 fighters from across Romania. K1, Kickboxing and Grappling categories.',
    disciplines: ['K1', 'Kickboxing', 'Grappling'],
    fighters: [
      { fighterId: 1, discipline: 'K1' },
      { fighterId: 5, discipline: 'Kickboxing' },
    ],
  },
]
