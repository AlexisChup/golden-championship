import type { Discipline } from '../types/common'

/**
 * Get emoji for a specific discipline
 */
export const getDisciplineEmoji = (discipline: Discipline): string => {
  const emojiMap: Record<Discipline, string> = {
    'K1': '🥊',
    'Kickboxing': '🥊',
    'Kickboxing Light': '🥊',
    'Muay Thai': '🥋',
    'MMA': '🤼',
    'Grappling': '🥋',
    'Boxing': '🥊',
  }
  return emojiMap[discipline] || '🥊'
}

/**
 * Get combined emojis for all club disciplines (no duplicates)
 */
export const getClubDisciplinesEmojis = (disciplines: Discipline[]): string => {
  const uniqueEmojis = new Set(disciplines.map(d => getDisciplineEmoji(d)))
  return Array.from(uniqueEmojis).join(' ')
}

/**
 * Get color class for a discipline
 */
export const getDisciplineColor = (discipline: Discipline): string => {
  const colorMap: Record<Discipline, string> = {
    'K1': 'blue',
    'Kickboxing': 'purple',
    'Kickboxing Light': 'indigo',
    'Muay Thai': 'red',
    'MMA': 'green',
    'Grappling': 'yellow',
    'Boxing': 'orange',
  }
  return colorMap[discipline] || 'gray'
}
