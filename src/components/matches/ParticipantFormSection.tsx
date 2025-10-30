import type { Fighter } from '../../types/Fighter'
import type { LibraryParticipantStatus } from '../../types/Match'
import { RESULT_TYPES } from '../../constants/matchOptions'

type ParticipantFormSectionProps = {
  participantNumber: 1 | 2
  fighters: Fighter[]
  selectedFighterId: string
  displayName: string
  resultText: string
  isWinner: boolean
  status: LibraryParticipantStatus
  errors: Record<string, string>
  onFighterChange: (fighterId: string) => void
  onDisplayNameChange: (name: string) => void
  onResultTextChange: (result: string) => void
  onWinnerChange: (isWinner: boolean) => void
}

export const ParticipantFormSection = ({
  participantNumber,
  fighters,
  selectedFighterId,
  displayName,
  resultText,
  isWinner,
  errors,
  onFighterChange,
  onDisplayNameChange,
  onResultTextChange,
  onWinnerChange,
}: ParticipantFormSectionProps) => {
  const bgColor = participantNumber === 1 ? 'bg-blue-50' : 'bg-green-50'
  const fighterIdKey = `participant${participantNumber}Id`
  const winnerKey = `participant${participantNumber}IsWinner`

  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Participant {participantNumber}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fighter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fighter <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedFighterId}
            onChange={(e) => onFighterChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors[fighterIdKey] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Fighter</option>
            {fighters.map(fighter => (
              <option key={fighter.id} value={fighter.id.toString()}>
                {fighter.firstName} {fighter.lastName}
              </option>
            ))}
          </select>
          {errors[fighterIdKey] && (
            <p className="text-red-500 text-sm mt-1">{errors[fighterIdKey]}</p>
          )}
        </div>

        {/* Display Name (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name (Optional)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="Leave empty for default"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Result Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result
          </label>
          <select
            value={resultText}
            onChange={(e) => onResultTextChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No Result</option>
            {RESULT_TYPES.map(result => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>
        </div>

        {/* Is Winner */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`participant${participantNumber}IsWinner`}
            checked={isWinner}
            onChange={(e) => onWinnerChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={`participant${participantNumber}IsWinner`} className="ml-2 text-sm font-medium text-gray-700">
            Is Winner
          </label>
          {errors[winnerKey] && (
            <p className="text-red-500 text-sm ml-2">{errors[winnerKey]}</p>
          )}
        </div>
      </div>
    </div>
  )
}
