import { useParams, useNavigate } from 'react-router-dom'
import { useCompetitions } from '../../contexts/CompetitionsContext'
import { CompetitionForm } from '../../components/competitions/CompetitionForm'
import toast from 'react-hot-toast'
import type { Competition } from '../../types/Competition'

export default function CompetitionEditForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCompetitionById, updateCompetition, addCompetition } = useCompetitions()

  const isNew = id === undefined || id === 'new'
  const competition = isNew ? undefined : getCompetitionById(Number(id))

  if (!isNew && !competition) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Competition not found</h2>
            <p className="text-gray-600 mb-6">
              The competition you are looking for does not exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/competitions')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to list
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: Omit<Competition, 'id'>) => {
    if (isNew) {
      const newId = addCompetition(data)
      toast.success('Competition created successfully!')
      navigate(`/competitions/${newId}/general-info`)
    } else {
      updateCompetition(Number(id), data)
      toast.success('Competition updated!')
      navigate(`/competitions/${id}/general-info`)
    }
  }

  const handleCancel = () => {
    navigate(isNew ? '/competitions' : `/competitions/${id}/general-info`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isNew ? 'New Competition' : 'Edit Competition'}
          </h1>
          <p className="text-gray-600">
            {isNew
              ? 'Fill in the information to create a new competition'
              : `Edit information for ${competition?.title}`}
          </p>
        </div>

        {/* Form */}
        <CompetitionForm
          initialData={competition}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isNew ? 'Create Competition' : 'Save Changes'}
        />
      </div>
    </div>
  )
}
