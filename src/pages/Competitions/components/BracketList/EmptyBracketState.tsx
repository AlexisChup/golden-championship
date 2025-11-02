import React from 'react'
import { Button } from '../../../../components/ui/Button'
import { Icon } from '../../../../components/icons/Icon'

interface EmptyBracketStateProps {
  hasActiveFilters: boolean
  onCreateNew: () => void
}

export const EmptyBracketState = React.memo(({
  hasActiveFilters,
  onCreateNew,
}: EmptyBracketStateProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasActiveFilters ? 'No brackets match your filters' : 'No brackets yet'}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        {hasActiveFilters
          ? 'Try adjusting your filters or create a new bracket.'
          : 'Get started by creating your first tournament bracket.'}
      </p>
      {!hasActiveFilters && (
        <Button variant="primary" size="md" onClick={onCreateNew}>
          <Icon name="plus" size={20} className="mr-2" />
          Create Bracket
        </Button>
      )}
    </div>
  )
})

EmptyBracketState.displayName = 'EmptyBracketState'
