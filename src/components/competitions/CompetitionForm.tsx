import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Competition } from '../../types/Competition'
import { BasicInfoSection } from './CompetitionForm/BasicInfoSection'
import { DatesSection } from './CompetitionForm/DatesSection'
import { ContactSection } from './CompetitionForm/ContactSection'
import { DisciplinesSection } from './CompetitionForm/DisciplinesSection'

interface CompetitionFormProps {
  initialData?: Competition
  onSubmit: (competition: Omit<Competition, 'id'>) => void
  onCancel: () => void
  submitLabel?: string
}

export const CompetitionForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: CompetitionFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    address: initialData?.address || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    registrationDate: initialData?.registrationDate || '',
    location: initialData?.location || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    contactName: initialData?.contactName || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    description: initialData?.description || '',
    disciplines: initialData?.disciplines || [],
    fighters: initialData?.fighters || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDisciplinesChange = (discipline: string) => {
    setFormData(prev => {
      const disciplines = prev.disciplines.includes(discipline as any)
        ? prev.disciplines.filter(d => d !== discipline)
        : [...prev.disciplines, discipline as any]
      return { ...prev, disciplines }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection
        title={formData.title}
        location={formData.location}
        address={formData.address}
        googleMapsUrl={formData.googleMapsUrl}
        description={formData.description}
        errors={errors}
        onChange={handleChange}
      />

      <DatesSection
        startDate={formData.startDate}
        endDate={formData.endDate}
        registrationDate={formData.registrationDate}
        errors={errors}
        onChange={handleChange}
      />

      <ContactSection
        contactName={formData.contactName}
        contactEmail={formData.contactEmail}
        contactPhone={formData.contactPhone}
        errors={errors}
        onChange={handleChange}
      />

      <DisciplinesSection
        selectedDisciplines={formData.disciplines}
        onDisciplineToggle={handleDisciplinesChange}
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
