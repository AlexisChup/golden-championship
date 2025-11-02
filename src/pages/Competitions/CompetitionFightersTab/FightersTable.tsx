import React from 'react'
import { Link } from 'react-router-dom'
import type { CompetitionFighter } from '../../../types/Competition'
import type { Fighter } from '../../../types/Fighter'
import { Badge } from '../../../components/ui/Badge'

interface FightersTableProps {
  competitionFighters: CompetitionFighter[]
  fighters: Fighter[]
  onRemove: (fighter: CompetitionFighter) => void
}

const FightersTableComponent: React.FC<FightersTableProps> = ({
  competitionFighters,
  fighters,
  onRemove,
}) => {
  if (competitionFighters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No fighters yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fighter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Club
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discipline
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {competitionFighters.map((fighter, index) => {
            const fighterData = fighters.find(f => f.id === fighter.fighterId)

            if (!fighterData) return null

            return (
              <tr key={`${fighter.fighterId}-${fighter.discipline}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/fighters/${fighterData.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {fighterData.firstName} {fighterData.lastName}
                    {fighterData.nickname && (
                      <span className="text-gray-500 text-sm italic ml-2">
                        "{fighterData.nickname}"
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {fighterData.club}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="info" className="bg-blue-100 text-blue-800">
                    {fighter.discipline}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRemove(fighter)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

FightersTableComponent.displayName = 'FightersTable'

export const FightersTable = React.memo(FightersTableComponent)
