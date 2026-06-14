import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  textarea?: boolean
  rows?: number
}

export const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ className = '', label, error, type = 'text', textarea = false, rows = 3, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-xs font-black uppercase tracking-wider text-slate-900">
            {label}
          </label>
        )}
        
        {textarea ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={`premium-input text-sm leading-relaxed rounded-none resize-none ${
              error ? 'border-danger focus:shadow-[4px_4px_0px_0px_var(--color-danger)]' : ''
            } ${className}`}
            {...(props as any)}
          />
        ) : (
          <input
            type={type}
            ref={ref as any}
            className={`premium-input text-sm rounded-none h-11 ${
              error ? 'border-danger focus:shadow-[4px_4px_0px_0px_var(--color-danger)]' : ''
            } ${className}`}
            {...props}
          />
        )}
        
        {error && (
          <span className="text-[11px] font-bold text-danger uppercase tracking-wide">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
