import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'

interface ClubsFiltersProps {
  searchQuery: string
  selectedCity: string
  sortBy: 'name' | 'city' | 'fighters'
  cities: string[]
  filteredCount: number
  totalCount: number
  onSearchChange: (value: string) => void
  onCityChange: (value: string) => void
  onSortChange: (value: 'name' | 'city' | 'fighters') => void
}

export const ClubsFilters = memo(({
  searchQuery,
  selectedCity,
  sortBy,
  cities,
  filteredCount,
  totalCount,
  onSearchChange,
  onCityChange,
  onSortChange,
}: ClubsFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search clubs
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* City Filter */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by city
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={e => onCityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={e => onSortChange(e.target.value as 'name' | 'city' | 'fighters')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="city">City (A-Z)</option>
            <option value="fighters">Fighters (Most)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> clubs
        </p>
        <Link to="/clubs/new">
          <Button>+ Add New Club</Button>
        </Link>
      </div>
    </div>
  )
})

ClubsFilters.displayName = 'ClubsFilters'
