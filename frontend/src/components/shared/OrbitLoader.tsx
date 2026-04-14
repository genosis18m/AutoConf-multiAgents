import clsx from 'clsx'
import type { CSSProperties } from 'react'

interface OrbitLoaderProps {
  size?: number
  className?: string
  label?: string
}

export function OrbitLoader({
  size = 72,
  className,
  label = 'Loading',
}: OrbitLoaderProps) {
  const style = { '--orbit-loader-size': `${size}px` } as CSSProperties

  return (
    <div
      className={clsx('orbit-loader', className)}
      style={style}
      role="status"
      aria-label={label}
    >
      <span className="orbit-loader__ring" />
      <span className="orbit-loader__ring" />
      <span className="orbit-loader__ring" />
    </div>
  )
}
