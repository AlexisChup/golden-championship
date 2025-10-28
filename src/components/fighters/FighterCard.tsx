import { Link } from 'react-router-dom'
import type { Fighter } from '../../types/Fighter'
import { calculateAge, getWeightCategory, formatRecord, getRecordColor } from '../../types/Fighter'

interface FighterCardProps {
  fighter: Fighter
}

export const FighterCard = ({ fighter }: FighterCardProps) => {
  const age = calculateAge(fighter.birthDate)
  const weightCategory = getWeightCategory(fighter.weight)
  const recordColor = getRecordColor(fighter.record)

  return (
    <Link
      to={`/fighters/${fighter.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {fighter.firstName} {fighter.lastName}
          </h3>
          {fighter.nickname && (
            <p className="text-sm text-gray-600 italic">"{fighter.nickname}"</p>
          )}
        </div>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Club:</span>
            <span className="font-medium text-gray-900">{fighter.club}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discipline:</span>
            <span className="font-medium text-blue-600">{fighter.discipline}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Age:</span>
            <span className="font-medium text-gray-900">{age} years</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium text-gray-900">{weightCategory}</span>
          </div>
        </div>

        {/* Record */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Record:</span>
            <span className={`font-bold text-lg text-${recordColor}-600`}>
              {formatRecord(fighter.record)}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 h-1"></div>
    </Link>
  )
}
