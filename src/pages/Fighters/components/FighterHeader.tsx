import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'

interface FighterHeaderProps {
  firstName: string
  lastName: string
  nickname?: string
  fighterId: number
  onDelete: () => void
}

export const FighterHeader = memo(({
  firstName,
  lastName,
  nickname,
  fighterId,
  onDelete
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
