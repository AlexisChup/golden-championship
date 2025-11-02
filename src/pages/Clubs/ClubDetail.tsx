import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useClubs, useFighters } from '../../contexts/RepositoryContext'
import { ClubInfoBlock } from '../../components/clubs/ClubInfoBlock'
import { ClubFightersList } from '../../components/clubs/ClubFightersList'
import { FighterForm } from '../../components/fighters/FighterForm'
import { Modal } from '../../components/Modal'
import toast from 'react-hot-toast'
import type { Fighter } from '../../types/Fighter'

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClubById, deleteClub } = useClubs()
  const { addFighter } = useFighters()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const club = getClubById(Number(id))

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Club Not Found</h2>
            <p className="text-gray-600 mb-6">
              The club you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/clubs"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Clubs List
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${club.name}?`)) {
      deleteClub(club.id)
      navigate('/clubs')
    }
  }

  const handleAddFighter = (fighterData: Omit<Fighter, 'id'>) => {
    // Ensure the fighter is assigned to this club by ID only
    const newFighterData: Omit<Fighter, 'id'> = {
      ...fighterData,
      clubId: club.id,
    }
    const newFighter = addFighter(newFighterData)
    setIsModalOpen(false)
    toast.success(`${fighterData.firstName} ${fighterData.lastName} added to ${club.name}!`)
    // Navigate to the new fighter detail page
    navigate(`/fighters/${newFighter.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/clubs" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clubs
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              {/* Logo placeholder */}
              <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                {club.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{club.name}</h1>
                <p className="text-lg text-gray-600 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {club.city}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/clubs/${club.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Club Info - Left Column */}
          <div className="lg:col-span-1">
            <ClubInfoBlock club={club} />
          </div>

          {/* Fighters List - Right Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Club Fighters</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Fighter
              </button>
            </div>
            <ClubFightersList clubId={club.id} />
          </div>
        </div>

        {/* Add Fighter Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Add Fighter to ${club.name}`}
        >
          <FighterForm
            initialData={{
              id: 0,
              firstName: '',
              lastName: '',
              nickname: '',
              club: club.name,
              clubId: club.id,
              birthDate: '',
              height: 0,
              weight: 0,
              discipline: 'K1',
              gender: 'M',
              record: { wins: 0, losses: 0, draws: 0 }
            }}
            onSubmit={handleAddFighter}
            onCancel={() => setIsModalOpen(false)}
            submitLabel="Add Fighter"
          />
        </Modal>
      </div>
    </div>
  )
}
