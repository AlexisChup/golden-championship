import React from 'react'

interface WarningBannerProps {
  // No props needed - static warning
}

const WarningBannerComponent: React.FC<WarningBannerProps> = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
      <div className="flex">
        <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Admin Area</h3>
          <p className="text-sm text-yellow-700 mt-1">
            These operations modify global data. Use with caution.
          </p>
        </div>
      </div>
    </div>
  )
}

WarningBannerComponent.displayName = 'WarningBanner'

export const WarningBanner = React.memo(WarningBannerComponent)
