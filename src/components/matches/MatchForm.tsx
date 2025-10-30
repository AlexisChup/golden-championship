import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Match, LibraryMatchState, MatchParticipant } from '../../types/Match'
import { useFighters } from '../../contexts/FightersContext'
import { MatchInfoSection } from './MatchInfoSection'
import { ParticipantFormSection } from './ParticipantFormSection'
import { MetaFormSection } from './MetaFormSection'

interface MatchFormProps {
  competitionUuid: string
  initialData?: Match
  onSubmit: (match: Omit<Match, 'id'>) => void
  onCancel: () => void
  submitLabel?: string
}

export const MatchForm = ({
  competitionUuid,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: MatchFormProps) => {
  const { fighters } = useFighters()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    tournamentRoundText: initialData?.tournamentRoundText || '',
    startTime: initialData?.startTime || '',
    state: (initialData?.state || 'DONE') as LibraryMatchState,
    nextMatchId: initialData?.nextMatchId?.toString() || '',
    
    // Participant 1
    participant1Id: initialData?.participants[0]?.id || '',
    participant1Name: initialData?.participants[0]?.name || '',
    participant1IsWinner: initialData?.participants[0]?.isWinner || false,
    participant1ResultText: initialData?.participants[0]?.resultText || '',
    participant1Status: initialData?.participants[0]?.status || null,
    
    // Participant 2
    participant2Id: initialData?.participants[1]?.id || '',
    participant2Name: initialData?.participants[1]?.name || '',
    participant2IsWinner: initialData?.participants[1]?.isWinner || false,
    participant2ResultText: initialData?.participants[1]?.resultText || '',
    participant2Status: initialData?.participants[1]?.status || null,

    // Meta
    ruleType: initialData?.meta?.ruleType || '',
    gender: initialData?.meta?.gender || '',
    ageGroup: initialData?.meta?.ageGroup || '',
    weightClass: initialData?.meta?.weightClass || '',
    ring: initialData?.meta?.ring || '',
    notes: initialData?.meta?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Winner toggle logic: when one is checked, uncheck the other
  const handleParticipant1WinnerChange = (isWinner: boolean) => {
    setFormData(prev => ({
      ...prev,
      participant1IsWinner: isWinner,
      participant2IsWinner: isWinner ? false : prev.participant2IsWinner,
    }))
  }

  const handleParticipant2WinnerChange = (isWinner: boolean) => {
    setFormData(prev => ({
      ...prev,
      participant2IsWinner: isWinner,
      participant1IsWinner: isWinner ? false : prev.participant1IsWinner,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Match name is required'
    }

    if (!formData.tournamentRoundText.trim()) {
      newErrors.tournamentRoundText = 'Tournament round is required'
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }

    if (!formData.participant1Id) {
      newErrors.participant1Id = 'Participant 1 is required'
    }

    if (!formData.participant2Id) {
      newErrors.participant2Id = 'Participant 2 is required'
    }

    if (formData.participant1Id && formData.participant2Id && formData.participant1Id === formData.participant2Id) {
      newErrors.participant2Id = 'Participants must be different fighters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Get fighter names if not provided
    const fighter1 = fighters.find(f => f.id === Number(formData.participant1Id))
    const fighter2 = fighters.find(f => f.id === Number(formData.participant2Id))

    const participant1Name = formData.participant1Name.trim() || 
      (fighter1 ? `${fighter1.firstName} ${fighter1.lastName}` : 'Unknown Fighter')
    const participant2Name = formData.participant2Name.trim() || 
      (fighter2 ? `${fighter2.firstName} ${fighter2.lastName}` : 'Unknown Fighter')

    const participant1: MatchParticipant = {
      id: formData.participant1Id,
      name: participant1Name,
      isWinner: formData.participant1IsWinner,
      resultText: formData.participant1ResultText.trim() || null,
      status: formData.participant1Status,
    }

    const participant2: MatchParticipant = {
      id: formData.participant2Id,
      name: participant2Name,
      isWinner: formData.participant2IsWinner,
      resultText: formData.participant2ResultText.trim() || null,
      status: formData.participant2Status,
    }

    const match: Omit<Match, 'id'> = {
      name: formData.name.trim(),
      tournamentRoundText: formData.tournamentRoundText.trim(),
      startTime: formData.startTime,
      state: formData.state,
      nextMatchId: formData.nextMatchId ? Number(formData.nextMatchId) : null,
      participants: [participant1, participant2],
      meta: {
        competitionUuid,
        ruleType: formData.ruleType.trim() || undefined,
        gender: formData.gender ? (formData.gender as 'Male' | 'Female') : undefined,
        ageGroup: formData.ageGroup.trim() || undefined,
        weightClass: formData.weightClass.trim() || undefined,
        ring: formData.ring.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      },
    }

    onSubmit(match)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Match Info Section */}
      <MatchInfoSection
        name={formData.name}
        tournamentRoundText={formData.tournamentRoundText}
        startTime={formData.startTime}
        state={formData.state}
        nextMatchId={formData.nextMatchId}
        errors={errors}
        onNameChange={(value) => setFormData({ ...formData, name: value })}
        onTournamentRoundTextChange={(value) => setFormData({ ...formData, tournamentRoundText: value })}
        onStartTimeChange={(value) => setFormData({ ...formData, startTime: value })}
        onStateChange={(value) => setFormData({ ...formData, state: value })}
        onNextMatchIdChange={(value) => setFormData({ ...formData, nextMatchId: value })}
      />

      {/* Participant 1 Section */}
      <ParticipantFormSection
        participantNumber={1}
        fighters={fighters}
        selectedFighterId={formData.participant1Id}
        displayName={formData.participant1Name}
        resultText={formData.participant1ResultText}
        isWinner={formData.participant1IsWinner}
        status={formData.participant1Status}
        errors={errors}
        onFighterChange={(value) => setFormData({ ...formData, participant1Id: value })}
        onDisplayNameChange={(value) => setFormData({ ...formData, participant1Name: value })}
        onResultTextChange={(value) => setFormData({ ...formData, participant1ResultText: value })}
        onWinnerChange={handleParticipant1WinnerChange}
      />

      {/* Participant 2 Section */}
      <ParticipantFormSection
        participantNumber={2}
        fighters={fighters}
        selectedFighterId={formData.participant2Id}
        displayName={formData.participant2Name}
        resultText={formData.participant2ResultText}
        isWinner={formData.participant2IsWinner}
        status={formData.participant2Status}
        errors={errors}
        onFighterChange={(value) => setFormData({ ...formData, participant2Id: value })}
        onDisplayNameChange={(value) => setFormData({ ...formData, participant2Name: value })}
        onResultTextChange={(value) => setFormData({ ...formData, participant2ResultText: value })}
        onWinnerChange={handleParticipant2WinnerChange}
      />

      {/* Meta Information Section */}
      <MetaFormSection
        ruleType={formData.ruleType}
        gender={formData.gender}
        ageGroup={formData.ageGroup}
        weightClass={formData.weightClass}
        ring={formData.ring}
        notes={formData.notes}
        onRuleTypeChange={(value) => setFormData({ ...formData, ruleType: value })}
        onGenderChange={(value) => setFormData({ ...formData, gender: value })}
        onAgeGroupChange={(value) => setFormData({ ...formData, ageGroup: value })}
        onWeightClassChange={(value) => setFormData({ ...formData, weightClass: value })}
        onRingChange={(value) => setFormData({ ...formData, ring: value })}
        onNotesChange={(value) => setFormData({ ...formData, notes: value })}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
