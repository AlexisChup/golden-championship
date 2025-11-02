import React from 'react'
import type { Fighter } from '../../../../types/Fighter'
import { Button } from '../../../../components/ui/Button'

interface FighterSelectionSectionProps {
  eligibleFighters: Fighter[]
  selectedFighterIds: number[]
  canEdit: boolean
  onToggleFighter: (fighterId: number) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export const FighterSelectionSection = React.memo(({
  eligibleFighters,
  selectedFighterIds,
  canEdit,
  onToggleFighter,
  onSelectAll,
  onDeselectAll,
}: FighterSelectionSectionProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-900">
          Select Fighters ({selectedFighterIds.length} selected)
        </h4>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSelectAll}
            disabled={!canEdit || eligibleFighters.length === 0}
          >
            Select All
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDeselectAll}
            disabled={!canEdit || selectedFighterIds.length === 0}
          >
            Deselect All
          </Button>
        </div>
      </div>

      {eligibleFighters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No eligible fighters for this division.</p>
          <p className="text-xs mt-1">Try selecting different criteria above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {eligibleFighters.map((fighter) => {
            const isSelected = selectedFighterIds.includes(fighter.id)
            return (
              <label
                key={fighter.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${!canEdit ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleFighter(fighter.id)}
                  disabled={!canEdit}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {fighter.firstName} {fighter.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fighter.weight}kg • {fighter.discipline}
                  </div>
                </div>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
})

FighterSelectionSection.displayName = 'FighterSelectionSection'
