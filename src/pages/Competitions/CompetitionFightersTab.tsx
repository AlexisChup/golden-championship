import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useCompetitions, useFighters } from '../../contexts/RepositoryContext'
import type { Competition, CompetitionFighter } from '../../types/Competition'
import type { Discipline } from '../../types/common'
import toast from 'react-hot-toast'
import { SectionHeader } from './CompetitionFightersTab/SectionHeader'
import { AddFighterForm } from './CompetitionFightersTab/AddFighterForm'
import { FightersTable } from './CompetitionFightersTab/FightersTable'

export default function CompetitionFightersTab() {
  const { competition } = useOutletContext<{ competition: Competition }>()
  const { updateCompetition } = useCompetitions()
  const { fighters } = useFighters()
  const [showAddFighter, setShowAddFighter] = useState(false)
  const [selectedFighter, setSelectedFighter] = useState<number | ''>('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | ''>('')

  const handleAddFighter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFighter || !selectedDiscipline) {
      toast.error('Please select a fighter and a discipline')
      return
    }

    const fighter: CompetitionFighter = {
      fighterId: Number(selectedFighter),
      discipline: selectedDiscipline as Discipline,
    }

    updateCompetition(competition.id, {
      fighters: [...competition.fighters, fighter],
    })
    toast.success('Fighter added')
    setSelectedFighter('')
    setSelectedDiscipline('')
    setShowAddFighter(false)
  }

  const handleRemoveFighter = (fighter: CompetitionFighter) => {
    const fighterData = fighters.find(f => f.id === fighter.fighterId)
    if (
      window.confirm(
        `Remove ${fighterData?.firstName} ${fighterData?.lastName} (${fighter.discipline})?`
      )
    ) {
      updateCompetition(competition.id, {
        fighters: competition.fighters.filter(
          (f) => !(f.fighterId === fighter.fighterId && f.discipline === fighter.discipline)
        ),
      })
      toast.success('Fighter removed')
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        fightersCount={competition.fighters.length}
        showAddFighter={showAddFighter}
        onToggleAdd={() => setShowAddFighter(!showAddFighter)}
      />

      {showAddFighter && (
        <AddFighterForm
          fighters={fighters}
          selectedFighter={selectedFighter}
          selectedDiscipline={selectedDiscipline}
          onFighterChange={setSelectedFighter}
          onDisciplineChange={setSelectedDiscipline}
          onSubmit={handleAddFighter}
        />
      )}

      <FightersTable
        competitionFighters={competition.fighters}
        fighters={fighters}
        onRemove={handleRemoveFighter}
      />
    </div>
  )
}
