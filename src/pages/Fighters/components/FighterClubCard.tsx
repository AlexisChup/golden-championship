import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../components/icons/Icon'
import type { Club } from '../../../types/Club'
import { getClubDisciplinesEmojis } from '../../../utils/getDisciplineEmoji'

interface FighterClubCardProps {
  club: Club | null
  clubId: number | null | undefined
}

export const FighterClubCard = memo(({ club, clubId }: FighterClubCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Club</h2>
      
      {clubId === null || clubId === undefined ? (
        <div className="text-center py-8 text-gray-500">
          <p>No affiliated club</p>
        </div>
      ) : !club ? (
        <div className="text-center py-8 text-gray-500">
          <p>Club not found (check data)</p>
        </div>
      ) : (
        <Link
          to={`/clubs/${club.id}`}
          className="block rounded-xl border border-gray-200 p-4 hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
          role="button"
          aria-label={`View club ${club.name}`}
        >
          <div className="flex items-center gap-4">
            {/* Logo placeholder */}
            <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {club.name.charAt(0)}
            </div>
            
            {/* Club info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{club.name}</h3>
              <p className="text-gray-600 flex items-center mb-2">
                <Icon name="map-pin" size={16} className="mr-1" />
                {club.city}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Disciplines:</span>
                <span className="text-lg">{getClubDisciplinesEmojis(club.disciplines)}</span>
                <span className="text-sm text-gray-700">
                  {club.disciplines.slice(0, 3).join(', ')}
                  {club.disciplines.length > 3 && '...'}
                </span>
              </div>
            </div>

            {/* Arrow icon */}
            <Icon name="chevron-right" size={24} className="text-gray-400 shrink-0" />
          </div>
        </Link>
      )}
    </div>
  )
})

FighterClubCard.displayName = 'FighterClubCard'
