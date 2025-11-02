import React from 'react'
import { Button } from '../../../../components/ui/Button'
import { Icon } from '../../../../components/icons/Icon'

interface ActionsSectionProps {
  isGenerated: boolean
  canEdit: boolean
  selectedFighterIds: number[]
  onCancel: () => void
  onGenerate: () => void
  onSaveDraft: () => void
  onPublish: () => void
}

export const ActionsSection = React.memo(({
  isGenerated,
  canEdit,
  selectedFighterIds,
  onCancel,
  onGenerate,
  onSaveDraft,
  onPublish,
}: ActionsSectionProps) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <Button variant="secondary" size="md" onClick={onCancel}>
        Cancel
      </Button>
      <div className="flex gap-3">
        {!isGenerated ? (
          <Button
            variant="primary"
            size="md"
            onClick={onGenerate}
            disabled={!canEdit || selectedFighterIds.length < 2}
          >
            <Icon name="play" size={20} className="mr-2" />
            Generate Bracket
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={onSaveDraft}
              disabled={!canEdit}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onPublish}
              disabled={!canEdit}
            >
              Publish Bracket
            </Button>
          </>
        )}
      </div>
    </div>
  )
})

ActionsSection.displayName = 'ActionsSection'
