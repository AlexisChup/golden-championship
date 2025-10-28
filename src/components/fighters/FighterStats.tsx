import type { FighterRecord } from '../../types/Fighter'
import { formatRecord, getRecordColor } from '../../types/Fighter'

interface FighterStatsProps {
  record: FighterRecord
}

export const FighterStats = ({ record }: FighterStatsProps) => {
  const recordColor = getRecordColor(record)
  const totalFights = record.wins + record.losses + record.draws
  const winRate = totalFights > 0 ? ((record.wins / totalFights) * 100).toFixed(1) : '0.0'

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Fighter Statistics</h3>

      {/* Overall Record */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Overall Record:</span>
          <span className={`text-2xl font-bold text-${recordColor}-600`}>
            {formatRecord(record)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Win Rate:</span>
          <span className="text-lg font-semibold text-gray-900">{winRate}%</span>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-3">
        {/* Wins */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Wins</span>
            <span className="text-sm font-medium text-green-600">{record.wins}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalFights > 0 ? `${(record.wins / totalFights) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Losses */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Losses</span>
            <span className="text-sm font-medium text-red-600">{record.losses}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalFights > 0 ? `${(record.losses / totalFights) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Draws */}
        {record.draws > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Draws</span>
              <span className="text-sm font-medium text-gray-600">{record.draws}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                style={{ width: totalFights > 0 ? `${(record.draws / totalFights) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Total Fights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Fights:</span>
          <span className="text-xl font-bold text-gray-900">{totalFights}</span>
        </div>
      </div>
    </div>
  )
}
