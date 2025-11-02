import React from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface ValidateCardProps {
  isLoading: boolean
  onValidate: () => void
}

const ValidateCardComponent: React.FC<ValidateCardProps> = ({ isLoading, onValidate }) => {
  return (
    <Card className="md:col-span-2">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Validate Data Graph</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Check referential integrity: orphaned fighters, invalid club references, broken competition links
        </p>
        <Button
          onClick={onValidate}
          disabled={isLoading}
          variant="secondary"
          className="w-full"
        >
          Run Validation
        </Button>
      </div>
    </Card>
  )
}

ValidateCardComponent.displayName = 'ValidateCard'

export const ValidateCard = React.memo(ValidateCardComponent)
