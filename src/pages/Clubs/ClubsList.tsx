import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useClubs } from '../../contexts/ClubsContext'
import { useFighters } from '../../contexts/FightersContext'
import { ClubCard } from '../../components/clubs/ClubCard'
import { getUniqueCities } from '../../data/clubsData'

export default function ClubsList() {
  const { clubs } = useClubs()
  const { fighters } = useFighters()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'fighters'>('name')

  const cities = getUniqueCities()

  const handleResetData = () => {
    if (confirm('Reset local data for Clubs/Fighters?')) {
      localStorage.removeItem('fighters_data')
      localStorage.removeItem('clubs_data')
      window.location.reload()
    }
  }

  // Calculate fighters count for each club based on clubId
  const clubsWithCounts = useMemo(() => {
    return clubs.map(club => {
      const fightersCount = fighters.filter(f => f.clubId === club.id).length
      return { ...club, fightersCount }
    })
  }, [clubs, fighters])

  const filteredAndSortedClubs = useMemo(() => {
    let filtered = clubsWithCounts.filter(club => {
      const matchesSearch =
        searchQuery === '' ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCity = selectedCity === 'all' || club.city === selectedCity

      return matchesSearch && matchesCity
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'city':
          return a.city.localeCompare(b.city)
        case 'fighters':
          return b.fightersCount - a.fightersCount
        default:
          return 0
      }
    })

    return filtered
  }, [clubsWithCounts, searchQuery, selectedCity, sortBy])

  const totalFighters = fighters.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Clubs Directory</h1>
              <p className="text-gray-600">
                Browse all registered clubs and their affiliated fighters
              </p>
            </div>
            {import.meta.env.DEV && (
              <button
                onClick={handleResetData}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                aria-label="Reset local data"
              >
                Reset Data
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clubs</p>
                <p className="text-3xl font-bold text-blue-600">{clubs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fighters</p>
                <p className="text-3xl font-bold text-green-600">{totalFighters}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cities</p>
                <p className="text-3xl font-bold text-purple-600">{cities.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search clubs
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or city..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City Filter */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by city
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'name' | 'city' | 'fighters')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="city">City (A-Z)</option>
                <option value="fighters">Fighters (Most)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredAndSortedClubs.length}</span> of{' '}
              <span className="font-semibold">{clubs.length}</span> clubs
            </p>
            <Link
              to="/clubs/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add New Club
            </Link>
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredAndSortedClubs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No clubs found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCity('all')
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
