import React from 'react'

interface FightRecordSectionProps {
  wins: number
  losses: number
  draws: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FightRecordSection = React.memo(({
  wins,
  losses,
  draws,
  onChange,
}: FightRecordSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Fight Record</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="record.wins" className="block text-sm font-medium text-gray-700 mb-1">
            Wins
          </label>
          <input
            type="number"
            id="record.wins"
            name="record.wins"
            value={wins}
            onChange={onChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="record.losses" className="block text-sm font-medium text-gray-700 mb-1">
            Losses
          </label>
          <input
            type="number"
            id="record.losses"
            name="record.losses"
            value={losses}
            onChange={onChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="record.draws" className="block text-sm font-medium text-gray-700 mb-1">
            Draws
          </label>
          <input
            type="number"
            id="record.draws"
            name="record.draws"
            value={draws}
            onChange={onChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
})

FightRecordSection.displayName = 'FightRecordSection'
