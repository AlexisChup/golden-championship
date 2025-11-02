import React from 'react'

interface BracketStats {
  totalMatches: number
  totalRounds: number
  participantSlots: number
  byeCount: number
}

interface PreviewStatsSectionProps {
  stats: BracketStats
}

export const PreviewStatsSection = React.memo(({ stats }: PreviewStatsSectionProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h4 className="text-md font-semibold text-green-900 mb-3">Bracket Generated</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-green-600 font-medium">Total Matches</div>
          <div className="text-green-900 text-lg">{stats.totalMatches}</div>
        </div>
        <div>
          <div className="text-green-600 font-medium">Rounds</div>
          <div className="text-green-900 text-lg">{stats.totalRounds}</div>
        </div>
        <div>
          <div className="text-green-600 font-medium">Participant Slots</div>
          <div className="text-green-900 text-lg">{stats.participantSlots}</div>
        </div>
        <div>
          <div className="text-green-600 font-medium">Byes</div>
          <div className="text-green-900 text-lg">{stats.byeCount}</div>
        </div>
      </div>
    </div>
  )
})

PreviewStatsSection.displayName = 'PreviewStatsSection'
