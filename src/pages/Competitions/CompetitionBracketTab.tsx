import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { Competition } from '../../types/Competition'
import type { BracketMetadata, Matches } from '../../types/Bracket'
import { useFighters, useBrackets } from '../../contexts/RepositoryContext'
import BracketList from './components/BracketList'
import BracketBuilder from './components/BracketBuilder'
import BracketViewer from './components/BracketViewer'
import toast from 'react-hot-toast'

type ViewMode = 'list' | 'builder' | 'viewer'

interface CompetitionOutletContext {
  competition: Competition
}

/**
 * CompetitionBracketTab - Main bracket management page
 */
export default function CompetitionBracketTab() {
  const { competition } = useOutletContext<CompetitionOutletContext>()
  const { fighters } = useFighters()
  const {
    getBracketsByCompetition,
    getBracketMatches,
    createBracket,
    updateBracket,
    updateBracketMatches,
    deleteBracket,
  } = useBrackets()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [brackets, setBrackets] = useState<BracketMetadata[]>([])
  const [selectedBracket, setSelectedBracket] = useState<BracketMetadata | null>(null)
  const [selectedMatches, setSelectedMatches] = useState<Matches | null>(null)
  const [editingBracket, setEditingBracket] = useState<BracketMetadata | null>(null)
  const [editingMatches, setEditingMatches] = useState<Matches | null>(null)

  // Load brackets on mount
  useEffect(() => {
    loadBrackets()
  }, [competition.id])

  const loadBrackets = () => {
    const loadedBrackets = getBracketsByCompetition(competition.id)
    setBrackets(loadedBrackets)
  }

  const handleCreateNew = () => {
    setEditingBracket(null)
    setEditingMatches(null)
    setViewMode('builder')
  }

  const handleView = (bracket: BracketMetadata) => {
    const matches = getBracketMatches(competition.id, bracket.id)
    setSelectedBracket(bracket)
    setSelectedMatches(matches)
    setViewMode('viewer')
  }

  const handleEdit = (bracket: BracketMetadata) => {
    const matches = getBracketMatches(competition.id, bracket.id)
    setEditingBracket(bracket)
    setEditingMatches(matches)
    setViewMode('builder')
  }

  const handleDelete = (bracket: BracketMetadata) => {
    try {
      deleteBracket(competition.id, bracket.id)
      toast.success('Bracket deleted successfully')
      loadBrackets()
    } catch (error) {
      console.error('Failed to delete bracket:', error)
      toast.error('Failed to delete bracket')
    }
  }

  const handleSave = (metadata: BracketMetadata, matches: Matches) => {
    try {
      if (editingBracket) {
        // Update existing bracket
        updateBracket(competition.id, metadata.id, {
          division: metadata.division,
          fighterIds: metadata.fighterIds,
          seedMethod: metadata.seedMethod,
          status: metadata.status,
        })
        updateBracketMatches(competition.id, metadata.id, matches)
        toast.success('Bracket updated successfully')
      } else {
        // Create new bracket - destructure to get only the data needed
        const bracketData = {
          division: metadata.division,
          fighterIds: metadata.fighterIds,
          seedMethod: metadata.seedMethod,
          status: metadata.status,
        }
        createBracket(competition.id, bracketData, matches)
        toast.success('Bracket created successfully')
      }
      loadBrackets()
      setViewMode('list')
      setEditingBracket(null)
      setEditingMatches(null)
    } catch (error) {
      console.error('Failed to save bracket:', error)
      toast.error('Failed to save bracket')
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setEditingBracket(null)
    setEditingMatches(null)
    setSelectedBracket(null)
    setSelectedMatches(null)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedBracket(null)
    setSelectedMatches(null)
  }

  const handleEditFromViewer = () => {
    if (selectedBracket) {
      setEditingBracket(selectedBracket)
      setEditingMatches(selectedMatches)
      setViewMode('builder')
    }
  }

  // Get competition fighters
  const competitionFighters = fighters.filter((fighter) =>
    competition.fighters.some((cf) => cf.fighterId === fighter.id)
  )

  // Calculate next bracket ID for new bracket creation
  const nextBracketId = brackets.length > 0 ? Math.max(...brackets.map((b) => b.id)) + 1 : 1

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <BracketList
          brackets={brackets}
          onCreateNew={handleCreateNew}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewMode === 'builder' && (
        <BracketBuilder
          competitionId={competition.id}
          bracketId={editingBracket?.id || nextBracketId}
          fighters={competitionFighters}
          existingBracket={editingBracket || undefined}
          existingMatches={editingMatches || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {viewMode === 'viewer' && selectedBracket && selectedMatches && (
        <BracketViewer
          bracket={selectedBracket}
          matches={selectedMatches}
          onBack={handleBackToList}
          onEdit={selectedBracket.status !== 'locked' ? handleEditFromViewer : undefined}
        />
      )}
    </div>
  )
}
