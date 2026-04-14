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
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        color, bg,
      )}
    >
      {status === 'running' ? (
        <OrbitLoader size={18} label="Agent running" />
      ) : (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            status === 'queued' && 'bg-text-secondary',
            status === 'completed' && 'bg-accent-green',
            status === 'failed' && 'bg-red-400',
            pulse && 'animate-ping',
          )}
        />
      )}
      {label}
    </span>
  )
}
