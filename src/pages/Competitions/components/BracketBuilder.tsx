import { useState, useEffect } from 'react'
import type { BracketMetadata, Matches, BracketDivision, SeedMethod, BracketStatus } from '../../../types/Bracket'
import type { Fighter } from '../../../types/Fighter'
import type { AgeGroup, Discipline, WeightClass, Gender } from '../../../constants/enums'
import { generateSingleEliminationBracket } from '../../../utils/bracketGeneratorV2'
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

export const BracketBuilder = ({
  competitionId,
  bracketId,
  fighters,
  existingBracket,
  onSave,
  onCancel,
}: BracketBuilderProps) => {
  // Division configuration
  const [discipline, setDiscipline] = useState<Discipline | ''>(existingBracket?.division.discipline || '')
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>(existingBracket?.division.ageGroup || '')
  const [weightClass, setWeightClass] = useState<WeightClass | ''>(existingBracket?.division.weightClass || '')
  const [gender, setGender] = useState<Gender | ''>(existingBracket?.division.gender || '')
  
  // Fighter selection
  const [selectedFighterIds, setSelectedFighterIds] = useState<number[]>(existingBracket?.fighterIds || [])
  const [seedMethod, setSeedMethod] = useState<SeedMethod>(existingBracket?.seedMethod || 'random')
  
  // Generation state
  const [generatedMatches, setGeneratedMatches] = useState<Matches | null>(null)
  const [isGenerated, setIsGenerated] = useState(false)

  // Filter eligible fighters based on division
  const eligibleFighters = fighters.filter(f => {
    if (discipline && f.discipline !== discipline) return false
    // Note: ageGroup and weightClass filtering would require additional fighter properties
    // For now, only filter by discipline and gender
    if (gender && f.gender !== gender) return false
    return true
  })

  // Auto-select eligible fighters when division changes
  useEffect(() => {
    if (!existingBracket) {
      setSelectedFighterIds(eligibleFighters.map(f => f.id))
    }
  }, [discipline, ageGroup, weightClass, gender])

  const handleGenerate = () => {
    if (!discipline || !ageGroup || !weightClass || !gender) {
      toast.error('Please select all division criteria')
      return
    }

    if (selectedFighterIds.length < 2) {
      toast.error('Please select at least 2 fighters')
      return
    }

    try {
      const { matches, topology } = generateSingleEliminationBracket({
        competitionId,
        bracketId: null, // Will be assigned when saved
        fighterIds: selectedFighterIds,
        seedMethod,
        randomSeed: Date.now(),
        startTime: new Date().toISOString(),
        name: `${discipline} - ${weightClass} - ${ageGroup} - ${gender}`,
      })

      setGeneratedMatches(matches) // Store domain matches
      setIsGenerated(true)

      toast.success(`Bracket generated: ${topology.totalMatches} matches, ${topology.totalRounds} rounds`)
    } catch (error) {
      console.error('Bracket generation failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate bracket')
    }
  }

  const handleSave = (status: BracketStatus) => {
    if (!generatedMatches || !isGenerated) {
      toast.error('Please generate the bracket first')
      return
    }

    if (!discipline || !ageGroup || !weightClass || !gender) {
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
      status,
      fighterCount: selectedFighterIds.length,
      fighterIds: selectedFighterIds,
      createdAt: existingBracket?.createdAt || now,
      updatedAt: now,
    }

    onSave(metadata, generatedMatches)
  }

  const handleToggleFighter = (fighterId: number) => {
    setSelectedFighterIds(prev =>
      prev.includes(fighterId)
        ? prev.filter(id => id !== fighterId)
        : [...prev, fighterId]
    )
    setIsGenerated(false)
  }

  const handleSelectAll = () => {
    setSelectedFighterIds(eligibleFighters.map(f => f.id))
    setIsGenerated(false)
  }

  const handleDeselectAll = () => {
    setSelectedFighterIds([])
    setIsGenerated(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {existingBracket ? 'Edit Bracket' : 'Create New Bracket'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure division, select fighters, and generate tournament bracket
        </p>
      </div>

      {/* Division Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Division Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discipline *</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value as Discipline)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!!existingBracket}
            >
              <option value="">Select discipline</option>
              <option value="Muay Thai">Muay Thai</option>
              <option value="Kick Boxing">Kick Boxing</option>
              <option value="Boxe Anglaise">Boxe Anglaise</option>
              <option value="MMA">MMA</option>
              <option value="Savate">Savate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Group *</label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!!existingBracket}
            >
              <option value="">Select age group</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Veteran">Veteran</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight Class *</label>
            <select
              value={weightClass}
              onChange={(e) => setWeightClass(e.target.value as WeightClass)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!!existingBracket}
            >
              <option value="">Select weight class</option>
              <option value="-60kg">-60kg</option>
              <option value="-70kg">-70kg</option>
              <option value="-80kg">-80kg</option>
              <option value="-90kg">-90kg</option>
              <option value="+90kg">+90kg</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!!existingBracket}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fighter Selection */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Fighter Selection ({selectedFighterIds.length}/{eligibleFighters.length})
          </h3>
          <div className="space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Deselect All
            </button>
          </div>
        </div>

        {eligibleFighters.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
            <p className="text-yellow-800">
              No eligible fighters for selected division criteria.
              Please adjust your selection.
            </p>
          </div>
        ) : (
          <div className="border rounded max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-3 py-2"></th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Record</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eligibleFighters.map(fighter => (
                  <tr
                    key={fighter.id}
                    className={selectedFighterIds.includes(fighter.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedFighterIds.includes(fighter.id)}
                        onChange={() => handleToggleFighter(fighter.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">
                      {fighter.firstName} {fighter.lastName}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">{fighter.clubId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Seeding Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Seeding Method</h3>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="random"
              checked={seedMethod === 'random'}
              onChange={(e) => setSeedMethod(e.target.value as SeedMethod)}
              className="mr-2"
            />
            <span className="text-sm">Random</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="ranking"
              checked={seedMethod === 'ranking'}
              onChange={(e) => setSeedMethod(e.target.value as SeedMethod)}
              className="mr-2"
            />
            <span className="text-sm">By Ranking (Win/Loss)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="manual"
              checked={seedMethod === 'manual'}
              onChange={(e) => setSeedMethod(e.target.value as SeedMethod)}
              className="mr-2"
            />
            <span className="text-sm">Manual Order</span>
          </label>
        </div>
      </div>

      {/* Preview Stats */}
      {isGenerated && generatedMatches && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h3 className="font-semibold text-green-900 mb-2">✓ Bracket Generated Successfully</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-700">Fighters:</span>
              <span className="ml-2 font-medium">{selectedFighterIds.length}</span>
            </div>
            <div>
              <span className="text-green-700">Matches:</span>
              <span className="ml-2 font-medium">{generatedMatches.length}</span>
            </div>
            <div>
              <span className="text-green-700">Rounds:</span>
              <span className="ml-2 font-medium">
                {Math.ceil(Math.log2(selectedFighterIds.length))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={!discipline || !ageGroup || !weightClass || !gender || selectedFighterIds.length < 2}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerated ? 'Regenerate' : 'Generate Bracket'}
          </button>

          {isGenerated && (
            <>
              <button
                onClick={() => handleSave('draft')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Publish Bracket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
