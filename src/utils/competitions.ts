import { getCompetitionStatus } from '../types/Competition'

export type CompetitionStatus = 'ongoing' | 'upcoming' | 'past'

export interface StatusConfig {
  label: string
  colorClass: string
  bgClass: string
}

export const statusConfig: Record<CompetitionStatus, StatusConfig> = {
  ongoing: {
    label: 'Ongoing',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100',
  },
  upcoming: {
    label: 'Upcoming',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-100',
  },
  past: {
    label: 'Past',
    colorClass: 'text-gray-700',
    bgClass: 'bg-gray-100',
  },
}

export const getStatusConfig = (
  startDate: string,
  endDate: string
): StatusConfig => {
  const status = getCompetitionStatus(startDate, endDate)
  return statusConfig[status]
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
