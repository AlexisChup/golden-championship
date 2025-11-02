import { memo } from 'react'

export const BracketInstructions = memo(() => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Viewing Tournament Bracket</p>
          <p>
            This bracket shows the single-elimination tournament tree. Winners progress to the
            next round. You can pan and zoom to navigate the bracket.
          </p>
        </div>
      </div>
    </div>
  )
})

BracketInstructions.displayName = 'BracketInstructions'
