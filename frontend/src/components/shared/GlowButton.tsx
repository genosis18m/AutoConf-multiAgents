import React from 'react'
import clsx from 'clsx'

interface GlowButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function GlowButton({
  children,
  onClick,
  type = 'button',
  disabled,
  loading,
  variant = 'primary',
  className,
  size = 'md',
}: GlowButtonProps) {
  const sizeClasses = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'glow-btn font-semibold transition-all duration-150 flex items-center gap-2',
        sizeClasses[size],
        variant === 'primary' && 'bg-gradient-to-r from-accent-cyan to-cyan-600 text-black',
        variant === 'secondary' && 'bg-bg-elevated border border-border-subtle text-text-primary hover:border-accent-cyan',
        variant === 'ghost' && 'bg-transparent text-accent-cyan border border-accent-cyan hover:bg-accent-cyan/10',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
