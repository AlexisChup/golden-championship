import { memo } from 'react'

interface StatsCardProps {
  label: string
  value: number
  color: 'blue' | 'green' | 'purple'
  iconPath: string
}

const colorStyles = {
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  green: {
    text: 'text-green-600',
    bg: 'bg-green-100',
  },
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-100',
  },
}

export const StatsCard = memo(({ label, value, color, iconPath }: StatsCardProps) => {
  const styles = colorStyles[color]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${styles.bg} rounded-full flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  )
})

StatsCard.displayName = 'StatsCard'
