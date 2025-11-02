import React from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

interface DemoSeedCardProps {
  isLoading: boolean
  onDemoSeed: () => void
}

const DemoSeedCardComponent: React.FC<DemoSeedCardProps> = ({ isLoading, onDemoSeed }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Demo Seed</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Generate rich demonstration data with pre-built brackets ready for visualization
        </p>
        <Button
          onClick={onDemoSeed}
          disabled={isLoading}
          variant="primary"
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Generating...' : 'Generate Demo Data'}
        </Button>
      </div>
    </Card>
  )
}

DemoSeedCardComponent.displayName = 'DemoSeedCard'

export const DemoSeedCard = React.memo(DemoSeedCardComponent)
