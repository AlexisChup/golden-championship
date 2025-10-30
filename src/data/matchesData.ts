import type { Match } from '../types/Match'
import { fightersData } from './fightersData'

/**
 * Helper function to get fighter name by ID
 * This ensures data consistency between matches and fighters
 */
const getFighterName = (fighterId: number): string => {
  const fighter = fightersData.find(f => f.id === fighterId)
  return fighter ? `${fighter.firstName} ${fighter.lastName}` : 'Unknown Fighter'
}

/**
 * Seed data with library-compatible structure
 * Fighter IDs reference actual fighters from fightersData.ts:
 * 1: Adelin Bucătaru
 * 2: Mihai Popescu
 * 3: Alexandru Ionescu
 * 4: Cristian Dumitrescu
 * 5: Andrei Georgescu
 * 6: Vlad Marinescu
 */
export const matchesData: Match[] = [
  {
    // Library-required fields (EXACT)
    id: 1,
    name: 'Semifinal - Match 1',
    nextMatchId: 3, // will feed into Final
    tournamentRoundText: '2', // Semifinal = Round 2
    startTime: '2025-11-15T14:00:00Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '1', // Adelin Bucătaru
        name: getFighterName(1),
        isWinner: true,
        resultText: 'TKO Round 2',
        status: 'PLAYED',
      },
      {
        id: '4', // Cristian Dumitrescu
        name: getFighterName(4),
        isWinner: false,
        resultText: null,
        status: 'PLAYED',
      },
    ],

    // App-specific extensions
    uuid: 'match-uuid-001',
    meta: {
      competitionUuid: '1', // Golden Championship 2025
      bracketUuid: null,
      ruleType: 'K1 Rules',
      gender: 'Male',
      ageGroup: '18+',
      weightClass: '-77kg',
      ring: 'Ring 1',
      notes: 'Exciting semifinal match',
    },
  },
  {
    id: 2,
    name: 'Semifinal - Match 2',
    nextMatchId: 3,
    tournamentRoundText: '2',
    startTime: '2025-11-15T14:30:00Z',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '2', // Mihai Popescu
        name: getFighterName(2),
        isWinner: true,
        resultText: 'Decision',
        status: 'PLAYED',
      },
      {
        id: '3', // Alexandru Ionescu
        name: getFighterName(3),
        isWinner: false,
        resultText: null,
        status: 'PLAYED',
      },
    ],

    uuid: 'match-uuid-002',
    meta: {
      competitionUuid: '1',
      bracketUuid: null,
      ruleType: 'MMA Rules',
      gender: 'Male',
      ageGroup: '18+',
      weightClass: '-70kg',
      ring: 'Ring 2',
      notes: null,
    },
  },
  {
    id: 3,
    name: 'Final',
    nextMatchId: null, // Final match has no next
    tournamentRoundText: '3',
    startTime: '2025-11-15T18:00:00Z',
    state: 'DONE',
    participants: [
      {
        id: '1', // Winner of match 1: Adelin Bucătaru
        name: getFighterName(1),
        isWinner: false,
        resultText: null,
        status: null,
      },
      {
        id: '2', // Winner of match 2: Mihai Popescu
        name: getFighterName(2),
        isWinner: false,
        resultText: null,
        status: null,
      },
    ],

    uuid: 'match-uuid-003',
    meta: {
      competitionUuid: '1',
      bracketUuid: null,
      ruleType: 'K1 Rules',
      gender: 'Male',
      ageGroup: '18+',
      weightClass: 'Open',
      ring: 'Ring 1',
      notes: 'Championship Final',
    },
  },
  {
    id: 4,
    name: 'Quarterfinal - Match 1',
    nextMatchId: null,
    tournamentRoundText: '1',
    startTime: '2025-12-10T15:00:00Z',
    state: 'DONE',
    participants: [
      {
        id: '5', // Andrei Georgescu
        name: getFighterName(5),
        isWinner: true,
        resultText: 'KO Round 1',
        status: 'PLAYED',
      },
      {
        id: '6', // Vlad Marinescu
        name: getFighterName(6),
        isWinner: false,
        resultText: null,
        status: 'PLAYED',
      },
    ],

    uuid: 'match-uuid-004',
    meta: {
      competitionUuid: '2', // Bucharest Fight Night 2025
      bracketUuid: null,
      ruleType: 'Muay Thai Rules',
      gender: 'Male',
      ageGroup: '18+',
      weightClass: '-75kg',
      ring: 'Ring 1',
      notes: null,
    },
  },
]
