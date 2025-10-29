import { Link } from 'react-router-dom'
import type { Competition } from '../../types/Competition'
import { isRegistrationOpen } from '../../types/Competition'
import { getClubDisciplinesEmojis } from '../../utils/getDisciplineEmoji'
import { getStatusConfig, formatDateShort } from '../../utils/competitions'

interface CompetitionCardProps {
  competition: Competition
}

export const CompetitionCard = ({ competition }: CompetitionCardProps) => {
  const config = getStatusConfig(competition.startDate, competition.endDate)
  const registrationOpen = isRegistrationOpen(competition.registrationDate)

  return (
    <Link
      to={`/competitions/${competition.id}/general-info`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.colorClass}`}>
          {config.label}
        </span>
        {config.label === 'Upcoming' && (
          <span
            className={`px-2 py-1 rounded text-xs ${
              registrationOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {registrationOpen ? 'Registration open' : 'Registration closed'}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{competition.title}</h3>

      {/* Dates */}
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          {formatDateShort(competition.startDate)}
          {competition.startDate !== competition.endDate &&
            ` - ${formatDateShort(competition.endDate)}`}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <span>{competition.location}</span>
      </div>

      {/* Disciplines */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Disciplines:</span>
        <span className="text-lg">{getClubDisciplinesEmojis(competition.disciplines)}</span>
        <span className="text-sm text-gray-700">
          {competition.disciplines.slice(0, 3).join(', ')}
          {competition.disciplines.length > 3 && '...'}
        </span>
      </div>

      {/* Fighters count */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{competition.fighters.length} fighter(s)</span>
        </div>

        <span className="text-blue-600 font-medium text-sm">View details →</span>
      </div>
    </Link>
  )
}
