import React from 'react'
import type { Fighter } from '../../../types/Fighter'
import type { Discipline } from '../../../types/common'
import { ALL_DISCIPLINES } from '../../../constants/disciplines'
import { Button } from '../../../components/ui/Button'

interface AddFighterFormProps {
  fighters: Fighter[]
  selectedFighter: number | ''
  selectedDiscipline: Discipline | ''
  onFighterChange: (fighterId: number | '') => void
  onDisciplineChange: (discipline: Discipline | '') => void
  onSubmit: (e: React.FormEvent) => void
}

const AddFighterFormComponent: React.FC<AddFighterFormProps> = ({
  fighters,
  selectedFighter,
  selectedDiscipline,
  onFighterChange,
  onDisciplineChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fighter *</label>
          <select
            value={selectedFighter}
            onChange={e => onFighterChange(Number(e.target.value) || '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select...</option>
            {fighters.map(fighter => (
              <option key={fighter.id} value={fighter.id}>
                {fighter.firstName} {fighter.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discipline *</label>
          <select
            value={selectedDiscipline}
            onChange={e => onDisciplineChange(e.target.value as Discipline)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select...</option>
            {ALL_DISCIPLINES.map(discipline => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" variant="primary" size="md" className="w-full">
            Add
          </Button>
        </div>
      </div>
    </form>
  )
}

AddFighterFormComponent.displayName = 'AddFighterForm'

export const AddFighterForm = React.memo(AddFighterFormComponent)
