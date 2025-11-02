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
  verifyBracketChain,
  getBracketStats,
} from '../../../utils/bracketGenerator'
import { HeaderSection } from './BracketBuilder/HeaderSection'
import { DivisionConfigSection } from './BracketBuilder/DivisionConfigSection'
import { FighterSelectionSection } from './BracketBuilder/FighterSelectionSection'
import { SeedingMethodSection } from './BracketBuilder/SeedingMethodSection'
import { PreviewStatsSection } from './BracketBuilder/PreviewStatsSection'
import { ActionsSection } from './BracketBuilder/ActionsSection'
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

      // Validate bracket integrity (simple check)
      if (!validateBracketIntegrity(matches)) {
        toast.error('Generated bracket has integrity issues')
        return
      }

      // Verify bracket chain (comprehensive validation)
      const validation = verifyBracketChain(matches)
      if (!validation.ok) {
        console.error('Bracket chain validation failed:')
        validation.errors.forEach((err) => console.error(`  - ${err}`))
        toast.error(`Bracket validation failed: ${validation.errors[0]}`)
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

  const handleSeedMethodChange = (method: SeedMethod) => {
    setSeedMethod(method)
    setIsGenerated(false)
  }

  return (
    <div className="space-y-6">
      <HeaderSection
        isEditing={isEditing}
        onCancel={onCancel}
        isLocked={existingBracket?.status === 'locked'}
      />

      <DivisionConfigSection
        ageGroup={ageGroup}
        discipline={discipline}
        weightClass={weightClass}
        gender={gender}
        availableAgeGroups={availableAgeGroups}
        availableDisciplines={availableDisciplines}
        availableWeightClasses={availableWeightClasses}
        availableGenders={availableGenders}
        canEdit={canEdit}
        onAgeGroupChange={setAgeGroup}
        onDisciplineChange={setDiscipline}
        onWeightClassChange={setWeightClass}
        onGenderChange={setGender}
      />

      <FighterSelectionSection
        eligibleFighters={eligibleFighters}
        selectedFighterIds={selectedFighterIds}
        canEdit={canEdit}
        onToggleFighter={handleToggleFighter}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <SeedingMethodSection
        seedMethod={seedMethod}
        canEdit={canEdit}
        onSeedMethodChange={handleSeedMethodChange}
      />

      {isGenerated && stats && <PreviewStatsSection stats={stats} />}

      <ActionsSection
        isGenerated={isGenerated}
        canEdit={canEdit}
        selectedFighterIds={selectedFighterIds}
        onCancel={onCancel}
        onGenerate={handleGenerate}
        onSaveDraft={() => handleSave('draft')}
        onPublish={() => handleSave('published')}
      />
    </div>
  )
}
