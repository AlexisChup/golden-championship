import React from 'react'
import { ALL_DISCIPLINES } from '../../../constants/disciplines'

interface DisciplinesSectionProps {
  selectedDisciplines: string[]
  onDisciplineToggle: (discipline: string) => void
}

export const DisciplinesSection = React.memo(({
  selectedDisciplines,
  onDisciplineToggle,
}: DisciplinesSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Disciplines Available</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ALL_DISCIPLINES.map(discipline => (
          <label
            key={discipline}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selectedDisciplines.includes(discipline as any)}
              onChange={() => onDisciplineToggle(discipline)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{discipline}</span>
          </label>
        ))}
      </div>
    </div>
  )
})

DisciplinesSection.displayName = 'DisciplinesSection'
