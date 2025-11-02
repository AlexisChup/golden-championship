import React from 'react'
import { Gender } from '../../../constants/enums'

interface PhysicalStatsSectionProps {
  gender: Gender
  height: number
  weight: number
  weightCategory: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const PhysicalStatsSection = React.memo(({
  gender,
  height,
  weight,
  weightCategory,
  onChange,
}: PhysicalStatsSectionProps) => {
  return (
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
            value={gender}
            onChange={onChange}
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
            value={height || ''}
            onChange={onChange}
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
            value={weight || ''}
            onChange={onChange}
            required
            min="30"
            max="200"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {weight > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              Category: <span className="font-medium text-blue-600">{weightCategory}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

PhysicalStatsSection.displayName = 'PhysicalStatsSection'
