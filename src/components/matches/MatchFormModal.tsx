import { X } from 'lucide-react'
import type { Match } from '../../types/Match'

// MatchForm.legacy removed - component stub only

type MatchFormModalProps = {
  competitionUuid: string
  match: Match | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (match: Omit<Match, 'id'>) => void
}

export const MatchFormModal = ({
  match,
  isOpen,
  onClose,
}: MatchFormModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {match ? 'Edit Match' : 'Add New Match'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-600 text-center py-8">
              Match form temporarily unavailable.
              <br />
              Use the Competition Matches tab to create matches.
            </p>
            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
