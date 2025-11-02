import React from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface DevSeedCardProps {
  isLoading: boolean
  onDevSeed: () => void
}

const DevSeedCardComponent: React.FC<DevSeedCardProps> = ({ isLoading, onDevSeed }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Development Seed</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Generate a small, fast dataset for development (Romanian names, ~5-10 clubs, ~20-30 fighters)
        </p>
        <Button
          onClick={onDevSeed}
          disabled={isLoading}
          variant="primary"
          className="w-full"
        >
          {isLoading ? 'Generating...' : 'Generate Dev Data'}
        </Button>
      </div>
    </Card>
  )
}

DevSeedCardComponent.displayName = 'DevSeedCard'

export const DevSeedCard = React.memo(DevSeedCardComponent)
