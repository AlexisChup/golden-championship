// Match result types
export const RESULT_TYPES = [
  'KO',
  'TKO',
  'Decision',
  'Unanimous Decision',
  'Split Decision',
  'Submission',
  'Technical Submission',
  'Disqualification',
  'No Contest',
  'Draw',
] as const

export type ResultType = typeof RESULT_TYPES[number]

// Age groups
export const AGE_GROUPS = [
  'Under 12',
  '12-13',
  '14-15',
  '16-17',
  '18-21',
  '18+',
  '21+',
  'Masters 35+',
  'Masters 40+',
] as const

export type AgeGroup = typeof AGE_GROUPS[number]

// Weight classes
export const WEIGHT_CLASSES = [
  // Light weights
  '-45kg',
  '-48kg',
  '-51kg',
  '-54kg',
  '-57kg',
  '-60kg',
  '-63.5kg',
  '-67kg',
  '-71kg',
  '-75kg',
  '-81kg',
  '-86kg',
  '-91kg',
  '-91+kg',
  // Specific
  'Boys -85kg',
  'Girls -60kg',
  'Open',
] as const

export type WeightClass = typeof WEIGHT_CLASSES[number]

// Rings
export const RINGS = [
  'Ring 1',
  'Ring 2',
  'Ring 3',
  'Ring 4',
  'Cage 1',
  'Cage 2',
  'Tatami 1',
  'Tatami 2',
  'Main Arena',
] as const

export type Ring = typeof RINGS[number]

// Rule types
export const RULE_TYPES = [
  'K1 Rules',
  'Kickboxing Rules',
  'MMA Rules',
  'Muay Thai Rules',
  'Boxing Rules',
  'Savate Rules',
  'Full Contact Rules',
  'Light Contact Rules',
] as const

export type RuleType = typeof RULE_TYPES[number]
