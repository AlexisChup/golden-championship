/**
 * Global data utilities for browser console access.
 * Exposes seed functions and data repositories for testing.
 * 
 * Usage in browser console:
 *   window.seedData.dev()       // Generate small dataset
 *   window.seedData.demo()      // Generate large dataset
 *   window.seedData.clear()     // Clear all data
 *   window.seedData.repos       // Access repositories directly
 *   window.seedData.validate()  // Validate data integrity
 */

import { seedAll, seedDev, seedDemo, clearAllData } from './seed'
import { clubsRepo, fightersRepo, competitionsRepo, bracketsRepo } from './repositories'
import {
  validateGraph,
  findOrphanedFighters,
  findOrphanedCompetitionFighters,
  fixOrphanedFighters,
  fixOrphanedCompetitionFighters,
} from './validation'

declare global {
  interface Window {
    seedData: {
      all: typeof seedAll
      dev: typeof seedDev
      demo: typeof seedDemo
      clear: typeof clearAllData
      repos: {
        clubs: typeof clubsRepo
        fighters: typeof fightersRepo
        competitions: typeof competitionsRepo
        brackets: typeof bracketsRepo
      }
      validate: typeof validateGraph
      findOrphans: {
        fighters: typeof findOrphanedFighters
        competitionFighters: typeof findOrphanedCompetitionFighters
      }
      fix: {
        orphanedFighters: typeof fixOrphanedFighters
        orphanedCompetitionFighters: typeof fixOrphanedCompetitionFighters
      }
    }
  }
}

// Expose seed utilities globally
if (typeof window !== 'undefined') {
  window.seedData = {
    all: seedAll,
    dev: seedDev,
    demo: seedDemo,
    clear: clearAllData,
    repos: {
      clubs: clubsRepo,
      fighters: fightersRepo,
      competitions: competitionsRepo,
      brackets: bracketsRepo,
    },
    validate: validateGraph,
    findOrphans: {
      fighters: findOrphanedFighters,
      competitionFighters: findOrphanedCompetitionFighters,
    },
    fix: {
      orphanedFighters: fixOrphanedFighters,
      orphanedCompetitionFighters: fixOrphanedCompetitionFighters,
    },
  }

  console.log('✨ Seed utilities available:')
  console.log('  window.seedData.dev()   - Generate small dataset (5-8 clubs, 30-50 fighters)')
  console.log('  window.seedData.demo()  - Generate large dataset (12-15 clubs, 100-120 fighters)')
  console.log('  window.seedData.clear() - Clear all data')
  console.log('  window.seedData.repos   - Access data repositories')
  console.log('  window.seedData.validate() - Validate data integrity')
  console.log('  window.seedData.findOrphans.fighters() - Find fighters with invalid clubId')
  console.log('  window.seedData.fix.orphanedFighters() - Auto-fix orphaned fighters')
}
