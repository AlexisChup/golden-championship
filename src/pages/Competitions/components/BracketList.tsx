import { useState } from 'react'
import type { BracketMetadata } from '../../../types/Bracket'
import type { Discipline } from '../../../types/common'
import { getDivisionLabel, getBracketStatusConfig, getSeedMethodLabel } from '../../../types/Bracket'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Icon } from '../../../components/icons/Icon'

interface BracketListProps {
  brackets: BracketMetadata[]
  onCreateNew: () => void
  onView: (bracket: BracketMetadata) => void
  onEdit: (bracket: BracketMetadata) => void
  onDelete: (bracket: BracketMetadata) => void
}

export default function BracketList({
  brackets,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
}: BracketListProps) {
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('')
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | ''>('')
  const [weightClassFilter, setWeightClassFilter] = useState<string>('')
  const [genderFilter, setGenderFilter] = useState<'M' | 'F' | 'Open' | ''>('')

  // Get unique filter options from brackets
  const uniqueAgeGroups = Array.from(new Set(brackets.map((b) => b.division.ageGroup))).sort()
  const uniqueDisciplines = Array.from(new Set(brackets.map((b) => b.division.discipline))).sort()
  const uniqueWeightClasses = Array.from(
    new Set(brackets.map((b) => b.division.weightClass))
  ).sort()
  const uniqueGenders = Array.from(new Set(brackets.map((b) => b.division.gender))).sort()

  // Filter brackets
  const filteredBrackets = brackets.filter((bracket) => {
    if (ageGroupFilter && bracket.division.ageGroup !== ageGroupFilter) return false
    if (disciplineFilter && bracket.division.discipline !== disciplineFilter) return false
    if (weightClassFilter && bracket.division.weightClass !== weightClassFilter) return false
    if (genderFilter && bracket.division.gender !== genderFilter) return false
    return true
  })

  const handleDelete = (bracket: BracketMetadata) => {
    if (
      window.confirm(
        `Are you sure you want to delete the bracket for "${getDivisionLabel(bracket.division)}"?`
      )
    ) {
      onDelete(bracket)
    }
  }

  const clearFilters = () => {
    setAgeGroupFilter('')
    setDisciplineFilter('')
    setWeightClassFilter('')
    setGenderFilter('')
  }

  const hasActiveFilters = ageGroupFilter || disciplineFilter || weightClassFilter || genderFilter

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tournament Brackets</h3>
          <p className="text-sm text-gray-600 mt-1">
            {brackets.length} bracket{brackets.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onCreateNew}>
          <Icon name="plus" size={20} className="mr-2" />
          Create Bracket
        </Button>
      </div>

      {/* Filters */}
      {brackets.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Filters</h4>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
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
                onChange={(e) => setAgeGroupFilter(e.target.value)}
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
                onChange={(e) => setDisciplineFilter(e.target.value as Discipline | '')}
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
                onChange={(e) => setWeightClassFilter(e.target.value)}
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
                onChange={(e) => setGenderFilter(e.target.value as 'M' | 'F' | 'Open' | '')}
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
      )}

      {/* Bracket List */}
      {filteredBrackets.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No brackets match your filters' : 'No brackets yet'}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {hasActiveFilters
              ? 'Try adjusting your filters or create a new bracket.'
              : 'Get started by creating your first tournament bracket.'}
          </p>
          {!hasActiveFilters && (
            <Button variant="primary" size="md" onClick={onCreateNew}>
              <Icon name="plus" size={20} className="mr-2" />
              Create Bracket
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seeding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrackets.map((bracket) => {
                const statusConfig = getBracketStatusConfig(bracket.status)
                return (
                  <tr key={bracket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getDivisionLabel(bracket.division)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created {new Date(bracket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bracket.fighterCount} fighters</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {getSeedMethodLabel(bracket.seedMethod)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="status"
                        className={`${statusConfig.bgClass} ${statusConfig.colorClass}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onView(bracket)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="View bracket"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(bracket)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label="Edit bracket"
                        disabled={bracket.status === 'locked'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bracket)}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Delete bracket"
                        disabled={bracket.status === 'locked'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
