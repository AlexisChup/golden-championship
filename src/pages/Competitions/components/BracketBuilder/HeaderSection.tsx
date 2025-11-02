import React from 'react'
import { Button } from '../../../../components/ui/Button'
import { Icon } from '../../../../components/icons/Icon'

interface HeaderSectionProps {
  isEditing: boolean
  onCancel: () => void
  isLocked: boolean
}

export const HeaderSection = React.memo(({ isEditing, onCancel, isLocked }: HeaderSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Bracket' : 'Create New Bracket'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure division, select fighters, and generate tournament tree
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <Icon name="x" size={18} className="mr-2" />
          Cancel
        </Button>
      </div>

      {isLocked && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            This bracket is locked and cannot be edited. You can only view it.
          </p>
        </div>
      )}
    </>
  )
})

HeaderSection.displayName = 'HeaderSection'
