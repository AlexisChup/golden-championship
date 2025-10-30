import { memo } from 'react'
import { ClubCard } from '../../../components/clubs/ClubCard'
import type { Club } from '../../../types/Club'

interface ClubWithCount extends Club {
  fightersCount: number
}

interface ClubsGridProps {
  clubs: ClubWithCount[]
  onClearFilters: () => void
}

export const ClubsGrid = memo(({ clubs, onClearFilters }: ClubsGridProps) => {
  if (clubs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 text-lg">No clubs found matching your criteria.</p>
        <button
          onClick={onClearFilters}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map(club => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  )
})

ClubsGrid.displayName = 'ClubsGrid'
