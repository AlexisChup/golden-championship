import type { ReactElement } from 'react'

type IconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'calendar'
  | 'map-pin'
  | 'users'
  | 'close'
  | 'plus'
  | 'x'
  | 'pencil'
  | 'play'

interface IconProps {
  name: IconName
  size?: number
  className?: string
  title?: string
  strokeWidth?: number
}

const paths: Record<IconName, ReactElement> = {
  'chevron-left': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  ),
  'chevron-right': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  ),
  'map-pin': (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  ),
  plus: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  ),
  x: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  ),
  pencil: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  ),
  play: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
  ),
}

export const Icon = ({ name, size = 20, className = '', title, strokeWidth = 2 }: IconProps) => {
  return (
    <svg
      className={className}
      style={{ width: size, height: size }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden={!title}
      role={title ? 'img' : undefined}
      strokeWidth={strokeWidth}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  )
}
