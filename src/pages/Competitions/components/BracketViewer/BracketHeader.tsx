import { memo } from 'react'
import type { BracketMetadata } from '../../../../types/Bracket'
import { getDivisionLabel, getBracketStatusConfig } from '../../../../types/Bracket'
import { Button } from '../../../../components/ui/Button'
import { Badge } from '../../../../components/ui/Badge'
import { Icon } from '../../../../components/icons/Icon'

interface BracketHeaderProps {
  bracket: BracketMetadata
  matchCount: number
  canEdit: boolean
  onBack: () => void
  onEdit?: () => void
}

export const BracketHeader = memo(({ bracket, matchCount, canEdit, onBack, onEdit }: BracketHeaderProps) => {
  const statusConfig = getBracketStatusConfig(bracket.status)

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="secondary" size="sm" onClick={onBack}>
            <Icon name="chevron-left" size={18} className="mr-2" />
            Back to List
          </Button>
          {canEdit && onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Icon name="pencil" size={18} className="mr-2" />
              Edit Bracket
            </Button>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{getDivisionLabel(bracket.division)}</h3>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant="status" className={`${statusConfig.bgClass} ${statusConfig.colorClass}`}>
            {statusConfig.label}
          </Badge>
          <span className="text-sm text-gray-600">{bracket.fighterCount} fighters</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600">{matchCount} matches</span>
        </div>
      </div>
    </div>
  )
})

BracketHeader.displayName = 'BracketHeader'
