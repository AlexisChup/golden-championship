import { useParams, useNavigate } from 'react-router-dom'
import { useClubs } from '../../contexts/ClubsContext'
import { ClubForm } from '../../components/clubs/ClubForm'
import toast from 'react-hot-toast'
import type { Club } from '../../types/Club'

export default function ClubEditForm() {
  const { id } = useParams<{ id: string }>()
  
  const navigate = useNavigate()
  const { getClubById, updateClub, addClub } = useClubs()

  const isNew = id === undefined || id === 'new'
  const club = isNew ? undefined : getClubById(Number(id))

  if (!isNew && !club) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Club Not Found</h2>
            <p className="text-gray-600 mb-6">The club you're trying to edit doesn't exist.</p>
            <button
              onClick={() => navigate('/clubs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Clubs List
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: Omit<Club, 'id' | 'fighters'>) => {
    if (isNew) {
      const newId = addClub(data)
      toast.success('Club added successfully!')
      navigate(`/clubs/${newId}`)
    } else {
      updateClub(Number(id), data)
      toast.success('Club updated successfully!')
      navigate(`/clubs/${id}`)
    }
  }

  const handleCancel = () => {
    navigate(isNew ? '/clubs' : `/clubs/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isNew ? 'Add New Club' : 'Edit Club'}
          </h1>
          <p className="text-gray-600">
            {isNew ? 'Fill in the details to register a new club' : `Update information for ${club?.name}`}
          </p>
        </div>

        {/* Form */}
        <ClubForm
          initialData={club}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isNew ? 'Add Club' : 'Save Changes'}
        />
      </div>
    </div>
  )
}
