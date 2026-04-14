import React from 'react'
import clsx from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, style, hover = true, glow = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card p-6',
        hover && 'cursor-pointer',
        glow && 'agent-running',
        className,
      )}
      style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', ...style }}
    >
      {children}
    </div>
  )
}
