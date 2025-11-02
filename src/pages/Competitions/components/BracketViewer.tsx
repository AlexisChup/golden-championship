import { useRef, useEffect, useState } from 'react'
import type { BracketMetadata, Matches } from '../../../types/Bracket'
import { BracketHeader } from './BracketViewer/BracketHeader'
import { EmptyBracketState } from './BracketViewer/EmptyBracketState'
import { BracketVisualization } from './BracketViewer/BracketVisualization'
import { BracketInfoSection } from './BracketViewer/BracketInfoSection'

interface BracketViewerProps {
  bracket: BracketMetadata
  matches: Matches
  onBack: () => void
  onEdit?: () => void
}

export default function BracketViewer({ bracket, matches, onBack, onEdit }: BracketViewerProps) {
  const canEdit = bracket.status !== 'locked' && !!onEdit

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(rect.width - 48, 500), // -48 for padding (p-6 = 24px * 2)
          height: Math.max(rect.height - 48, 500),
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="space-y-6">
      <BracketHeader
        bracket={bracket}
        matchCount={matches.length}
        canEdit={canEdit}
        onBack={onBack}
        onEdit={onEdit}
      />

      {matches.length === 0 ? (
        <EmptyBracketState />
      ) : (
        <BracketVisualization
          ref={containerRef}
          matches={matches}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}

      <BracketInfoSection bracket={bracket} />
    </div>
  )
}
