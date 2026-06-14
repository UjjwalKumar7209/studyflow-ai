import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0F172A]'
  
  const variantStyles = {
    default: 'bg-slate-100 text-slate-900',
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-slate-900',
  }

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
