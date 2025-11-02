import { memo, forwardRef } from 'react'
import { Match, SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets'
import type { Matches } from '../../../../types/Bracket'
import { BracketInstructions } from './BracketInstructions'

interface BracketVisualizationProps {
  matches: Matches
  width: number
  height: number
}

export const BracketVisualization = memo(
  forwardRef<HTMLDivElement, BracketVisualizationProps>(({ matches, width, height }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const libraryMatches = matches as any[]

    return (
      <div ref={ref} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="w-full overflow-auto">
          <SingleEliminationBracket
            matches={libraryMatches}
            matchComponent={Match}
            svgWrapper={({ children, ...props }) => (
              <SVGViewer
                {...props}
                width={width}
                height={height}
                background="white"
                SVGBackground="white"
              >
                {children}
              </SVGViewer>
            )}
          />
        </div>

        <BracketInstructions />
      </div>
    )
  })
)

BracketVisualization.displayName = 'BracketVisualization'
