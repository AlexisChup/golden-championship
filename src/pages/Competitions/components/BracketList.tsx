import { useState } from 'react'
import type { BracketMetadata } from '../../../types/Bracket'
import type { Discipline } from '../../../types/common'
import { getDivisionLabel } from '../../../types/Bracket'
import { BracketListHeader } from './BracketList/BracketListHeader'
import { BracketFilters } from './BracketList/BracketFilters'
import { BracketTable } from './BracketList/BracketTable'
import { EmptyBracketState } from './BracketList/EmptyBracketState'

interface BracketListProps {
  brackets: BracketMetadata[]
  onCreateNew: () => void
  onView: (bracket: BracketMetadata) => void
  onEdit: (bracket: BracketMetadata) => void
  onDelete: (bracket: BracketMetadata) => void
}

export default function BracketList({
  brackets,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
}: BracketListProps) {
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('')
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | ''>('')
  const [weightClassFilter, setWeightClassFilter] = useState<string>('')
  const [genderFilter, setGenderFilter] = useState<'M' | 'F' | 'Open' | ''>('')

  // Get unique filter options from brackets
  const uniqueAgeGroups = Array.from(new Set(brackets.map((b) => b.division.ageGroup))).sort()
  const uniqueDisciplines = Array.from(new Set(brackets.map((b) => b.division.discipline))).sort()
  const uniqueWeightClasses = Array.from(
    new Set(brackets.map((b) => b.division.weightClass))
  ).sort()
  const uniqueGenders = Array.from(new Set(brackets.map((b) => b.division.gender))).sort()

  // Filter brackets
  const filteredBrackets = brackets.filter((bracket) => {
    if (ageGroupFilter && bracket.division.ageGroup !== ageGroupFilter) return false
    if (disciplineFilter && bracket.division.discipline !== disciplineFilter) return false
    if (weightClassFilter && bracket.division.weightClass !== weightClassFilter) return false
    if (genderFilter && bracket.division.gender !== genderFilter) return false
    return true
  })

  const handleDelete = (bracket: BracketMetadata) => {
    if (
      window.confirm(
        `Are you sure you want to delete the bracket for "${getDivisionLabel(bracket.division)}"?`
      )
    ) {
      onDelete(bracket)
    }
  }

  const clearFilters = () => {
    setAgeGroupFilter('')
    setDisciplineFilter('')
    setWeightClassFilter('')
    setGenderFilter('')
  }

  const hasActiveFilters = !!(ageGroupFilter || disciplineFilter || weightClassFilter || genderFilter)

  return (
    <div className="space-y-6">
      <BracketListHeader bracketsCount={brackets.length} onCreateNew={onCreateNew} />

      <BracketFilters
        ageGroupFilter={ageGroupFilter}
        disciplineFilter={disciplineFilter}
        weightClassFilter={weightClassFilter}
        genderFilter={genderFilter}
        uniqueAgeGroups={uniqueAgeGroups}
        uniqueDisciplines={uniqueDisciplines}
        uniqueWeightClasses={uniqueWeightClasses}
        uniqueGenders={uniqueGenders}
        hasActiveFilters={hasActiveFilters}
        showFilters={brackets.length > 0}
        onAgeGroupChange={setAgeGroupFilter}
        onDisciplineChange={setDisciplineFilter}
        onWeightClassChange={setWeightClassFilter}
        onGenderChange={setGenderFilter}
        onClearFilters={clearFilters}
      />

      {filteredBrackets.length === 0 ? (
        <EmptyBracketState hasActiveFilters={hasActiveFilters} onCreateNew={onCreateNew} />
      ) : (
        <BracketTable
          brackets={filteredBrackets}
          onView={onView}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
