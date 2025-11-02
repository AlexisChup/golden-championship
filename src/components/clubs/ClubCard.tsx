import { Link } from 'react-router-dom'
import type { Club } from '../../types/Club'
import { formatDisciplines } from '../../types/Club'
import { getClubDisciplinesEmojis } from '../../utils/getDisciplineEmoji'
import { useFighters } from '../../contexts/RepositoryContext'

interface ClubCardProps {
  club: Club
}

export const ClubCard = ({ club }: ClubCardProps) => {
  const { fighters } = useFighters()
  const emojis = getClubDisciplinesEmojis(club.disciplines)
  const fightersCount = fighters.filter(f => f.clubId === club.id).length

  return (
    <Link
      to={`/clubs/${club.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Logo placeholder */}
        <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          {club.name.charAt(0)}
        </div>

        {/* Club Name */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{club.name}</h3>

        {/* City */}
        <p className="text-sm text-gray-600 text-center mb-4 flex items-center justify-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {club.city}
        </p>

        {/* All Disciplines Emojis */}
        <div className="mb-4 text-center">
          <span className="text-2xl">{emojis}</span>
        </div>

        {/* Info Grid */}
        <div className="space-y-2 mb-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fighters:</span>
            <span className="font-bold text-blue-600">{fightersCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Disciplines:</span>
            <span className="font-medium text-gray-900">{club.disciplines.length}</span>
          </div>
        </div>

        {/* All Disciplines */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">{formatDisciplines(club.disciplines)}</p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 h-1"></div>
    </Link>
  )
}
