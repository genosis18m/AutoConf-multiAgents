import { useConferenceStore } from '../../store/useConferenceStore'
import { StatusBadge } from '../shared/StatusBadge'
import { Zap } from 'lucide-react'

export function Header() {
  const { sessionId, isRunning, isComplete } = useConferenceStore()

  return (
    <header
      className="h-14 border-b flex items-center justify-between px-6 flex-shrink-0"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
          <Zap size={14} color="#00E5FF" />
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
          ConferenceAI
        </span>
      </div>

      {sessionId && (
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Session: {sessionId.slice(0, 8)}
          </span>
          {isRunning && <StatusBadge status="running" />}
          {isComplete && <StatusBadge status="completed" />}
        </div>
      )}
    </header>
  )
}
