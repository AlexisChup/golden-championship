import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'status' | 'info'
  className?: string
}

export const Badge = ({ children, variant = 'info', className = '' }: BadgeProps) => {
  const baseClasses = variant === 'status' 
    ? 'px-3 py-1 rounded-full text-xs font-semibold'
    : 'px-2 py-1 rounded text-xs'

  return <span className={`${baseClasses} ${className}`}>{children}</span>
}
