import { Search, Filter } from 'lucide-react'
import type { LibraryMatchState } from '../../types/Match'

type MatchFiltersProps = {
  searchTerm: string
  stateFilter: LibraryMatchState | ''
  ruleTypeFilter: string
  availableRuleTypes: string[]
  onSearchChange: (value: string) => void
  onStateFilterChange: (value: LibraryMatchState | '') => void
  onRuleTypeFilterChange: (value: string) => void
  onClearFilters: () => void
}

export const MatchFilters = ({
  searchTerm,
  stateFilter,
  ruleTypeFilter,
  availableRuleTypes,
  onSearchChange,
  onStateFilterChange,
  onRuleTypeFilterChange,
  onClearFilters,
}: MatchFiltersProps) => {
  const hasActiveFilters = searchTerm || stateFilter || ruleTypeFilter

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Search className="w-4 h-4 inline mr-1" />
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Match name, fighters, round..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Filter className="w-4 h-4 inline mr-1" />
            State
          </label>
          <select
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value as LibraryMatchState | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            <option value="DONE">Done</option>
            <option value="SCORE_DONE">Score Done</option>
            <option value="NO_SHOW">No Show</option>
            <option value="WALK_OVER">Walk Over</option>
            <option value="NO_PARTY">No Party</option>
          </select>
        </div>

        {/* Rule Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Filter className="w-4 h-4 inline mr-1" />
            Rule Type
          </label>
          <select
            value={ruleTypeFilter}
            onChange={(e) => onRuleTypeFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Rules</option>
            {availableRuleTypes.map(ruleType => (
              <option key={ruleType} value={ruleType}>
                {ruleType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Active filters:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              Search: "{searchTerm}"
            </span>
          )}
          {stateFilter && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              State: {stateFilter}
            </span>
          )}
          {ruleTypeFilter && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              Rules: {ruleTypeFilter}
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="ml-2 text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
