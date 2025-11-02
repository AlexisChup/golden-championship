/**
 * Centralized enums for the entire application.
 * Single source of truth for all dropdown options, filters, and data validation.
 * Using const objects with 'as const' for type-safe enums (TS5+ best practice)
 */

// ============================================================================
// AGE GROUPS
// ============================================================================

export const AgeGroup = {
  U12: 'U12',
  U15: 'U15',
  U18: 'U18',
  U21: 'U21',
  Adult: 'Adult',
  Senior: 'Senior',
} as const

export type AgeGroup = (typeof AgeGroup)[keyof typeof AgeGroup]

export const AGE_GROUP_VALUES = Object.values(AgeGroup)

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  [AgeGroup.U12]: 'Under 12',
  [AgeGroup.U15]: 'Under 15',
  [AgeGroup.U18]: 'Under 18',
  [AgeGroup.U21]: 'Under 21',
  [AgeGroup.Adult]: 'Adult',
  [AgeGroup.Senior]: 'Senior (35+)',
}

// ============================================================================
// DISCIPLINES
// ============================================================================

export const Discipline = {
  K1: 'K1',
  Kickboxing: 'Kickboxing',
  KickboxingLight: 'Kickboxing Light',
  MuayThai: 'Muay Thai',
  MMA: 'MMA',
  Grappling: 'Grappling',
  Boxing: 'Boxing',
} as const

export type Discipline = (typeof Discipline)[keyof typeof Discipline]

export const DISCIPLINE_VALUES = Object.values(Discipline)

// ============================================================================
// WEIGHT CLASSES
// ============================================================================

export const WeightClassMen = {
  Under60: '-60kg',
  Under65: '-65kg',
  Under70: '-70kg',
  Under75: '-75kg',
  Under81: '-81kg',
  Under86: '-86kg',
  Under91: '-91kg',
  Over91: '+91kg',
} as const

export type WeightClassMen = (typeof WeightClassMen)[keyof typeof WeightClassMen]

export const WeightClassWomen = {
  Under50: '-50kg',
  Under55: '-55kg',
  Under60: '-60kg',
  Under65: '-65kg',
  Under70: '-70kg',
  Over70: '+70kg',
} as const

export type WeightClassWomen = (typeof WeightClassWomen)[keyof typeof WeightClassWomen]

export const WeightClassOpen = {
  Under60: '-60kg',
  Under70: '-70kg',
  Under80: '-80kg',
  Over80: '+80kg',
} as const

export type WeightClassOpen = (typeof WeightClassOpen)[keyof typeof WeightClassOpen]

export type WeightClass = WeightClassMen | WeightClassWomen | WeightClassOpen

export const WEIGHT_CLASS_MEN_VALUES = Object.values(WeightClassMen)
export const WEIGHT_CLASS_WOMEN_VALUES = Object.values(WeightClassWomen)
export const WEIGHT_CLASS_OPEN_VALUES = Object.values(WeightClassOpen)

// ============================================================================
// GENDER
// ============================================================================

export const Gender = {
  Male: 'M',
  Female: 'F',
  Open: 'Open',
} as const

export type Gender = (typeof Gender)[keyof typeof Gender]

export const GENDER_VALUES = Object.values(Gender)

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.Male]: 'Men',
  [Gender.Female]: 'Women',
  [Gender.Open]: 'Open',
}

// ============================================================================
// BRACKET STATUS
// ============================================================================

export const BracketStatus = {
  Draft: 'draft',
  Published: 'published',
  Locked: 'locked',
} as const

export type BracketStatus = (typeof BracketStatus)[keyof typeof BracketStatus]

export const BRACKET_STATUS_VALUES = Object.values(BracketStatus)

export const BRACKET_STATUS_LABELS: Record<BracketStatus, string> = {
  [BracketStatus.Draft]: 'Draft',
  [BracketStatus.Published]: 'Published',
  [BracketStatus.Locked]: 'Locked',
}

// ============================================================================
// SEED METHOD
// ============================================================================

export const SeedMethod = {
  Random: 'random',
  Ranking: 'ranking',
  Manual: 'manual',
} as const

export type SeedMethod = (typeof SeedMethod)[keyof typeof SeedMethod]

export const SEED_METHOD_VALUES = Object.values(SeedMethod)

export const SEED_METHOD_LABELS: Record<SeedMethod, string> = {
  [SeedMethod.Random]: 'Random',
  [SeedMethod.Ranking]: 'By Ranking',
  [SeedMethod.Manual]: 'Manual',
}

// ============================================================================
// MATCH STATE (Library-compatible)
// ============================================================================

export const MatchState = {
  NoShow: 'NO_SHOW',
  WalkOver: 'WALK_OVER',
  NoParty: 'NO_PARTY',
  Done: 'DONE',
  ScoreDone: 'SCORE_DONE',
} as const

export type MatchState = (typeof MatchState)[keyof typeof MatchState]

export const MATCH_STATE_VALUES = Object.values(MatchState)

export const MATCH_STATE_LABELS: Record<MatchState, string> = {
  [MatchState.NoShow]: 'No Show',
  [MatchState.WalkOver]: 'Walk Over',
  [MatchState.NoParty]: 'No Party',
  [MatchState.Done]: 'Done',
  [MatchState.ScoreDone]: 'Score Done',
}

// ============================================================================
// PARTICIPANT STATUS (Library-compatible)
// ============================================================================

export const ParticipantStatus = {
  Played: 'PLAYED',
  NoShow: 'NO_SHOW',
  WalkOver: 'WALK_OVER',
  NoParty: 'NO_PARTY',
} as const

export type ParticipantStatus = (typeof ParticipantStatus)[keyof typeof ParticipantStatus]

export const PARTICIPANT_STATUS_VALUES = Object.values(ParticipantStatus)

// ============================================================================
// COMPETITION STATUS
// ============================================================================

export const CompetitionStatus = {
  Upcoming: 'upcoming',
  Ongoing: 'ongoing',
  Past: 'past',
} as const

export type CompetitionStatus = (typeof CompetitionStatus)[keyof typeof CompetitionStatus]

export const COMPETITION_STATUS_VALUES = Object.values(CompetitionStatus)

export const COMPETITION_STATUS_LABELS: Record<CompetitionStatus, string> = {
  [CompetitionStatus.Upcoming]: 'Upcoming',
  [CompetitionStatus.Ongoing]: 'Ongoing',
  [CompetitionStatus.Past]: 'Past',
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get weight class values for a specific gender
 */
export const getWeightClassValues = (gender: Gender): string[] => {
  switch (gender) {
    case Gender.Male:
      return WEIGHT_CLASS_MEN_VALUES
    case Gender.Female:
      return WEIGHT_CLASS_WOMEN_VALUES
    case Gender.Open:
      return WEIGHT_CLASS_OPEN_VALUES
  }
}

/**
 * Get weight class enum from weight in kg
 */
export const getWeightClassFromKg = (weight: number, gender: Gender): WeightClass => {
  if (gender === Gender.Male) {
    if (weight < 60) return WeightClassMen.Under60
    if (weight < 65) return WeightClassMen.Under65
    if (weight < 70) return WeightClassMen.Under70
    if (weight < 75) return WeightClassMen.Under75
    if (weight < 81) return WeightClassMen.Under81
    if (weight < 86) return WeightClassMen.Under86
    if (weight < 91) return WeightClassMen.Under91
    return WeightClassMen.Over91
  } else if (gender === Gender.Female) {
    if (weight < 50) return WeightClassWomen.Under50
    if (weight < 55) return WeightClassWomen.Under55
    if (weight < 60) return WeightClassWomen.Under60
    if (weight < 65) return WeightClassWomen.Under65
    if (weight < 70) return WeightClassWomen.Under70
    return WeightClassWomen.Over70
  }
  // Open
  if (weight < 60) return WeightClassOpen.Under60
  if (weight < 70) return WeightClassOpen.Under70
  if (weight < 80) return WeightClassOpen.Under80
  return WeightClassOpen.Over80
}

/**
 * Get age group from birth date
 */
export const getAgeGroupFromBirthDate = (birthDate: string): AgeGroup => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  if (age < 12) return AgeGroup.U12
  if (age < 15) return AgeGroup.U15
  if (age < 18) return AgeGroup.U18
  if (age < 21) return AgeGroup.U21
  if (age < 35) return AgeGroup.Adult
  return AgeGroup.Senior
}

/**
 * Get competition status from dates
 */
export const getCompetitionStatusFromDates = (
  startDate: string,
  endDate: string
): CompetitionStatus => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now >= start && now <= end) {
    return CompetitionStatus.Ongoing
  } else if (now < start) {
    return CompetitionStatus.Upcoming
  } else {
    return CompetitionStatus.Past
  }
}
