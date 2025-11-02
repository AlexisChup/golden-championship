import { useState, useMemo } from 'react'
import { useClubs, useFighters } from '../../contexts/RepositoryContext'
import { StatsCard } from './components/StatsCard'
import { ClubsFilters } from './components/ClubsFilters'
import { ClubsGrid } from './components/ClubsGrid'

export default function ClubsList() {
  const { clubs } = useClubs()
  const { fighters } = useFighters()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'fighters'>('name')

  const cities = useMemo(() => {
    const citySet = new Set(clubs.map(c => c.city))
    return Array.from(citySet).sort()
  }, [clubs])

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

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
  }

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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Total Clubs"
            value={clubs.length}
            color="blue"
            iconPath="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
          <StatsCard
            label="Total Fighters"
            value={fighters.length}
            color="green"
            iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
          <StatsCard
            label="Cities"
            value={cities.length}
            color="purple"
            iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
        </div>

        {/* Filters */}
        <ClubsFilters
          searchQuery={searchQuery}
          selectedCity={selectedCity}
          sortBy={sortBy}
          cities={cities}
          filteredCount={filteredAndSortedClubs.length}
          totalCount={clubs.length}
          onSearchChange={setSearchQuery}
          onCityChange={setSelectedCity}
          onSortChange={setSortBy}
        />

        {/* Clubs Grid */}
        <ClubsGrid clubs={filteredAndSortedClubs} onClearFilters={handleClearFilters} />
      </div>
    </div>
  )
}
