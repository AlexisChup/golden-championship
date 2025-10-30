import { Link } from 'react-router-dom'
import type { Match } from '../../types/Match'
import { getMatchStateLabel, getMatchStateColor } from '../../types/Match'
import { useFighters } from '../../contexts/FightersContext'
import { Edit, Trash2, Trophy, Calendar, MapPin } from 'lucide-react'

type MatchCardProps = {
  match: Match
  onEdit: (match: Match) => void
  onDelete: (id: number) => void
}

export const MatchCard = ({ match, onEdit, onDelete }: MatchCardProps) => {
  const { getFighterById } = useFighters()

  const participant1 = match.participants[0]
  const participant2 = match.participants[1]

  console.log("match : " + JSON.stringify(match, null, 2));
  

  // Get fighter details for participant names if needed
  const fighter1 = getFighterById(Number(participant1.id))
  const fighter2 = getFighterById(Number(participant2.id))

  const displayName1 = participant1.name || fighter1?.firstName + ' ' + fighter1?.lastName || 'Unknown Fighter'
  const displayName2 = participant2.name || fighter2?.firstName + ' ' + fighter2?.lastName || 'Unknown Fighter'

  const stateColors = getMatchStateColor(match.state)
  const stateLabel = getMatchStateLabel(match.state)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Header with Round and State */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {match.name}
          </h3>
          {match.tournamentRoundText && (
            <span className="text-sm text-gray-500">
              (Round {match.tournamentRoundText})
            </span>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stateColors.bg} ${stateColors.text}`}>
          {stateLabel}
        </span>
      </div>

      {/* Participants VS Layout */}
      <div className="flex items-center justify-between mb-4">
        {/* Participant 1 */}
        <div className={`flex-1 text-center p-3 rounded-lg ${participant1.isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {participant1.isWinner && <Trophy className="w-4 h-4 text-green-600" />}
            <Link
              to={`/fighters/${participant1.id}`}
              className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              {displayName1}
            </Link>
          </div>
          {participant1.resultText && (
            <span className="text-xs text-gray-600">{participant1.resultText}</span>
          )}
        </div>

        {/* VS Divider */}
        <div className="px-4">
          <span className="text-xl font-bold text-gray-400">VS</span>
        </div>

        {/* Participant 2 */}
        <div className={`flex-1 text-center p-3 rounded-lg ${participant2.isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {participant2.isWinner && <Trophy className="w-4 h-4 text-green-600" />}
            <Link
              to={`/fighters/${participant2.id}`}
              className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              {displayName2}
            </Link>
          </div>
          {participant2.resultText && (
            <span className="text-xs text-gray-600">{participant2.resultText}</span>
          )}
        </div>
      </div>

      {/* Meta Information */}
      {match.meta && (
        <div className="border-t pt-3 mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {match.meta.ruleType && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">Rules:</span> {match.meta.ruleType}
              </div>
            )}
            {match.meta.weightClass && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">Weight:</span> {match.meta.weightClass}
              </div>
            )}
            {match.meta.gender && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">Gender:</span> {match.meta.gender}
              </div>
            )}
            {match.meta.ageGroup && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">Age:</span> {match.meta.ageGroup}
              </div>
            )}
            {match.meta.ring && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                {match.meta.ring}
              </div>
            )}
            {match.startTime && (
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3 h-3" />
                {new Date(match.startTime).toLocaleString()}
              </div>
            )}
          </div>
          {match.meta.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Notes:</span> {match.meta.notes}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t">
        <button
          onClick={() => onEdit(match)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(match.id)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Next Match Info */}
      {match.nextMatchId && (
        <div className="mt-3 pt-3 border-t text-sm text-gray-600">
          <span className="font-medium">Next Match:</span> Match #{match.nextMatchId}
        </div>
      )}
    </div>
  )
}
