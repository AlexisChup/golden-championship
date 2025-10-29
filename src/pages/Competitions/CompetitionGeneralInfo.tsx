import { useOutletContext } from 'react-router-dom'
import type { Competition } from '../../types/Competition'
import { formatDate } from '../../utils/competitions'

export default function CompetitionGeneralInfo() {
  const { competition } = useOutletContext<{ competition: Competition }>()

  return (
    <div className="space-y-6">
      {/* Description */}
      {competition.description && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{competition.description}</p>
        </div>
      )}

      {/* Address */}
      {competition.address && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
          <p className="text-gray-700">{competition.address}</p>
        </div>
      )}

      {/* Contact */}
      {(competition.contactName || competition.contactEmail || competition.contactPhone) && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Contact</h3>
          <div className="space-y-1">
            {competition.contactName && (
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {competition.contactName}
              </p>
            )}
            {competition.contactEmail && (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${competition.contactEmail}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {competition.contactEmail}
                </a>
              </p>
            )}
            {competition.contactPhone && (
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {competition.contactPhone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Registration Deadline */}
      {competition.registrationDate && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Registration Deadline</h3>
          <p className="text-gray-700">{formatDate(competition.registrationDate)}</p>
        </div>
      )}
    </div>
  )
}
