import React from 'react'
import type { BracketMetadata } from '../../../../types/Bracket'
import { getDivisionLabel, getBracketStatusConfig, getSeedMethodLabel } from '../../../../types/Bracket'
import { Badge } from '../../../../components/ui/Badge'

interface BracketTableProps {
  brackets: BracketMetadata[]
  onView: (bracket: BracketMetadata) => void
  onEdit: (bracket: BracketMetadata) => void
  onDelete: (bracket: BracketMetadata) => void
}

export const BracketTable = React.memo(({
  brackets,
  onView,
  onEdit,
  onDelete,
}: BracketTableProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Division
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participants
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seeding
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {brackets.map((bracket) => {
            const statusConfig = getBracketStatusConfig(bracket.status)
            return (
              <tr key={bracket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getDivisionLabel(bracket.division)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {new Date(bracket.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{bracket.fighterCount} fighters</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {getSeedMethodLabel(bracket.seedMethod)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="status"
                    className={`${statusConfig.bgClass} ${statusConfig.colorClass}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onView(bracket)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label="View bracket"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(bracket)}
                    className="text-gray-600 hover:text-gray-900"
                    aria-label="Edit bracket"
                    disabled={bracket.status === 'locked'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(bracket)}
                    className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    aria-label="Delete bracket"
                    disabled={bracket.status === 'locked'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})

BracketTable.displayName = 'BracketTable'
