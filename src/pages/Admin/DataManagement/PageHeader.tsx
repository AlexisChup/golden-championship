import React from 'react'

interface PageHeaderProps {
  // No props needed - static header
}

const PageHeaderComponent: React.FC<PageHeaderProps> = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Management</h1>
      <p className="text-gray-600">
        Centralized control for seeding, clearing, and validating application data
      </p>
    </div>
  )
}

PageHeaderComponent.displayName = 'PageHeader'

export const PageHeader = React.memo(PageHeaderComponent)
