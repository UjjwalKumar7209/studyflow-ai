import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = '',
  variant = 'rect',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const baseStyle = 'animate-pulse bg-slate-200 border border-slate-300'
  
  const variantStyles = {
    rect: '',
    text: 'h-4 w-full my-1',
    circle: 'rounded-full',
  }

  const customStyle: React.CSSProperties = {
    width: width,
    height: height,
    ...style,
  }

  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      style={customStyle}
      {...props}
    />
  )
}

export default Skeleton
