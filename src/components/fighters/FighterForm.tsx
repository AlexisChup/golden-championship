import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Fighter } from '../../types/Fighter'
import { getWeightCategory } from '../../types/Fighter'
import { useClubs } from '../../contexts/RepositoryContext'
import { Gender } from '../../constants/enums'
import { PersonalInfoSection } from './FighterForm/PersonalInfoSection'
import { ClubDisciplineSection } from './FighterForm/ClubDisciplineSection'
import { PhysicalStatsSection } from './FighterForm/PhysicalStatsSection'
import { FightRecordSection } from './FighterForm/FightRecordSection'

interface FighterFormProps {
  initialData?: Fighter
  onSubmit: (fighter: Omit<Fighter, 'id'>) => void
  onCancel: () => void
  submitLabel?: string
}

export const FighterForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Fighter',
}: FighterFormProps) => {
  const { clubs } = useClubs()

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    nickname: initialData?.nickname || '',
    club: initialData?.club || '',
    clubId: initialData?.clubId ?? null,
    birthDate: initialData?.birthDate || '',
    height: initialData?.height || 0,
    weight: initialData?.weight || 0,
    discipline: initialData?.discipline || 'K1' as const,
    gender: initialData?.gender || Gender.Male,
    record: {
      wins: initialData?.record.wins || 0,
      losses: initialData?.record.losses || 0,
      draws: initialData?.record.draws || 0,
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name.startsWith('record.')) {
      const recordField = name.split('.')[1] as 'wins' | 'losses' | 'draws'
      setFormData(prev => ({
        ...prev,
        record: {
          ...prev.record,
          [recordField]: parseInt(value) || 0,
        },
      }))
    } else if (name === 'height' || name === 'weight') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name === 'clubId') {
      const clubIdValue = value === '' ? null : parseInt(value)
      const selectedClub = clubs.find(c => c.id === clubIdValue)
      setFormData(prev => ({ 
        ...prev, 
        clubId: clubIdValue,
        club: selectedClub?.name || ''
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const weightCategory = getWeightCategory(formData.weight)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoSection
        firstName={formData.firstName}
        lastName={formData.lastName}
        nickname={formData.nickname}
        birthDate={formData.birthDate}
        onChange={handleChange}
      />

      <ClubDisciplineSection
        clubId={formData.clubId}
        club={formData.club}
        discipline={formData.discipline}
        clubs={clubs}
        onChange={handleChange}
      />

      <PhysicalStatsSection
        gender={formData.gender}
        height={formData.height}
        weight={formData.weight}
        weightCategory={weightCategory}
        onChange={handleChange}
      />

      <FightRecordSection
        wins={formData.record.wins}
        losses={formData.record.losses}
        draws={formData.record.draws}
        onChange={handleChange}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
