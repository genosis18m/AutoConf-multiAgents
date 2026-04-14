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
  
  // Custom theme colors per status
  const borderColor = isRunning ? 'rgba(0,229,255,0.4)' : isDone ? 'rgba(0,230,118,0.25)' : isFailed ? 'rgba(255,82,82,0.3)' : 'rgba(255,255,255,0.05)'
  const bgGradient = isRunning ? 'linear-gradient(145deg, rgba(0,229,255,0.05) 0%, rgba(10,12,16,0.8) 100%)' :
                     isDone ? 'linear-gradient(145deg, rgba(0,230,118,0.03) 0%, rgba(10,12,16,0.8) 100%)' :
                     'var(--bg-glass)'

  return (
    <div
      className={clsx(
        'glass-card flex flex-col justify-between stagger-child relative overflow-hidden',
        isRunning && 'agent-running shadow-cyan',
        isDone && 'shadow-green',
      )}
      style={{ 
        animationDelay: `${delay}ms`, 
        borderColor,
        background: bgGradient,
        padding: '24px',
        minHeight: '140px',
        boxShadow: isRunning ? '0 0 20px rgba(0,229,255,0.1)' : 'none'
      }}
    >
      {/* Edge-to-edge Glowing Progress Bar at Bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1" 
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${status.progress}%`,
            background: isRunning ? 'linear-gradient(90deg, #0088FF, #00E5FF)' : isDone ? '#00E676' : 'transparent',
            boxShadow: isRunning ? '0 0 10px #00E5FF, 0 0 5px #0088FF' : isDone ? '0 0 8px #00E676' : 'none'
          }}
        />
      </div>

      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {AGENT_ICONS[agent]}
            </div>
            <div>
              <p className="text-base font-bold tracking-wide" style={{ color: isDone ? '#fff' : 'var(--text-primary)' }}>
                {AGENT_LABELS[agent]}
              </p>
              <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'var(--accent-purple)', opacity: 0.8 }}>
                Agent {['sponsor','speaker','ticketing','venue','pricing','gtm','ops'].indexOf(agent) + 1}
              </p>
            </div>
          </div>
          <StatusBadge status={status.status} />
        </div>

        {/* Message */}
        <div className="mt-4 flex items-center gap-2">
          {isRunning && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan"></span>
            </span>
          )}
          <p
            className="text-xs font-medium truncate"
            style={{ color: isRunning ? 'var(--accent-cyan)' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {status.message || (status.status === 'queued' ? 'Awaiting execution sequence...' : status.status === 'completed' ? 'Tasks successfully completed' : '—')}
          </p>
        </div>
      </div>
    </div>
  )
}
