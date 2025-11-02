import React from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface DiagnosticsCardProps {
  isLoading: boolean
  onDiagnostics: () => void
}

const DiagnosticsCardComponent: React.FC<DiagnosticsCardProps> = ({ isLoading, onDiagnostics }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Repository Diagnostics</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Print entity counts and storage estimates to browser console
        </p>
        <Button
          onClick={onDiagnostics}
          disabled={isLoading}
          variant="secondary"
          className="w-full"
        >
          Print Diagnostics
        </Button>
      </div>
    </Card>
  )
}

DiagnosticsCardComponent.displayName = 'DiagnosticsCard'

export const DiagnosticsCard = React.memo(DiagnosticsCardComponent)
