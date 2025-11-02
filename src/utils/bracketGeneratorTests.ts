/**
 * Manual verification script for bracket generator
 * Run this in the browser console to verify bracket generation
 */

import {
  generateSingleEliminationBracket,
  verifyBracketChain,
  validateBracketIntegrity,
  getBracketStats,
} from './bracketGenerator'

/**
 * Test 4-fighter bracket
 */
export const test4Fighters = () => {
  console.log('=== Testing 4-Fighter Bracket ===')

  const fighterNames = new Map([
    [1, 'Fighter 1'],
    [2, 'Fighter 2'],
    [3, 'Fighter 3'],
    [4, 'Fighter 4'],
  ])

  const matches = generateSingleEliminationBracket({
    competitionId: 1,
    bracketId: 1,
    fighterIds: [1, 2, 3, 4],
    fighterNames,
    seedMethod: 'ranking',
  })

  console.log('Generated matches:', matches.length)
  matches.forEach((m) => {
    console.log(`Match ${m.id}: ${m.name} → nextMatchId: ${m.nextMatchId}`)
  })

  const stats = getBracketStats(matches)
  console.log('Stats:', stats)

  const validation = verifyBracketChain(matches)
  console.log('Validation OK:', validation.ok)
  if (!validation.ok) {
    console.error('Validation errors:', validation.errors)
  }

  console.log('Integrity check:', validateBracketIntegrity(matches))
  console.log('')
}

/**
 * Test 8-fighter bracket
 */
export const test8Fighters = () => {
  console.log('=== Testing 8-Fighter Bracket ===')

  const fighterNames = new Map(
    Array.from({ length: 8 }, (_, i) => [i + 1, `Fighter ${i + 1}`])
  )

  const matches = generateSingleEliminationBracket({
    competitionId: 1,
    bracketId: 1,
    fighterIds: Array.from({ length: 8 }, (_, i) => i + 1),
    fighterNames,
    seedMethod: 'ranking',
  })

  console.log('Generated matches:', matches.length)

  // Group by round
  const byRound = new Map<string, typeof matches>()
  matches.forEach((m) => {
    const round = m.tournamentRoundText
    if (!byRound.has(round)) {
      byRound.set(round, [])
    }
    byRound.get(round)!.push(m)
  })

  byRound.forEach((roundMatches, round) => {
    console.log(`\nRound ${round}:`)
    roundMatches.forEach((m) => {
      console.log(`  Match ${m.id}: ${m.name} → nextMatchId: ${m.nextMatchId}`)
    })
  })

  const stats = getBracketStats(matches)
  console.log('\nStats:', stats)

  const validation = verifyBracketChain(matches)
  console.log('Validation OK:', validation.ok)
  if (!validation.ok) {
    console.error('Validation errors:', validation.errors)
  }

  console.log('Integrity check:', validateBracketIntegrity(matches))
  console.log('')
}

/**
 * Test 16-fighter bracket
 */
export const test16Fighters = () => {
  console.log('=== Testing 16-Fighter Bracket ===')

  const fighterNames = new Map(
    Array.from({ length: 16 }, (_, i) => [i + 1, `Fighter ${i + 1}`])
  )

  const matches = generateSingleEliminationBracket({
    competitionId: 1,
    bracketId: 1,
    fighterIds: Array.from({ length: 16 }, (_, i) => i + 1),
    fighterNames,
    seedMethod: 'ranking',
  })

  console.log('Generated matches:', matches.length)

  // Show parent-child relationships
  console.log('\nParent-Child Relationships:')
  const parentMap = new Map<number, number[]>()
  matches.forEach((m) => {
    if (m.nextMatchId !== null) {
      if (!parentMap.has(m.nextMatchId)) {
        parentMap.set(m.nextMatchId, [])
      }
      parentMap.get(m.nextMatchId)!.push(m.id)
    }
  })

  parentMap.forEach((children, parentId) => {
    const parent = matches.find((m) => m.id === parentId)
    console.log(
      `Parent Match ${parentId} (${parent?.name}): Children [${children.join(', ')}]`
    )
  })

  const stats = getBracketStats(matches)
  console.log('\nStats:', stats)

  const validation = verifyBracketChain(matches)
  console.log('Validation OK:', validation.ok)
  if (!validation.ok) {
    console.error('Validation errors:', validation.errors)
  }

  console.log('Integrity check:', validateBracketIntegrity(matches))
  console.log('')
}

/**
 * Test bracket with byes (3 fighters)
 */
export const testWithByes = () => {
  console.log('=== Testing 3-Fighter Bracket (with byes) ===')

  const fighterNames = new Map([
    [1, 'Fighter 1'],
    [2, 'Fighter 2'],
    [3, 'Fighter 3'],
  ])

  const matches = generateSingleEliminationBracket({
    competitionId: 1,
    bracketId: 1,
    fighterIds: [1, 2, 3],
    fighterNames,
    seedMethod: 'ranking',
  })

  console.log('Generated matches:', matches.length)
  matches.forEach((m) => {
    const p1 = m.participants[0]
    const p2 = m.participants[1]
    console.log(`Match ${m.id}: ${p1.name} vs ${p2.name} → nextMatchId: ${m.nextMatchId}`)
  })

  const stats = getBracketStats(matches)
  console.log('Stats:', stats)

  const validation = verifyBracketChain(matches)
  console.log('Validation OK:', validation.ok)
  if (!validation.ok) {
    console.error('Validation errors:', validation.errors)
  }

  console.log('Integrity check:', validateBracketIntegrity(matches))
  console.log('')
}

/**
 * Run all tests
 */
export const runAllTests = () => {
  test4Fighters()
  test8Fighters()
  test16Fighters()
  testWithByes()
  console.log('=== All Tests Complete ===')
}
