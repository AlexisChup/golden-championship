import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { FighterCard } from '../../components/fighters/FighterCard'
import { getUniqueDisciplines, getUniqueClubs } from '../../data/fightersData'

export default function FightersList() {
  const { fighters } = useFighters()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [selectedClub, setSelectedClub] = useState<string>('all')

  const disciplines = getUniqueDisciplines()
  const clubs = getUniqueClubs()

  const filteredFighters = useMemo(() => {
    return fighters.filter(fighter => {
      const matchesSearch =
        searchQuery === '' ||
        fighter.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fighter.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fighter.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesDiscipline =
        selectedDiscipline === 'all' || fighter.discipline === selectedDiscipline

      const matchesClub = selectedClub === 'all' || fighter.club === selectedClub

      return matchesSearch && matchesDiscipline && matchesClub
    })
  }, [fighters, searchQuery, selectedDiscipline, selectedClub])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fighters Directory</h1>
          <p className="text-gray-600">
            Browse and manage all registered fighters in the championship
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by name
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search fighters..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Discipline Filter */}
            <div>
              <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by discipline
              </label>
              <select
                id="discipline"
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Disciplines</option>
                {disciplines.map(discipline => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </div>

            {/* Club Filter */}
            <div>
              <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by club
              </label>
              <select
                id="club"
                value={selectedClub}
                onChange={e => setSelectedClub(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Clubs</option>
                {clubs.map(club => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredFighters.length}</span> of{' '}
              <span className="font-semibold">{fighters.length}</span> fighters
            </p>
            <Link
              to="/fighters/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add New Fighter
            </Link>
          </div>
        </div>

        {/* Fighters Grid */}
        {filteredFighters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No fighters found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedDiscipline('all')
                setSelectedClub('all')
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFighters.map(fighter => (
              <FighterCard key={fighter.id} fighter={fighter} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
