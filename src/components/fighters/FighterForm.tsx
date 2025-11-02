import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Fighter } from '../../types/Fighter'
import { getWeightCategory } from '../../types/Fighter'
import { useClubs } from '../../contexts/RepositoryContext'
import { ALL_DISCIPLINES } from '../../constants/disciplines'
import { Gender } from '../../constants/enums'

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
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="e.g., The Hammer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date *
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Club & Discipline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Club & Discipline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-1">
              Club *
            </label>
            <select
              id="clubId"
              name="clubId"
              value={formData.clubId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>
                  {club.name} - {club.city}
                </option>
              ))}
            </select>
            {formData.clubId && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: <span className="font-medium">{formData.club}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-1">
              Discipline *
            </label>
            <select
              id="discipline"
              name="discipline"
              value={formData.discipline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ALL_DISCIPLINES.map(discipline => (
                <option key={discipline} value={discipline}>
                  {discipline}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Physical Stats & Gender */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Physical Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={Gender.Male}>Men</option>
              <option value={Gender.Female}>Women</option>
              <option value={Gender.Open}>Open</option>
            </select>
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm) *
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
              required
              min="100"
              max="250"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              required
              min="30"
              max="200"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.weight > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                Category: <span className="font-medium text-blue-600">{weightCategory}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fight Record */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Fight Record</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="record.wins" className="block text-sm font-medium text-gray-700 mb-1">
              Wins
            </label>
            <input
              type="number"
              id="record.wins"
              name="record.wins"
              value={formData.record.wins}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="record.losses" className="block text-sm font-medium text-gray-700 mb-1">
              Losses
            </label>
            <input
              type="number"
              id="record.losses"
              name="record.losses"
              value={formData.record.losses}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="record.draws" className="block text-sm font-medium text-gray-700 mb-1">
              Draws
            </label>
            <input
              type="number"
              id="record.draws"
              name="record.draws"
              value={formData.record.draws}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

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
