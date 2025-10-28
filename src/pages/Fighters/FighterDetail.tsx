import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { FighterStats } from '../../components/fighters/FighterStats'
import { calculateAge, getWeightCategory } from '../../types/Fighter'

export default function FighterDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getFighterById, deleteFighter } = useFighters()

  const fighter = getFighterById(Number(id))

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
      </div>
    </div>
  )
}
