import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { useClubs } from '../../contexts/ClubsContext'
import { FighterStats } from '../../components/fighters/FighterStats'
import { calculateAge, getWeightCategory } from '../../types/Fighter'
import { getClubDisciplinesEmojis } from '../../utils/getDisciplineEmoji'

export default function FighterDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getFighterById, deleteFighter } = useFighters()
  const { clubs } = useClubs()

  const fighter = getFighterById(Number(id))
  
  // Get the club based on fighter.clubId
  const club = fighter?.clubId ? clubs.find(c => c.id === fighter.clubId) : null

  if (!fighter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fighter Not Found</h2>
            <p className="text-gray-600 mb-6">
              The fighter you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/fighters"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Fighters List
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const age = calculateAge(fighter.birthDate)
  const weightCategory = getWeightCategory(fighter.weight)

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${fighter.firstName} ${fighter.lastName}?`)) {
      deleteFighter(fighter.id)
      navigate('/fighters')
    }
  }

  const handleResetData = () => {
    if (confirm('Reset local data for Clubs/Fighters?')) {
      localStorage.removeItem('fighters_data')
      localStorage.removeItem('clubs_data')
      localStorage.removeItem('competitions_data')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/fighters"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Fighters
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {fighter.firstName} {fighter.lastName}
              </h1>
              {fighter.nickname && (
                <p className="text-xl text-gray-600 italic">"{fighter.nickname}"</p>
              )}
            </div>
            <div className="flex gap-3">
              {import.meta.env.DEV && (
                <button
                  onClick={handleResetData}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  aria-label="Reset local data"
                >
                  Reset Data
                </button>
              )}
              <Link
                to={`/fighters/${fighter.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium text-gray-900">{age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Birth Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(fighter.birthDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium text-gray-900">{fighter.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium text-gray-900">{fighter.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight Category:</span>
                  <span className="font-medium text-blue-600">{weightCategory}</span>
                </div>
              </div>
            </div>

            {/* Club & Discipline */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Club & Discipline</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Club:</span>
                  <span className="font-medium text-gray-900">{fighter.club}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discipline:</span>
                  <span className="font-medium text-blue-600">{fighter.discipline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <FighterStats record={fighter.record} />

        {/* Club Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Club</h2>
          
          {fighter.clubId === null || fighter.clubId === undefined ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun club affilié</p>
            </div>
          ) : !club ? (
            <div className="text-center py-8 text-gray-500">
              <p>Club introuvable (vérifier les données)</p>
            </div>
          ) : (
            <Link
              to={`/clubs/${club.id}`}
              className="block rounded-xl border border-gray-200 p-4 hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
              role="button"
              aria-label={`Voir le club ${club.name}`}
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
                <svg
                  className="w-6 h-6 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
