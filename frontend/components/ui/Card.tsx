import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...props
}: CardProps) {
  const baseStyle = 'premium-card'
  const hoverStyle = hoverable ? 'premium-card-hover hover:cursor-pointer' : ''

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  }

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
