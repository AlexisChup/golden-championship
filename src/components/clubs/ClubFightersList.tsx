import { Link } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { calculateAge, getWeightCategory, formatRecord, getRecordColor } from '../../types/Fighter'

interface ClubFightersListProps {
  clubId: number
}

export const ClubFightersList = ({ clubId }: ClubFightersListProps) => {
  const { fighters } = useFighters()

  // Filter fighters by clubId (strict number comparison)
  const filteredFighters = fighters.filter(f => f.clubId === clubId && f.clubId !== null)

  if (filteredFighters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No fighters affiliated with this club yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          Club Fighters ({filteredFighters.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredFighters.map(fighter => {
          const age = calculateAge(fighter.birthDate)
          const weightCategory = getWeightCategory(fighter.weight)
          const recordColor = getRecordColor(fighter.record)

          return (
            <Link
              key={fighter.id}
              to={`/fighters/${fighter.id}`}
              className="block p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Fighter Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {fighter.firstName} {fighter.lastName}
                    {fighter.nickname && (
                      <span className="text-sm text-gray-600 italic ml-2">
                        "{fighter.nickname}"
                      </span>
                    )}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Discipline:</span>
                      <span className="font-medium text-blue-600">{fighter.discipline}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Age:</span>
                      <span className="font-medium text-gray-900">{age} years</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">Category:</span>
                      <span className="font-medium text-gray-900">{weightCategory}</span>
                    </div>
                  </div>
                </div>

                {/* Record */}
                <div className="ml-6 text-right">
                  <div className="text-xs text-gray-600 mb-1">Record</div>
                  <div className={`text-2xl font-bold text-${recordColor}-600`}>
                    {formatRecord(fighter.record)}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
