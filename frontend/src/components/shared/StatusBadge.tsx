import clsx from 'clsx'
import type { AgentStatusType } from '../../types'
import { OrbitLoader } from './OrbitLoader'

const config: Record<AgentStatusType, { label: string; color: string; bg: string; pulse?: boolean }> = {
  queued:    { label: 'Queued',    color: 'text-text-secondary', bg: 'bg-bg-elevated', pulse: false },
  running:   { label: 'Running',   color: 'text-accent-cyan',    bg: 'bg-accent-cyan/10', pulse: true },
  completed: { label: 'Done',      color: 'text-accent-green',   bg: 'bg-accent-green/10', pulse: false },
  failed:    { label: 'Failed',    color: 'text-accent-red',     bg: 'bg-red-500/10', pulse: false },
}

export function StatusBadge({ status }: { status: AgentStatusType }) {
  const { label, color, bg, pulse } = config[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase border transition-all duration-300',
        bg
      )}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: `var(--${color.replace('text-', '')})`,
        borderColor: `var(--${color.replace('text-', '')})`,
        boxShadow: pulse ? `0 0 10px var(--${color.replace('text-', '')}), inset 0 0 5px var(--${color.replace('text-', '')})` : 'none',
        textShadow: pulse ? `0 0 5px var(--${color.replace('text-', '')})` : 'none',
        opacity: status === 'queued' ? 0.7 : 1,
      }}
    >
      {status === 'running' ? (
        <OrbitLoader size={14} label="" />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm"
          style={{ 
            backgroundColor: `var(--${color.replace('text-', '')})`,
            boxShadow: `0 0 4px var(--${color.replace('text-', '')})` 
          }}
        />
      )}
      {label}
    </span>
  )
}
