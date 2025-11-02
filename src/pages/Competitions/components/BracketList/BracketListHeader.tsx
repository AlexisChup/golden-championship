import React from 'react'
import { Button } from '../../../../components/ui/Button'
import { Icon } from '../../../../components/icons/Icon'

interface BracketListHeaderProps {
  bracketsCount: number
  onCreateNew: () => void
}

export const BracketListHeader = React.memo(({
  bracketsCount,
  onCreateNew,
}: BracketListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Tournament Brackets</h3>
        <p className="text-sm text-gray-600 mt-1">
          {bracketsCount} bracket{bracketsCount !== 1 ? 's' : ''} total
        </p>
      </div>
      <Button variant="primary" size="md" onClick={onCreateNew}>
        <Icon name="plus" size={20} className="mr-2" />
        Create Bracket
      </Button>
    </div>
  )
})

BracketListHeader.displayName = 'BracketListHeader'
