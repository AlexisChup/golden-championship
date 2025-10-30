import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useMatches } from '../../contexts/MatchesContext'
import type { Competition } from '../../types/Competition'
import type { Match, LibraryMatchState } from '../../types/Match'
import { MatchCard } from '../../components/matches/MatchCard'
import { MatchFormModal } from '../../components/matches/MatchFormModal'
import { MatchFilters } from '../../components/matches/MatchFilters'
import toast from 'react-hot-toast'

export default function CompetitionMatchesTab() {
  const { competition } = useOutletContext<{ competition: Competition }>()
  const { getMatchesByCompetition, addMatch, updateMatch, deleteMatch } = useMatches()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState<LibraryMatchState | ''>('')
  const [ruleTypeFilter, setRuleTypeFilter] = useState('')

  const competitionMatches = getMatchesByCompetition(competition.id.toString())

  // Filtering
  const filteredMatches = competitionMatches.filter(match => {
    // Search filter (match name, participant names, round)
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      match.name.toLowerCase().includes(searchLower) ||
      match.participants[0].name.toLowerCase().includes(searchLower) ||
      match.participants[1].name.toLowerCase().includes(searchLower) ||
      match.tournamentRoundText.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    // State filter
    if (stateFilter && match.state !== stateFilter) return false

    // Rule type filter
    if (ruleTypeFilter && match.meta?.ruleType !== ruleTypeFilter) return false

    return true
  })

  // Sorting: by startTime ascending, then by tournamentRoundText
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const timeA = new Date(a.startTime).getTime()
    const timeB = new Date(b.startTime).getTime()
    if (timeA !== timeB) return timeA - timeB

    return a.tournamentRoundText.localeCompare(b.tournamentRoundText)
  })

  // Extract unique rule types for filter
  const uniqueRuleTypes = Array.from(
    new Set(competitionMatches.map(m => m.meta?.ruleType).filter(Boolean))
  ) as string[]

  const handleAddMatch = (matchData: Omit<Match, 'id'>) => {
    const newId = addMatch(matchData)
    toast.success(`Match #${newId} created`)
    setIsModalOpen(false)
    setEditingMatch(null)
  }

  const handleUpdateMatch = (matchData: Omit<Match, 'id'>) => {
    if (!editingMatch) return
    updateMatch(editingMatch.id, matchData)
    toast.success(`Match #${editingMatch.id} updated`)
    setIsModalOpen(false)
    setEditingMatch(null)
  }

  const handleDeleteMatch = (id: number) => {
    if (window.confirm(`Delete Match #${id}?`)) {
      deleteMatch(id)
      toast.success(`Match #${id} deleted`)
    }
  }

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match)
    setIsModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setEditingMatch(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMatch(null)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStateFilter('')
    setRuleTypeFilter('')
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Match Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">
          Matches ({competitionMatches.length})
        </h3>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          + Add Match
        </button>
      </div>

      {/* Modal for Add/Edit Match */}
      <MatchFormModal
        competitionUuid={competition.id.toString()}
        match={editingMatch}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingMatch ? handleUpdateMatch : handleAddMatch}
      />

      {/* Filters & Search */}
      <MatchFilters
        searchTerm={searchTerm}
        stateFilter={stateFilter}
        ruleTypeFilter={ruleTypeFilter}
        availableRuleTypes={uniqueRuleTypes}
        onSearchChange={setSearchTerm}
        onStateFilterChange={setStateFilter}
        onRuleTypeFilterChange={setRuleTypeFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Matches List */}
      {sortedMatches.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg">
            {competitionMatches.length === 0
              ? 'No matches yet. Add your first match!'
              : 'No matches match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onEdit={handleEditMatch}
              onDelete={handleDeleteMatch}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredMatches.length !== competitionMatches.length && (
        <div className="text-sm text-gray-600 text-center">
          Showing {sortedMatches.length} of {competitionMatches.length} total matches
        </div>
      )}
    </div>
  )
}
