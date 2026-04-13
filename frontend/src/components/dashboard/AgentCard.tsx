import clsx from 'clsx'
import { StatusBadge } from '../shared/StatusBadge'
import type { AgentName, AgentStatus } from '../../types'
import { AGENT_ICONS, AGENT_LABELS } from '../../lib/constants'

interface AgentCardProps {
  agent: AgentName
  status: AgentStatus
  delay?: number
}

export function AgentCard({ agent, status, delay = 0 }: AgentCardProps) {
  const isRunning = status.status === 'running'
  const isDone = status.status === 'completed'
  const isFailed = status.status === 'failed'

  return (
    <div
      className={clsx(
        'glass-card p-5 flex flex-col gap-3 stagger-child',
        isRunning && 'agent-running',
        isDone && 'border-accent-green/30',
        isFailed && 'border-red-500/30',
      )}
      style={{ animationDelay: `${delay}ms`, borderColor: isDone ? 'rgba(0,230,118,0.3)' : isFailed ? 'rgba(255,82,82,0.3)' : undefined }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{AGENT_ICONS[agent]}</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {AGENT_LABELS[agent]}
            </p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-dim)' }}>
              Agent {['sponsor','speaker','ticketing','venue','pricing','gtm','ops'].indexOf(agent) + 1}
            </p>
          </div>
        </div>
        <StatusBadge status={status.status} />
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
        <div
          className="h-full rounded-full progress-bar-fill transition-all duration-700"
          style={{ width: `${status.progress}%` }}
        />
      </div>

      {/* Message */}
      <p
        className="text-xs truncate"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
      >
        {status.message || (status.status === 'queued' ? 'Waiting...' : status.status === 'completed' ? 'Complete ✓' : '—')}
      </p>
    </div>
  )
}
