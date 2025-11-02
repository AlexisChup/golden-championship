import { memo } from 'react'

export const EmptyBracketState = memo(() => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No bracket data available</h3>
      <p className="text-sm text-gray-600">
        This bracket has not been generated yet or data is missing.
      </p>
    </div>
  )
})

EmptyBracketState.displayName = 'EmptyBracketState'
