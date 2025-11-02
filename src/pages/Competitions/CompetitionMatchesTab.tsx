import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { Competition } from '../../types/Competition'
import type { Match } from '../../types/Match'
import { matchesRepo } from '../../data/repositories'
import { fightersRepo } from '../../data/repositories'
import { Button } from '../../components/ui/Button'
import { getMatchSummary } from '../../utils/matchAdapter'
import { getMatchStateLabel, getMatchStateColor } from '../../types/Match'

export default function CompetitionMatchesTab() {
  const { competition } = useOutletContext<{ competition: Competition }>()
  const [matches, setMatches] = useState<Match[]>(() => 
    matchesRepo.listByCompetition(competition.id)
  )
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filterState, setFilterState] = useState<string>('all')
  const [filterBracket, setFilterBracket] = useState<string>('all')

  const refreshMatches = () => {
    setMatches(matchesRepo.listByCompetition(competition.id))
  }

  // Filter matches
  const filteredMatches = matches.filter(match => {
    if (filterState !== 'all' && match.state !== filterState) return false
    if (filterBracket === 'standalone' && match.bracketId !== null) return false
    if (filterBracket === 'assigned' && match.bracketId === null) return false
    return true
  })

  // Group by bracket status
  const standaloneMatches = filteredMatches.filter(m => m.bracketId === null)
  const assignedMatches = filteredMatches.filter(m => m.bracketId !== null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Matches</h2>
          <p className="text-gray-600 mt-1">
            {matches.length} total matches ({standaloneMatches.length} standalone, {assignedMatches.length} in brackets)
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          + Create Match
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All States</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bracket</label>
            <select
              value={filterBracket}
              onChange={(e) => setFilterBracket(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Matches</option>
              <option value="standalone">Standalone Only</option>
              <option value="assigned">In Brackets Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No matches</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new match or generating a bracket.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} onUpdate={refreshMatches} />
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateMatchModal
          competitionId={competition.id}
          onClose={() => setShowCreateForm(false)}
          onCreated={() => {
            setShowCreateForm(false)
            refreshMatches()
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// MATCH CARD COMPONENT
// ============================================================================

interface MatchCardProps {
  match: Match
  onUpdate: () => void
}

function MatchCard({ match }: MatchCardProps) {
  const summary = getMatchSummary(match)
  const stateLabel = getMatchStateLabel(match.state)
  const stateColor = getMatchStateColor(match.state)

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{summary}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${stateColor}`}>
              {stateLabel}
            </span>
            {match.bracketId && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                Bracket #{match.bracketId}
              </span>
            )}
          </div>
          
          {match.name && (
            <p className="text-sm text-gray-600 mb-1">{match.name}</p>
          )}
          
          <div className="flex gap-4 text-sm text-gray-500">
            {match.round !== null && (
              <span>Round {match.round}</span>
            )}
            {match.startTime && (
              <span>{new Date(match.startTime).toLocaleString()}</span>
            )}
          </div>

          {match.outcome && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Outcome: </span>
              <span className="font-medium">{match.outcome.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          {match.state === 'scheduled' && (
            <Button size="sm">
              Record Result
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CREATE MATCH MODAL
// ============================================================================

interface CreateMatchModalProps {
  competitionId: number
  onClose: () => void
  onCreated: () => void
}

function CreateMatchModal({ competitionId, onClose, onCreated }: CreateMatchModalProps) {
  const [fighter1Id, setFighter1Id] = useState<number | null>(null)
  const [fighter2Id, setFighter2Id] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')

  const fighters = fightersRepo.getAll()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fighter1Id || !fighter2Id) {
      alert('Please select both fighters')
      return
    }

    if (fighter1Id === fighter2Id) {
      alert('Fighters must be different')
      return
    }

    matchesRepo.create({
      competitionId,
      bracketId: null,
      round: null,
      nextMatchId: null,
      name: name || null,
      startTime: startTime || null,
      state: 'scheduled',
      outcome: null,
      participants: [
        { fighterId: fighter1Id, isWinner: false, resultText: null, status: 'ready' },
        { fighterId: fighter2Id, isWinner: false, resultText: null, status: 'ready' },
      ],
      notes: null,
    })

    onCreated()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Match</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Title Fight, Exhibition Match"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fighter 1 *
              </label>
              <select
                value={fighter1Id ?? ''}
                onChange={(e) => setFighter1Id(Number(e.target.value) || null)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select Fighter 1</option>
                {fighters.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.firstName} {f.lastName} - {f.discipline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fighter 2 *
              </label>
              <select
                value={fighter2Id ?? ''}
                onChange={(e) => setFighter2Id(Number(e.target.value) || null)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Select Fighter 2</option>
                {fighters.map(f => (
                  <option key={f.id} value={f.id} disabled={f.id === fighter1Id}>
                    {f.firstName} {f.lastName} - {f.discipline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time (optional)
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Match
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
