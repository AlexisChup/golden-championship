import type { Match } from './Match'
import type {
  Discipline,
  AgeGroup,
  WeightClass,
  Gender,
  SeedMethod,
  BracketStatus,
} from '../constants/enums'
import {
  BRACKET_STATUS_LABELS,
  SEED_METHOD_LABELS,
  GENDER_LABELS,
} from '../constants/enums'

/**
 * BracketMatch is a type alias to Match - the existing Match type is already library-compatible.
 * We use this alias for semantic clarity in bracket contexts while maintaining single source of truth.
 */
export type BracketMatch = Match

/**
 * Matches is the array type expected by the bracket library.
 */
export type Matches = BracketMatch[]

/**
 * Division keys that uniquely identify a bracket within a competition.
 * These normalized keys determine which fighters are eligible for a bracket.
 */
export interface BracketDivision {
  ageGroup: AgeGroup
  discipline: Discipline
  weightClass: WeightClass
  gender: Gender
}

// Re-export enum types for convenience
export type { SeedMethod, BracketStatus }

/**
 * Bracket entity - binds a single-elimination tournament to a competition division.
 */
export interface Bracket {
  id: number // unique bracket ID
  competitionId: number // parent competition (ID-only relation)
  division: BracketDivision // normalized division keys
  fighterIds: number[] // eligible fighters for this bracket (ordered)
  seedMethod: SeedMethod // how fighters were seeded
  status: BracketStatus // workflow state
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

/**
 * BracketMetadata - lightweight representation for listing/selection.
 */
export interface BracketMetadata {
  id: number
  competitionId: number
  division: BracketDivision
  seedMethod: SeedMethod
  status: BracketStatus
  fighterCount: number
  fighterIds: number[] // Ordered list of fighter IDs in the bracket
  createdAt: string
  updatedAt: string
}

/**
 * Helper to create a division key for uniqueness checks.
 */
export const getDivisionKey = (division: BracketDivision): string => {
  return `${division.ageGroup}_${division.discipline}_${division.weightClass}_${division.gender}`
}

/**
 * Helper to create a readable division label.
 */
export const getDivisionLabel = (division: BracketDivision): string => {
  const parts = [
    division.ageGroup,
    division.discipline,
    division.weightClass,
    GENDER_LABELS[division.gender],
  ]
  return parts.join(' - ')
}

/**
 * Helper to get status badge styling.
 */
export const getBracketStatusConfig = (
  status: BracketStatus
): { label: string; bgClass: string; colorClass: string } => {
  const configs: Record<BracketStatus, { label: string; bgClass: string; colorClass: string }> = {
    draft: { label: BRACKET_STATUS_LABELS.draft, bgClass: 'bg-gray-100', colorClass: 'text-gray-700' },
    published: { label: BRACKET_STATUS_LABELS.published, bgClass: 'bg-blue-100', colorClass: 'text-blue-700' },
    locked: { label: BRACKET_STATUS_LABELS.locked, bgClass: 'bg-green-100', colorClass: 'text-green-700' },
  }
  return configs[status]
}

/**
 * Helper to get seed method label.
 */
export const getSeedMethodLabel = (method: SeedMethod): string => {
  return SEED_METHOD_LABELS[method]
}
