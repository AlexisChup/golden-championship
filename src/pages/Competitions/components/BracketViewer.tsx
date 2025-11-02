import { SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets'
import type { BracketMetadata, Matches } from '../../../types/Bracket'
import { getDivisionLabel, getBracketStatusConfig } from '../../../types/Bracket'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Icon } from '../../../components/icons/Icon'

interface BracketViewerProps {
  bracket: BracketMetadata
  matches: Matches
  onBack: () => void
  onEdit?: () => void
}

export default function BracketViewer({ bracket, matches, onBack, onEdit }: BracketViewerProps) {
  const statusConfig = getBracketStatusConfig(bracket.status)
  const canEdit = bracket.status !== 'locked' && onEdit

  // The library expects the matches in their exact format
  // Our BracketMatch type is already compatible with the library's Match type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const libraryMatches = matches as any[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <Icon name="chevron-left" size={18} className="mr-2" />
              Back to List
            </Button>
            {canEdit && (
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
            <span className="text-sm text-gray-600">{matches.length} matches</span>
          </div>
        </div>
      </div>

      {/* Bracket Visualization */}
      {matches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bracket data available</h3>
          <p className="text-sm text-gray-600">
            This bracket has not been generated yet or data is missing.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="w-full overflow-auto">
            <SingleEliminationBracket
              matches={libraryMatches}
              matchComponent={({ match }) => (
                <div className="bg-white border border-gray-300 rounded-md p-3 shadow-sm min-w-[200px]">
                  {/* Match Header */}
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                    {match.name}
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    {match.participants.map((participant, idx) => {
                      const isWinner = participant?.isWinner
                      const isTBD = participant?.id === 'TBD'

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-2 py-1.5 rounded ${
                            isWinner
                              ? 'bg-green-50 border border-green-200'
                              : isTBD
                              ? 'bg-gray-50 border border-gray-200'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <span
                            className={`text-sm truncate ${
                              isWinner
                                ? 'font-semibold text-green-900'
                                : isTBD
                                ? 'text-gray-400 italic'
                                : 'text-gray-700'
                            }`}
                          >
                            {participant?.name || 'TBD'}
                          </span>
                          {isWinner && (
                            <svg
                              className="w-4 h-4 text-green-600 ml-2 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-label="Winner"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Match State */}
                  {match.state && match.state !== 'NO_PARTY' && (
                    <div className="mt-2 text-xs text-gray-500 text-center">{match.state}</div>
                  )}
                </div>
              )}
              svgWrapper={({ children, ...props }) => (
                <SVGViewer
                  {...props}
                  width={1200}
                  height={600}
                  background="white"
                  SVGBackground="white"
                >
                  {children}
                </SVGViewer>
              )}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Viewing Tournament Bracket</p>
                <p>
                  This bracket shows the single-elimination tournament tree. Winners progress to the
                  next round. You can pan and zoom to navigate the bracket.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bracket Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Bracket Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Age Group</div>
            <div className="text-base font-medium text-gray-900">{bracket.division.ageGroup}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Discipline</div>
            <div className="text-base font-medium text-gray-900">{bracket.division.discipline}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Weight Class</div>
            <div className="text-base font-medium text-gray-900">
              {bracket.division.weightClass}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Gender</div>
            <div className="text-base font-medium text-gray-900">
              {bracket.division.gender === 'M'
                ? 'Men'
                : bracket.division.gender === 'F'
                ? 'Women'
                : 'Open'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Seeding Method</div>
            <div className="text-base font-medium text-gray-900 capitalize">
              {bracket.seedMethod}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Created</div>
            <div className="text-base font-medium text-gray-900">
              {new Date(bracket.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
