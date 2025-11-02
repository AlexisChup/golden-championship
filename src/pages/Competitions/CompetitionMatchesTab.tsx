import { Link } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import type { Competition } from '../../types/Competition'

export default function CompetitionMatchesTab() {
  const { competition } = useOutletContext<{ competition: Competition }>()

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Matches Now Managed in Brackets</h3>
        <p className="text-gray-700 mb-4">
          Matches are now organized within brackets. Create and manage brackets in the Bracket tab,
          where you can build single-elimination tournaments and track all matches.
        </p>
        <Link
          to={`/competitions/${competition.id}/brackets`}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Go to Brackets
        </Link>
      </div>

      {/* Legacy Note for Dev */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Dev Note:</strong> The legacy MatchesContext has been removed. All match data
            is now stored within bracket structures using the bracketsRepo repository.
          </p>
        </div>
      )}
    </div>
  )
}
