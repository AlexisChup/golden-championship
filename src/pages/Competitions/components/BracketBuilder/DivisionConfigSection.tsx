import React from 'react'
import type { AgeGroup, Discipline, WeightClass, Gender } from '../../../../constants/enums'

interface DivisionConfigSectionProps {
  ageGroup: AgeGroup | ''
  discipline: Discipline | ''
  weightClass: WeightClass | ''
  gender: Gender | ''
  availableAgeGroups: string[]
  availableDisciplines: Discipline[]
  availableWeightClasses: string[]
  availableGenders: ('M' | 'F' | 'Open')[]
  canEdit: boolean
  onAgeGroupChange: (value: AgeGroup | '') => void
  onDisciplineChange: (value: Discipline | '') => void
  onWeightClassChange: (value: WeightClass | '') => void
  onGenderChange: (value: Gender | '') => void
}

export const DivisionConfigSection = React.memo(({
  ageGroup,
  discipline,
  weightClass,
  gender,
  availableAgeGroups,
  availableDisciplines,
  availableWeightClasses,
  availableGenders,
  canEdit,
  onAgeGroupChange,
  onDisciplineChange,
  onWeightClassChange,
  onGenderChange,
}: DivisionConfigSectionProps) => {
  return (
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
            onChange={(e) => onAgeGroupChange(e.target.value as AgeGroup | '')}
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
            onChange={(e) => onDisciplineChange(e.target.value as Discipline | '')}
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
            onChange={(e) => onGenderChange(e.target.value as 'M' | 'F' | 'Open' | '')}
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
            onChange={(e) => onWeightClassChange(e.target.value as WeightClass | '')}
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
  )
})

DivisionConfigSection.displayName = 'DivisionConfigSection'
