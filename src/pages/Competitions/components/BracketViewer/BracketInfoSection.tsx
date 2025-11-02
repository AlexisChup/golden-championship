import { memo } from 'react'
import type { BracketMetadata } from '../../../../types/Bracket'

interface BracketInfoSectionProps {
  bracket: BracketMetadata
}

export const BracketInfoSection = memo(({ bracket }: BracketInfoSectionProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">Bracket Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-600">Age Group</div>
          <div className="text-base font-medium text-gray-900">{bracket.division.ageGroup}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Discipline</div>
          <div className="text-base font-medium text-gray-900">{bracket.division.discipline}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Weight Class</div>
          <div className="text-base font-medium text-gray-900">
            {bracket.division.weightClass}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Gender</div>
          <div className="text-base font-medium text-gray-900">
            {bracket.division.gender === 'M'
              ? 'Men'
              : bracket.division.gender === 'F'
              ? 'Women'
              : 'Open'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Seeding Method</div>
          <div className="text-base font-medium text-gray-900 capitalize">
            {bracket.seedMethod}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Created</div>
          <div className="text-base font-medium text-gray-900">
            {new Date(bracket.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
})

BracketInfoSection.displayName = 'BracketInfoSection'
