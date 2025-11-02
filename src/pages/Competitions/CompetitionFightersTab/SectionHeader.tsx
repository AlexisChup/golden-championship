import React from 'react'
import { Button } from '../../../components/ui/Button'

interface SectionHeaderProps {
  fightersCount: number
  showAddFighter: boolean
  onToggleAdd: () => void
}

const SectionHeaderComponent: React.FC<SectionHeaderProps> = ({
  fightersCount,
  showAddFighter,
  onToggleAdd,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-bold text-gray-900">
        Fighter List ({fightersCount})
      </h3>
      <Button
        variant={showAddFighter ? 'secondary' : 'primary'}
        size="md"
        onClick={onToggleAdd}
        className={showAddFighter ? '' : 'bg-green-600 hover:bg-green-700'}
      >
        {showAddFighter ? 'Cancel' : '+ Add Fighter'}
      </Button>
    </div>
  )
}

SectionHeaderComponent.displayName = 'SectionHeader'

export const SectionHeader = React.memo(SectionHeaderComponent)
