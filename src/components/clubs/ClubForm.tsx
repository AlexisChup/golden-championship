import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Club } from '../../types/Club'
import { ALL_DISCIPLINES } from '../../constants/disciplines'
import type { Discipline } from '../../types/common'

interface ClubFormProps {
  initialData?: Club
  onSubmit: (club: Omit<Club, 'id'>) => void
  onCancel: () => void
  submitLabel?: string
}

export const ClubForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Club',
}: ClubFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    description: initialData?.description || '',
    disciplines: initialData?.disciplines || [] as Discipline[],
    logoUrl: initialData?.logoUrl || '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.disciplines.length === 0) {
      alert('Please select at least one discipline')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleDiscipline = (discipline: Discipline) => {
    setFormData(prev => ({
      ...prev,
      disciplines: prev.disciplines.includes(discipline)
        ? prev.disciplines.filter(d => d !== discipline)
        : [...prev.disciplines, discipline],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Club Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Scorpions Iași"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="e.g., Iași"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="e.g., Str. Libertății 45"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="text"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="/assets/logos/club-logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your club, its history, achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Disciplines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Disciplines Offered *</h3>
        <p className="text-sm text-gray-600 mb-4">Select all disciplines taught at your club</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ALL_DISCIPLINES.map(discipline => (
            <button
              key={discipline}
              type="button"
              onClick={() => toggleDiscipline(discipline)}
              className={`px-4 py-3 rounded-md border-2 transition-colors ${
                formData.disciplines.includes(discipline)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {discipline}
            </button>
          ))}
        </div>
        {formData.disciplines.length > 0 && (
          <p className="mt-3 text-sm text-gray-600">
            Selected: <span className="font-medium">{formData.disciplines.join(', ')}</span>
          </p>
        )}
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
