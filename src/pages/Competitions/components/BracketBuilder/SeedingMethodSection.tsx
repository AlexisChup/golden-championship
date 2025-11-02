import React from 'react'
import type { SeedMethod } from '../../../../types/Bracket'

interface SeedingMethodSectionProps {
  seedMethod: SeedMethod
  canEdit: boolean
  onSeedMethodChange: (method: SeedMethod) => void
}

export const SeedingMethodSection = React.memo(({
  seedMethod,
  canEdit,
  onSeedMethodChange,
}: SeedingMethodSectionProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">Seeding Method</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['ranking', 'random', 'manual'] as const).map((method) => (
          <label
            key={method}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              seedMethod === method
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } ${!canEdit ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <input
              type="radio"
              name="seedMethod"
              value={method}
              checked={seedMethod === method}
              onChange={(e) => onSeedMethodChange(e.target.value as SeedMethod)}
              disabled={!canEdit}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 capitalize">{method}</div>
              <div className="text-xs text-gray-500">
                {method === 'ranking' && 'Use current order'}
                {method === 'random' && 'Random seeding'}
                {method === 'manual' && 'Custom order'}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
})

SeedingMethodSection.displayName = 'SeedingMethodSection'
