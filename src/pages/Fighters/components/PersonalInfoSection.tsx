import { memo } from 'react'

interface PersonalInfoSectionProps {
  age: number
  birthDate: string
  height: number
  weight: number
  weightCategory: string
}

export const PersonalInfoSection = memo(({
  age,
  birthDate,
  height,
  weight,
  weightCategory
}: PersonalInfoSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Age:</span>
          <span className="font-medium text-gray-900">{age} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Birth Date:</span>
          <span className="font-medium text-gray-900">
            {new Date(birthDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Height:</span>
          <span className="font-medium text-gray-900">{height} cm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Weight:</span>
          <span className="font-medium text-gray-900">{weight} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Weight Category:</span>
          <span className="font-medium text-blue-600">{weightCategory}</span>
        </div>
      </div>
    </div>
  )
})

PersonalInfoSection.displayName = 'PersonalInfoSection'
