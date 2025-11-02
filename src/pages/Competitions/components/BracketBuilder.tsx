import { useState, useEffect } from 'react'
import type {
  BracketMetadata,
  BracketDivision,
  SeedMethod,
  BracketStatus,
  Matches,
} from '../../../types/Bracket'
import type { Fighter } from '../../../types/Fighter'
import type { AgeGroup, Discipline, WeightClass, Gender } from '../../../constants/enums'
import {
  filterFightersByDivision,
  getUniqueAgeGroups,
  getUniqueDisciplines,
  getUniqueWeightClasses,
  getGenderOptions,
} from '../../../utils/bracketFilters'
import {
  generateSingleEliminationBracket,
  validateBracketIntegrity,
  getBracketStats,
} from '../../../utils/bracketGenerator'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/icons/Icon'
import toast from 'react-hot-toast'

interface BracketBuilderProps {
  competitionId: number
  bracketId: number
  fighters: Fighter[]
  existingBracket?: BracketMetadata
  existingMatches?: Matches
  onSave: (metadata: BracketMetadata, matches: Matches) => void
  onCancel: () => void
}

export default function BracketBuilder({
  competitionId,
  bracketId,
  fighters,
  existingBracket,
  existingMatches,
  onSave,
  onCancel,
}: BracketBuilderProps) {
  const isEditing = !!existingBracket

  // Division state
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>(existingBracket?.division.ageGroup || '')
  const [discipline, setDiscipline] = useState<Discipline | ''>(
    existingBracket?.division.discipline || ''
  )
  const [weightClass, setWeightClass] = useState<WeightClass | ''>(existingBracket?.division.weightClass || '')
  const [gender, setGender] = useState<Gender | ''>(
    existingBracket?.division.gender || ''
  )

  // Seeding and fighters
  const [seedMethod, setSeedMethod] = useState<SeedMethod>(
    existingBracket?.seedMethod || 'ranking'
  )
  const [selectedFighterIds, setSelectedFighterIds] = useState<number[]>(
    existingBracket?.fighterIds || []
  )

  // Generated bracket
  const [generatedMatches, setGeneratedMatches] = useState<Matches | null>(existingMatches || null)
  const [isGenerated, setIsGenerated] = useState<boolean>(!!existingMatches)

  // Get filter options
  const availableAgeGroups = getUniqueAgeGroups(fighters)
  const availableDisciplines = getUniqueDisciplines(fighters)
  const availableWeightClasses = gender ? getUniqueWeightClasses(fighters, gender) : []
  const availableGenders = getGenderOptions()

  // Filter eligible fighters based on current division
  const eligibleFighters = filterFightersByDivision(fighters, {
    ageGroup: ageGroup || undefined,
    discipline: discipline || undefined,
    weightClass: weightClass || undefined,
    gender: gender || undefined,
  })

  // Update weight class options when gender changes
  useEffect(() => {
    if (gender && weightClass) {
      const validWeightClasses = getUniqueWeightClasses(fighters, gender as Gender)
      if (!validWeightClasses.includes(weightClass)) {
        setWeightClass('')
      }
    }
  }, [gender, weightClass, fighters])

  const handleToggleFighter = (fighterId: number) => {
    setSelectedFighterIds((prev) =>
      prev.includes(fighterId) ? prev.filter((id) => id !== fighterId) : [...prev, fighterId]
    )
    setIsGenerated(false) // Reset generation when selection changes
  }

  const handleSelectAll = () => {
    setSelectedFighterIds(eligibleFighters.map((f) => f.id))
    setIsGenerated(false)
  }

  const handleDeselectAll = () => {
    setSelectedFighterIds([])
    setIsGenerated(false)
  }

  const handleGenerate = () => {
    // Validation
    if (!ageGroup || !discipline || !weightClass || !gender) {
      toast.error('Please select all division criteria')
      return
    }

    if (selectedFighterIds.length < 2) {
      toast.error('Please select at least 2 fighters')
      return
    }

    // Create fighter names map
    const fighterNames = new Map<number, string>()
    selectedFighterIds.forEach((id) => {
      const fighter = fighters.find((f) => f.id === id)
      if (fighter) {
        fighterNames.set(id, `${fighter.firstName} ${fighter.lastName}`)
      }
    })

    // Generate bracket
    try {
      const matches = generateSingleEliminationBracket({
        competitionId,
        bracketId,
        fighterIds: selectedFighterIds,
        fighterNames,
        seedMethod,
        randomSeed: Date.now(),
        startTime: new Date().toISOString(),
      })

      if (!validateBracketIntegrity(matches)) {
        toast.error('Generated bracket has integrity issues')
        return
      }

      setGeneratedMatches(matches)
      setIsGenerated(true)

      const stats = getBracketStats(matches)
      toast.success(
        `Bracket generated: ${stats.totalMatches} matches, ${stats.totalRounds} rounds`
      )
    } catch (error) {
      console.error('Bracket generation failed:', error)
      toast.error('Failed to generate bracket')
    }
  }

  const handleSave = (saveStatus: BracketStatus) => {
    if (!generatedMatches || !isGenerated) {
      toast.error('Please generate the bracket first')
      return
    }

    if (!ageGroup || !discipline || !weightClass || !gender) {
      toast.error('Please complete all division fields')
      return
    }

    const division: BracketDivision = {
      ageGroup: ageGroup as AgeGroup,
      discipline: discipline as Discipline,
      weightClass: weightClass as WeightClass,
      gender: gender as Gender,
    }

    const now = new Date().toISOString()
    const metadata: BracketMetadata = {
      id: bracketId,
      competitionId,
      division,
      seedMethod,
      status: saveStatus,
      fighterCount: selectedFighterIds.length,
      fighterIds: selectedFighterIds,
      createdAt: existingBracket?.createdAt || now,
      updatedAt: now,
    }

    onSave(metadata, generatedMatches)
  }

  const canEdit = !existingBracket || existingBracket.status !== 'locked'

  const stats = generatedMatches ? getBracketStats(generatedMatches) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Bracket' : 'Create New Bracket'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure division, select fighters, and generate tournament tree
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <Icon name="x" size={18} className="mr-2" />
          Cancel
        </Button>
      </div>

      {existingBracket?.status === 'locked' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            This bracket is locked and cannot be edited. You can only view it.
          </p>
        </div>
      )}

      {/* Division Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Division Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Age Group */}
          <div>
            <label htmlFor="age-group" className="block text-sm font-medium text-gray-700 mb-2">
              Age Group <span className="text-red-500">*</span>
            </label>
            <select
              id="age-group"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup | '')}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select age group</option>
              {availableAgeGroups.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline */}
          <div>
            <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-2">
              Discipline <span className="text-red-500">*</span>
            </label>
            <select
              id="discipline"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as Discipline | '')}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select discipline</option>
              {availableDisciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'Open' | '')}
              disabled={!canEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select gender</option>
              {availableGenders.map((g) => (
                <option key={g} value={g}>
                  {g === 'M' ? 'Men' : g === 'F' ? 'Women' : 'Open'}
                </option>
              ))}
            </select>
          </div>

          {/* Weight Class */}
          <div>
            <label htmlFor="weight-class" className="block text-sm font-medium text-gray-700 mb-2">
              Weight Class <span className="text-red-500">*</span>
            </label>
            <select
              id="weight-class"
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value as WeightClass | '')}
              disabled={!canEdit || !gender}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select weight class</option>
              {availableWeightClasses.map((wc) => (
                <option key={wc} value={wc}>
                  {wc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fighter Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">
            Select Fighters ({selectedFighterIds.length} selected)
          </h4>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSelectAll}
              disabled={!canEdit || eligibleFighters.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeselectAll}
              disabled={!canEdit || selectedFighterIds.length === 0}
            >
              Deselect All
            </Button>
          </div>
        </div>

        {eligibleFighters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No eligible fighters for this division.</p>
            <p className="text-xs mt-1">Try selecting different criteria above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {eligibleFighters.map((fighter) => {
              const isSelected = selectedFighterIds.includes(fighter.id)
              return (
                <label
                  key={fighter.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } ${!canEdit ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleFighter(fighter.id)}
                    disabled={!canEdit}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {fighter.firstName} {fighter.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {fighter.weight}kg • {fighter.discipline}
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Seeding Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Seeding Method</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['ranking', 'random', 'manual'] as const).map((method) => (
            <label
              key={method}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                seedMethod === method
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } ${!canEdit ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="radio"
                name="seedMethod"
                value={method}
                checked={seedMethod === method}
                onChange={(e) => {
                  setSeedMethod(e.target.value as SeedMethod)
                  setIsGenerated(false)
                }}
                disabled={!canEdit}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 capitalize">{method}</div>
                <div className="text-xs text-gray-500">
                  {method === 'ranking' && 'Use current order'}
                  {method === 'random' && 'Random seeding'}
                  {method === 'manual' && 'Custom order'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preview / Stats */}
      {isGenerated && stats && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-green-900 mb-3">Bracket Generated</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-green-600 font-medium">Total Matches</div>
              <div className="text-green-900 text-lg">{stats.totalMatches}</div>
            </div>
            <div>
              <div className="text-green-600 font-medium">Rounds</div>
              <div className="text-green-900 text-lg">{stats.totalRounds}</div>
            </div>
            <div>
              <div className="text-green-600 font-medium">Participant Slots</div>
              <div className="text-green-900 text-lg">{stats.participantSlots}</div>
            </div>
            <div>
              <div className="text-green-600 font-medium">Byes</div>
              <div className="text-green-900 text-lg">{stats.byeCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-3">
          {!isGenerated ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              disabled={!canEdit || selectedFighterIds.length < 2}
            >
              <Icon name="play" size={20} className="mr-2" />
              Generate Bracket
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleSave('draft')}
                disabled={!canEdit}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSave('published')}
                disabled={!canEdit}
              >
                Publish Bracket
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
