import { Link } from 'react-router-dom'
import type { Competition } from '../../types/Competition'
import { isRegistrationOpen } from '../../types/Competition'
import { getClubDisciplinesEmojis } from '../../utils/getDisciplineEmoji'
import { getStatusConfig, formatDateShort } from '../../utils/competitions'
import { Icon } from '../icons/Icon'
import { Badge } from '../ui/Badge'

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
        <Badge variant="status" className={`${config.bgClass} ${config.colorClass}`}>
          {config.label}
        </Badge>
        {config.label === 'Upcoming' && (
          <Badge
            variant="info"
            className={registrationOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
          >
            {registrationOpen ? 'Registration open' : 'Registration closed'}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{competition.title}</h3>

      {/* Dates */}
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <Icon name="calendar" size={16} className="mr-2" />
        <span>
          {formatDateShort(competition.startDate)}
          {competition.startDate !== competition.endDate &&
            ` - ${formatDateShort(competition.endDate)}`}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <Icon name="map-pin" size={16} className="mr-2" />
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
          <Icon name="users" size={16} className="mr-1" />
          <span>{competition.fighters.length} fighter(s)</span>
        </div>

        <span className="text-blue-600 font-medium text-sm">View details →</span>
      </div>
    </Link>
  )
}
