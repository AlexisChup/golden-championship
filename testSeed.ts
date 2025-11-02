/**
 * Test script for seed generation
 * Run with: npx tsx testSeed.ts
 */

import { seedDev, clearAllData } from './src/data/seed'
import { matchesRepo } from './src/data/matchesRepository'
import { bracketsRepo, competitionsRepo } from './src/data/repositories'

// Mock localStorage for Node.js environment
const storage: Record<string, string> = {}
global.localStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, value: string) => { storage[key] = value },
  removeItem: (key: string) => { delete storage[key] },
  clear: () => { Object.keys(storage).forEach(key => delete storage[key]) },
  key: (index: number) => Object.keys(storage)[index] || null,
  get length() { return Object.keys(storage).length }
} as Storage

console.log('\n🧪 Testing Seed Generation with New Architecture\n')
console.log('=' .repeat(60))

// Clear and generate
clearAllData()
seedDev()

console.log('\n' + '='.repeat(60))
console.log('📊 Verification\n')

// Verify matches are in matchesRepository
const allMatches = matchesRepo.readAll()
console.log(`✓ Total matches in matchesRepository: ${allMatches.length}`)

// Verify brackets reference matches
const competitions = competitionsRepo.getAll()
let totalBracketsVerified = 0
let matchesInBrackets = 0

competitions.forEach(comp => {
  const brackets = bracketsRepo.getAllForCompetition(comp.id)
  console.log(`\nCompetition ${comp.id}: ${brackets.length} brackets`)
  
  brackets.forEach(bracket => {
    totalBracketsVerified++
    const bracketMatches = matchesRepo.listByBracket(comp.id, bracket.id)
    matchesInBrackets += bracketMatches.length
    
    console.log(`  Bracket ID: ${bracket.id}, Matches: ${bracketMatches.length}`)
    
    if (bracketMatches.length > 0 && bracket.id <= 3) {
      // Show bracketId of matches to verify they match
      const matchBracketIds = [...new Set(bracketMatches.map(m => m.bracketId))]
      console.log(`    → Match bracketIds: ${matchBracketIds.join(', ')}`)
      console.log(`    → Expected: ${bracket.id}`)
    }
  })
})

console.log(`\n✓ Verified ${totalBracketsVerified} brackets`)
console.log(`✓ Total matches linked to brackets: ${matchesInBrackets}`)

if (matchesInBrackets === allMatches.length) {
  console.log('\n✅ SUCCESS: All matches are properly linked to brackets')
} else {
  console.warn(`\n⚠️  WARNING: ${allMatches.length - matchesInBrackets} matches are not linked to any bracket`)
}

console.log('\n' + '='.repeat(60))
