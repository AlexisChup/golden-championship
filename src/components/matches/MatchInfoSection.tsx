import type { LibraryMatchState } from '../../types/Match'

type MatchInfoSectionProps = {
  name: string
  tournamentRoundText: string
  startTime: string
  state: LibraryMatchState
  nextMatchId: string
  errors: Record<string, string>
  onNameChange: (value: string) => void
  onTournamentRoundTextChange: (value: string) => void
  onStartTimeChange: (value: string) => void
  onStateChange: (value: LibraryMatchState) => void
  onNextMatchIdChange: (value: string) => void
}

export const MatchInfoSection = ({
  name,
  tournamentRoundText,
  startTime,
  state,
  nextMatchId,
  errors,
  onNameChange,
  onTournamentRoundTextChange,
  onStartTimeChange,
  onStateChange,
  onNextMatchIdChange,
}: MatchInfoSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Match Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Match Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Semifinal - Match"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Tournament Round */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tournament Round <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tournamentRoundText}
            onChange={(e) => onTournamentRoundTextChange(e.target.value)}
            placeholder="e.g., 1, 2, 3"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tournamentRoundText ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.tournamentRoundText && (
            <p className="text-red-500 text-sm mt-1">{errors.tournamentRoundText}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={state}
            onChange={(e) => onStateChange(e.target.value as LibraryMatchState)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DONE">Done</option>
            <option value="SCORE_DONE">Score Done</option>
            <option value="NO_SHOW">No Show</option>
            <option value="WALK_OVER">Walk Over</option>
            <option value="NO_PARTY">No Party</option>
          </select>
        </div>

        {/* Next Match ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Match ID (Optional)
          </label>
          <input
            type="number"
            value={nextMatchId}
            onChange={(e) => onNextMatchIdChange(e.target.value)}
            placeholder="Leave empty if final"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
