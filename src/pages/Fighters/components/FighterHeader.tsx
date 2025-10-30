import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'

interface FighterHeaderProps {
  firstName: string
  lastName: string
  nickname?: string
  fighterId: number
  onDelete: () => void
  showResetButton?: boolean
  onReset?: () => void
}

export const FighterHeader = memo(({
  firstName,
  lastName,
  nickname,
  fighterId,
  onDelete,
  showResetButton = false,
  onReset
}: FighterHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {firstName} {lastName}
        </h1>
        {nickname && (
          <p className="text-xl text-gray-600 italic">"{nickname}"</p>
        )}
      </div>
      <div className="flex gap-3">
        {showResetButton && onReset && (
          <button
            onClick={onReset}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
            aria-label="Reset local data"
          >
            Reset Data
          </button>
        )}
        <Link to={`/fighters/${fighterId}/edit`}>
          <Button variant="primary" size="md">
            Edit
          </Button>
        </Link>
        <Button variant="danger" size="md" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
})

FighterHeader.displayName = 'FighterHeader'
