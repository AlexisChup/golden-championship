import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useCompetitions } from '../../contexts/CompetitionsContext'
import { useFighters } from '../../contexts/FightersContext'
import type { Competition, CompetitionFighter } from '../../types/Competition'
import type { Discipline } from '../../types/common'
import { ALL_DISCIPLINES } from '../../constants/disciplines'
import toast from 'react-hot-toast'

export default function CompetitionFightersTab() {
  const { competition } = useOutletContext<{ competition: Competition }>()
  const { addFighterToCompetition, removeFighterFromCompetition } = useCompetitions()
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

    addFighterToCompetition(competition.id, fighter)
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
      removeFighterFromCompetition(competition.id, fighter)
      toast.success('Fighter removed')
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Fighter Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">
          Fighter List ({competition.fighters.length})
        </h3>
        <button
          onClick={() => setShowAddFighter(!showAddFighter)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {showAddFighter ? 'Cancel' : '+ Add Fighter'}
        </button>
      </div>

      {/* Add Fighter Form */}
      {showAddFighter && (
        <form
          onSubmit={handleAddFighter}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fighter *</label>
              <select
                value={selectedFighter}
                onChange={e => setSelectedFighter(Number(e.target.value) || '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select...</option>
                {fighters.map(fighter => (
                  <option key={fighter.id} value={fighter.id}>
                    {fighter.firstName} {fighter.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discipline *
              </label>
              <select
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value as Discipline)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select...</option>
                {ALL_DISCIPLINES.map(discipline => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Fighters List */}
      {competition.fighters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No fighters yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fighter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discipline
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competition.fighters.map((fighter, index) => {
                const fighterData = fighters.find(f => f.id === fighter.fighterId)
                
                if (!fighterData) return null

                return (
                  <tr key={`${fighter.fighterId}-${fighter.discipline}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/fighters/${fighterData.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {fighterData.firstName} {fighterData.lastName}
                        {fighterData.nickname && (
                          <span className="text-gray-500 text-sm italic ml-2">
                            "{fighterData.nickname}"
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {fighterData.club}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {fighter.discipline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveFighter(fighter)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
