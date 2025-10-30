import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { useClubs } from '../../contexts/ClubsContext'
import { FighterStats } from '../../components/fighters/FighterStats'
import { calculateAge, getWeightCategory } from '../../types/Fighter'
import { Icon } from '../../components/icons/Icon'
import { FighterHeader } from './components/FighterHeader'
import { PersonalInfoSection } from './components/PersonalInfoSection'
import { ClubDisciplineSection } from './components/ClubDisciplineSection'
import { FighterClubCard } from './components/FighterClubCard'

export default function FighterDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getFighterById, deleteFighter } = useFighters()
  const { clubs } = useClubs()

  const fighter = getFighterById(Number(id))
  
  // Get the club based on fighter.clubId
  const club = fighter?.clubId ? clubs.find(c => c.id === fighter.clubId) ?? null : null

  if (!fighter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fighter Not Found</h2>
            <p className="text-gray-600 mb-6">
              The fighter you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/fighters"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Fighters List
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const age = calculateAge(fighter.birthDate)
  const weightCategory = getWeightCategory(fighter.weight)

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${fighter.firstName} ${fighter.lastName}?`)) {
      deleteFighter(fighter.id)
      navigate('/fighters')
    }
  }

  const handleResetData = () => {
    if (confirm('Reset local data for Clubs/Fighters?')) {
      localStorage.removeItem('fighters_data')
      localStorage.removeItem('clubs_data')
      localStorage.removeItem('competitions_data')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/fighters"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <Icon name="chevron-left" size={20} className="mr-2" />
          Back to Fighters
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <FighterHeader
            firstName={fighter.firstName}
            lastName={fighter.lastName}
            nickname={fighter.nickname}
            fighterId={fighter.id}
            onDelete={handleDelete}
            showResetButton={import.meta.env.DEV}
            onReset={handleResetData}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoSection
              age={age}
              birthDate={fighter.birthDate}
              height={fighter.height}
              weight={fighter.weight}
              weightCategory={weightCategory}
            />

            <ClubDisciplineSection
              club={fighter.club}
              discipline={fighter.discipline}
            />
          </div>
        </div>

        {/* Stats Card */}
        <FighterStats record={fighter.record} />

        {/* Club Card */}
        <FighterClubCard club={club} clubId={fighter.clubId} />
      </div>
    </div>
  )
}
