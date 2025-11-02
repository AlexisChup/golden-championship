import type { Club } from '../../types/Club'
import { getDisciplineEmoji, getDisciplineColor } from '../../utils/getDisciplineEmoji'
import { useFighters } from '../../contexts/RepositoryContext'

interface ClubInfoBlockProps {
  club: Club
}

export const ClubInfoBlock = ({ club }: ClubInfoBlockProps) => {
  const { fighters } = useFighters()
  const fightersCount = fighters.filter(f => f.clubId === club.id).length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Club Information</h3>

      {/* Basic Info */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="font-medium text-gray-900">{club.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">City:</span>
          <span className="font-medium text-gray-900">{club.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Address:</span>
          <span className="font-medium text-gray-900 text-right">{club.address}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-600">Fighters:</span>
          <span className="font-bold text-2xl text-blue-600">{fightersCount}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{club.description}</p>
      </div>

      {/* Disciplines */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disciplines Offered</h4>
        <div className="flex flex-wrap gap-2">
          {club.disciplines.map(discipline => {
            const emoji = getDisciplineEmoji(discipline)
            const color = getDisciplineColor(discipline)
            return (
              <span
                key={discipline}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800`}
              >
                <span className="mr-1">{emoji}</span>
                {discipline}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
