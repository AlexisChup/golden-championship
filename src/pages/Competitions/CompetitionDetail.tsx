import { useParams, Link, useNavigate, Outlet, NavLink } from 'react-router-dom'
import { useCompetitions } from '../../contexts/RepositoryContext'
import { isRegistrationOpen } from '../../types/Competition'
import { getClubDisciplinesEmojis } from '../../utils/getDisciplineEmoji'
import { getStatusConfig, formatDateShort } from '../../utils/competitions'
import { Icon } from '../../components/icons/Icon'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import toast from 'react-hot-toast'

export default function CompetitionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCompetitionById, deleteCompetition } = useCompetitions()

  const competition = getCompetitionById(Number(id))

  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Competition not found</h2>
            <p className="text-gray-600 mb-6">
              The competition you are looking for does not exist or has been deleted.
            </p>
            <Link
              to="/competitions"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to list
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const config = getStatusConfig(competition.startDate, competition.endDate)
  const registrationOpen = isRegistrationOpen(competition.registrationDate)

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${competition.title}"?`)) {
      deleteCompetition(competition.id)
      toast.success('Competition deleted')
      navigate('/competitions')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/competitions"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <Icon name="chevron-left" size={20} className="mr-2" />
          Back to competitions
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{competition.title}</h1>

              {/* Dates */}
              <div className="flex items-center text-gray-600 mb-2">
                <Icon name="calendar" size={20} className="mr-2" />
                <span>
                  {formatDateShort(competition.startDate)}
                  {competition.startDate !== competition.endDate &&
                    ` - ${formatDateShort(competition.endDate)}`}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-2">
                <Icon name="map-pin" size={20} className="mr-2" />
                <span>{competition.location}</span>
                {competition.googleMapsUrl && (
                  <a
                    href={competition.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    (View on Google Maps)
                  </a>
                )}
              </div>

              {/* Disciplines */}
              {competition.disciplines.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-gray-600">Disciplines:</span>
                  <span className="text-lg">{getClubDisciplinesEmojis(competition.disciplines)}</span>
                  <span className="text-sm text-gray-700">{competition.disciplines.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link to={`/competitions/${competition.id}/edit`}>
                <Button variant="primary" size="md">
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="md" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <NavLink
                to={`/competitions/${competition.id}/general-info`}
                className={({ isActive }) =>
                  `px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                General Info
              </NavLink>
              <NavLink
                to={`/competitions/${competition.id}/fighters`}
                className={({ isActive }) =>
                  `px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Fighters ({competition.fighters.length})
              </NavLink>
              <NavLink
                to={`/competitions/${competition.id}/matches`}
                className={({ isActive }) =>
                  `px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Matches
              </NavLink>
              <NavLink
                to={`/competitions/${competition.id}/bracket`}
                className={({ isActive }) =>
                  `px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Bracket
              </NavLink>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <Outlet context={{ competition }} />
          </div>
        </div>
      </div>
    </div>
  )
}
