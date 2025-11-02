import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCompetitions } from '../../contexts/RepositoryContext'
import { CompetitionCard } from '../../components/competitions/CompetitionCard'
import { getCompetitionStatus } from '../../types/Competition'
import { ALL_DISCIPLINES } from '../../constants/disciplines'
import { statusConfig } from '../../utils/competitions'

export default function CompetitionsList() {
  const { competitions } = useCompetitions()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')

  // Filter competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(competition => {
      const matchesSearch =
        searchQuery === '' ||
        competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competition.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDiscipline =
        selectedDiscipline === 'all' ||
        competition.disciplines.includes(selectedDiscipline as any)

      return matchesSearch && matchesDiscipline
    })
  }, [competitions, searchQuery, selectedDiscipline])

  // Group by status
  const { ongoing, upcoming, past } = useMemo(() => {
    const grouped = {
      ongoing: [] as typeof competitions,
      upcoming: [] as typeof competitions,
      past: [] as typeof competitions,
    }

    filteredCompetitions.forEach(competition => {
      const status = getCompetitionStatus(competition.startDate, competition.endDate)
      grouped[status].push(competition)
    })

    // Sort upcoming by start date (closest first)
    grouped.upcoming.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )

    // Sort past by end date (most recent first)
    grouped.past.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())

    return grouped
  }, [filteredCompetitions])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Competitions</h1>
              <p className="text-gray-600">
                Discover and participate in fight competitions
              </p>
            </div>
            <Link
              to="/competitions/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              + Add Competition
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Discipline Filter */}
            <div>
              <label
                htmlFor="discipline"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by discipline
              </label>
              <select
                id="discipline"
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All disciplines</option>
                {ALL_DISCIPLINES.map(discipline => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{filteredCompetitions.length}</span> competition(s) found
            </p>
          </div>
        </div>

        {/* Ongoing Competitions */}
        {ongoing.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              {statusConfig.ongoing.label} ({ongoing.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoing.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Competitions */}
        {upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              {statusConfig.upcoming.label} ({upcoming.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </div>
        )}

        {/* Past Competitions */}
        {past.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-3"></span>
              {statusConfig.past.label} ({past.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredCompetitions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No competitions found.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedDiscipline('all')
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
