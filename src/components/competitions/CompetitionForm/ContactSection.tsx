import React from 'react'

interface ContactSectionProps {
  contactName: string
  contactEmail: string
  contactPhone: string
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ContactSection = React.memo(({
  contactName,
  contactEmail,
  contactPhone,
  errors,
  onChange,
}: ContactSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={contactName}
            onChange={onChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={contactEmail}
            onChange={onChange}
            placeholder="contact@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={contactPhone}
            onChange={onChange}
            placeholder="+40 xxx xxx xxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
})

ContactSection.displayName = 'ContactSection'
