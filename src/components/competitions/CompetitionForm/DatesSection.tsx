import React from 'react'

interface DatesSectionProps {
  startDate: string
  endDate: string
  registrationDate: string
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const DatesSection = React.memo(({
  startDate,
  endDate,
  registrationDate,
  errors,
  onChange,
}: DatesSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>

        {/* Registration Date */}
        <div>
          <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Registration Deadline
          </label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            value={registrationDate}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
})

DatesSection.displayName = 'DatesSection'
