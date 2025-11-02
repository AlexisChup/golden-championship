import React from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface ClearAllCardProps {
  isLoading: boolean
  onClearAll: () => void
}

const ClearAllCardComponent: React.FC<ClearAllCardProps> = ({ isLoading, onClearAll }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Clear All Data</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Permanently delete all clubs, fighters, competitions, and brackets
        </p>
        <Button
          onClick={onClearAll}
          disabled={isLoading}
          variant="primary"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {isLoading ? 'Clearing...' : 'Clear All Data'}
        </Button>
      </div>
    </Card>
  )
}

ClearAllCardComponent.displayName = 'ClearAllCard'

export const ClearAllCard = React.memo(ClearAllCardComponent)
