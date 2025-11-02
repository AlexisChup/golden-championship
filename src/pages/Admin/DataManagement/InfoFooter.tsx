import React from 'react'

interface InfoFooterProps {
  // No props needed - static info
}

const InfoFooterComponent: React.FC<InfoFooterProps> = () => {
  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-blue-800">
        <strong>Tip:</strong> All operations use the repository layer exclusively. 
        Check browser console (F12) for detailed logs and diagnostics.
      </p>
    </div>
  )
}

InfoFooterComponent.displayName = 'InfoFooter'

export const InfoFooter = React.memo(InfoFooterComponent)
