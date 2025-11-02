import React from 'react'
import type { Discipline } from '../../../../types/common'

interface BracketFiltersProps {
  ageGroupFilter: string
  disciplineFilter: Discipline | ''
  weightClassFilter: string
  genderFilter: 'M' | 'F' | 'Open' | ''
  uniqueAgeGroups: string[]
  uniqueDisciplines: Discipline[]
  uniqueWeightClasses: string[]
  uniqueGenders: ('M' | 'F' | 'Open')[]
  hasActiveFilters: boolean
  showFilters: boolean
  onAgeGroupChange: (value: string) => void
  onDisciplineChange: (value: Discipline | '') => void
  onWeightClassChange: (value: string) => void
  onGenderChange: (value: 'M' | 'F' | 'Open' | '') => void
  onClearFilters: () => void
}

export const BracketFilters = React.memo(({
  ageGroupFilter,
  disciplineFilter,
  weightClassFilter,
  genderFilter,
  uniqueAgeGroups,
  uniqueDisciplines,
  uniqueWeightClasses,
  uniqueGenders,
  hasActiveFilters,
  showFilters,
  onAgeGroupChange,
  onDisciplineChange,
  onWeightClassChange,
  onGenderChange,
  onClearFilters,
}: BracketFiltersProps) => {
  if (!showFilters) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">Filters</h4>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Age Group Filter */}
        <div>
          <label htmlFor="age-group-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Age Group
          </label>
          <select
            id="age-group-filter"
            value={ageGroupFilter}
            onChange={(e) => onAgeGroupChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {uniqueAgeGroups.map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>
        </div>

        {/* Discipline Filter */}
        <div>
          <label htmlFor="discipline-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Discipline
          </label>
          <select
            id="discipline-filter"
            value={disciplineFilter}
            onChange={(e) => onDisciplineChange(e.target.value as Discipline | '')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {uniqueDisciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Weight Class Filter */}
        <div>
          <label htmlFor="weight-class-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Weight Class
          </label>
          <select
            id="weight-class-filter"
            value={weightClassFilter}
            onChange={(e) => onWeightClassChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {uniqueWeightClasses.map((wc) => (
              <option key={wc} value={wc}>
                {wc}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label htmlFor="gender-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender-filter"
            value={genderFilter}
            onChange={(e) => onGenderChange(e.target.value as 'M' | 'F' | 'Open' | '')}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {uniqueGenders.map((g) => (
              <option key={g} value={g}>
                {g === 'M' ? 'Men' : g === 'F' ? 'Women' : 'Open'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})

BracketFilters.displayName = 'BracketFilters'
