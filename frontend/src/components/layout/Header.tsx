import { useConferenceStore } from '../../store/useConferenceStore'
import { StatusBadge } from '../shared/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { EventAILLogo } from '../branding/EventAILLogo'

export function Header() {
  const { sessionId, isRunning, isComplete } = useConferenceStore()
  const navigate = useNavigate()

  return (
    <header
      className="h-14 border-b flex items-center justify-between px-6 flex-shrink-0"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <button
        className="flex items-center gap-2.5 group"
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <EventAILLogo
          variant="header"
          className="transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </button>

      <div className="flex items-center gap-3">
        {sessionId && (
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              color: 'var(--text-dim)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {sessionId.slice(0, 8)}
          </span>
        )}
        {isRunning  && <StatusBadge status="running" />}
        {isComplete && <StatusBadge status="completed" />}
      </div>
    </header>
  )
}
