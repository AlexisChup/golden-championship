import React from 'react'
import type { Club } from '../../../types/Club'
import { ALL_DISCIPLINES } from '../../../constants/disciplines'

interface ClubDisciplineSectionProps {
  clubId: number | null
  club: string
  discipline: string
  clubs: Club[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const ClubDisciplineSection = React.memo(({
  clubId,
  club,
  discipline,
  clubs,
  onChange,
}: ClubDisciplineSectionProps) => {
  return (
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
            value={clubId || ''}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a club</option>
            {clubs.map(clubItem => (
              <option key={clubItem.id} value={clubItem.id}>
                {clubItem.name} - {clubItem.city}
              </option>
            ))}
          </select>
          {clubId && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: <span className="font-medium">{club}</span>
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
            value={discipline}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ALL_DISCIPLINES.map(disciplineItem => (
              <option key={disciplineItem} value={disciplineItem}>
                {disciplineItem}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})

ClubDisciplineSection.displayName = 'ClubDisciplineSection'
