# Data Layer Documentation

This directory contains the complete data layer architecture for the Golden Championship application.

## Overview

The data layer provides:
- **Centralized enums** for type-safe constants
- **Repository pattern** for data access abstraction
- **Factory functions** for realistic data generation
- **Seed orchestrator** for coherent datasets
- **Browser console utilities** for testing

## Architecture

```
src/
├── constants/
│   └── enums.ts          # App-wide type-safe enums (using 'as const')
├── data/
│   ├── repositories.ts   # CRUD interfaces for all entities
│   ├── factories.ts      # Data generation with realistic patterns
│   ├── seed.ts           # Dataset orchestration (seedAll, seedDev, seedDemo)
│   └── globalUtils.ts    # Browser console exposure
└── types/
    ├── Club.ts           # Updated to use centralized enums
    ├── Fighter.ts        # Updated to use centralized enums
    ├── Competition.ts    # Updated to use centralized enums
    └── Bracket.ts        # Updated to use centralized enums
```

## Usage

### Browser Console

Open the browser console and use:

```javascript
// Generate small dataset (dev)
window.seedData.dev()

// Generate large dataset (demo)
window.seedData.demo()

// Custom seed
window.seedData.all({
  clubs: { min: 10, max: 12 },
  fighters: { min: 80, max: 100 },
  competitions: { min: 5, max: 6 },
  generateBrackets: true
})

// Clear all data
window.seedData.clear()

// Access repositories directly
window.seedData.repos.fighters.getAll()
window.seedData.repos.clubs.getById(1)
```

### In Code

```typescript
import { seedAll, seedDev } from '@/data/seed'
import { clubsRepo, fightersRepo } from '@/data/repositories'
import { createFighter, createClub } from '@/data/factories'

// Generate data
seedDev()

// Access data
const clubs = clubsRepo.getAll()
const fighter = fightersRepo.getById(1)

// Create data
const newClub = createClub({ name: 'My Custom Club' })
const newFighter = createFighter({ clubId: newClub.id })
```

## Repositories

All repositories follow a standard CRUD interface:

- `getAll()` - Fetch all entities
- `getById(id)` - Fetch single entity
- `create(data)` - Create new entity (auto-generates ID)
- `update(id, data)` - Update existing entity
- `delete(id)` - Delete entity

### Available Repositories

- **clubsRepo** - Club management
- **fightersRepo** - Fighter management (includes `getByClubId`, `getByIds`)
- **competitionsRepo** - Competition management
- **bracketsRepo** - Bracket management (includes `getAllForCompetition`, `getMatches`, `updateMatches`)

## Factories

Factories generate realistic mock data with intelligent defaults:

### `createClub(overrides?)`

Generates a club with:
- Random name from predefined list
- Random French city
- Random disciplines (2)
- Realistic address

### `createFighter(overrides?)`

Generates a fighter with:
- Gender-appropriate first name
- French last name
- Nickname from predefined list
- Age-appropriate birth date, height, weight
- Realistic fight record based on age
- Auto-assignment to random club (if not specified)

### `createCompetition(overrides?)`

Generates a competition with:
- Time-distributed dates (past/ongoing/upcoming)
- 2-4 disciplines
- Registration deadline before start date
- 10-30 fighters with matching disciplines

## Seed Orchestrator

### `seedAll(config?)`

Generates a complete, coherent dataset:

```typescript
seedAll({
  clubs: { min: 8, max: 15 },
  fighters: { min: 60, max: 120 },
  competitions: { min: 4, max: 8 },
  generateBrackets: true
})
```

**Generation logic:**
1. Creates 8-15 clubs with varied disciplines
2. Creates 60-120 fighters distributed across:
   - Genders (M/F)
   - Age groups (U12, U15, U18, U21, Adult, Senior)
   - Weights (realistic for age/gender)
   - Clubs (evenly distributed)
3. Creates 4-8 competitions:
   - Distributed across time (past/ongoing/upcoming)
   - 2-4 disciplines each
   - 10-30 fighters each
4. Generates brackets for each competition:
   - Groups fighters by division (age/discipline/weight/gender)
   - Creates bracket if division has 4+ fighters
   - Uses single-elimination algorithm

### Preset Seeds

- **`seedDev()`** - Small dataset for development (5-8 clubs, 30-50 fighters, 2-4 competitions)
- **`seedDemo()`** - Large dataset for demos (12-15 clubs, 100-120 fighters, 6-8 competitions)
- **`clearAllData()`** - Wipes all data from localStorage

## Enums

Centralized type-safe constants using `as const` pattern (TypeScript 5+ best practice):

### Available Enums

- **AgeGroup**: U12, U15, U18, U21, Adult, Senior
- **Discipline**: K1, Kickboxing, Kickboxing Light, Muay Thai, MMA, Grappling, Boxing
- **Gender**: M (Male), F (Female), Open
- **WeightClass**: Separate classes for Men, Women, and Open divisions
- **BracketStatus**: draft, published, locked
- **SeedMethod**: random, ranking, manual
- **CompetitionStatus**: upcoming, ongoing, past

### Helper Functions

```typescript
import {
  getWeightClassFromKg,
  getAgeGroupFromBirthDate,
  getCompetitionStatusFromDates,
  getWeightClassValues
} from '@/constants/enums'

// Get weight class for a fighter
const weightClass = getWeightClassFromKg(75, Gender.Male) // "-75kg"

// Get age group from birth date
const ageGroup = getAgeGroupFromBirthDate('2005-06-15') // "U21"

// Get competition status
const status = getCompetitionStatusFromDates('2024-01-15', '2024-01-17') // "past"

// Get valid weight classes for gender
const classes = getWeightClassValues(Gender.Female) // ["-50kg", "-55kg", ...]
```

## Database Replacement Strategy

The repository pattern makes it easy to replace localStorage with a real API:

### Current (localStorage)
```typescript
export const fightersRepo = {
  getAll(): Fighter[] {
    const json = localStorage.getItem('fighters')
    return json ? JSON.parse(json) : []
  },
  // ...
}
```

### Future (API)
```typescript
export const fightersRepo = {
  async getAll(): Promise<Fighter[]> {
    const response = await fetch('/api/fighters')
    return response.json()
  },
  // ...
}
```

**Migration steps:**
1. Update repository return types to `Promise<T>`
2. Replace localStorage calls with `fetch` or axios
3. Update consuming components to handle async operations
4. No changes needed to types, enums, or business logic!

## Storage Keys

Current localStorage structure:

```
clubs                                    → Club[]
fighters                                 → Fighter[]
competitions                             → Competition[]
competitions:<competitionId>:brackets    → BracketMetadata[]
competitions:<competitionId>:bracket:<bracketId>:matches → Match[]
```

## Notes

- All IDs are auto-generated using monotonic counters
- Seed data is deterministic (same seed = same data with random seeding)
- Fighter distribution ensures realistic age/weight/gender splits
- Competitions automatically get fighters with matching disciplines
- Brackets only generated for divisions with 4+ fighters
- All types are now using centralized enums for consistency
