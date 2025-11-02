import React from 'react'

interface BasicInfoSectionProps {
  title: string
  location: string
  address: string
  googleMapsUrl: string
  description: string
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const BasicInfoSection = React.memo(({
  title,
  location,
  address,
  googleMapsUrl,
  description,
  errors,
  onChange,
}: BasicInfoSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">General Information</h3>
      <div className="grid grid-cols-1 gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
            placeholder="Competition title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location (city/venue)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="e.g., Iași, Sala Polivalentă"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Full Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={onChange}
            placeholder="Street, number, postal code, city"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Google Maps URL */}
        <div>
          <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps URL (optional)
          </label>
          <input
            type="url"
            id="googleMapsUrl"
            name="googleMapsUrl"
            value={googleMapsUrl}
            onChange={onChange}
            placeholder="https://maps.google.com/?q=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            rows={4}
            placeholder="Describe the competition..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
})

BasicInfoSection.displayName = 'BasicInfoSection'
