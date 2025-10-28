import { useParams, useNavigate } from 'react-router-dom'
import { useFighters } from '../../contexts/FightersContext'
import { FighterForm } from '../../components/fighters/FighterForm'
import toast from 'react-hot-toast'
import type { Fighter } from '../../types/Fighter'

export default function FighterEditForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getFighterById, updateFighter, addFighter } = useFighters()

  const isNew = id === 'new'
  const fighter = isNew ? undefined : getFighterById(Number(id))

  if (!isNew && !fighter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fighter Not Found</h2>
            <p className="text-gray-600 mb-6">
              The fighter you're trying to edit doesn't exist.
            </p>
            <button
              onClick={() => navigate('/fighters')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Fighters List
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: Omit<Fighter, 'id'>) => {
    if (isNew) {
      addFighter(data)
      toast.success('Fighter added successfully!')
    } else {
      updateFighter(Number(id), data)
      toast.success('Fighter updated successfully!')
    }
    navigate('/fighters')
  }

  const handleCancel = () => {
    navigate(isNew ? '/fighters' : `/fighters/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isNew ? 'Add New Fighter' : 'Edit Fighter'}
          </h1>
          <p className="text-gray-600">
            {isNew
              ? 'Fill in the details to register a new fighter'
              : `Update information for ${fighter?.firstName} ${fighter?.lastName}`}
          </p>
        </div>

        {/* Form */}
        <FighterForm
          initialData={fighter}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={isNew ? 'Add Fighter' : 'Save Changes'}
        />
      </div>
    </div>
  )
}
