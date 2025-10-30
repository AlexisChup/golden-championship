import { memo } from 'react'

interface ClubDisciplineSectionProps {
  club: string
  discipline: string
}

export const ClubDisciplineSection = memo(({
  club,
  discipline
}: ClubDisciplineSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Club & Discipline</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Club:</span>
          <span className="font-medium text-gray-900">{club}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discipline:</span>
          <span className="font-medium text-blue-600">{discipline}</span>
        </div>
      </div>
    </div>
  )
})

ClubDisciplineSection.displayName = 'ClubDisciplineSection'
