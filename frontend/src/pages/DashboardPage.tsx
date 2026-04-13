import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { AgentStatusGrid } from '../components/dashboard/AgentStatusGrid'
import { ProgressTimeline } from '../components/dashboard/ProgressTimeline'
import { LiveLogs } from '../components/dashboard/LiveLogs'
import { GlowButton } from '../components/shared/GlowButton'
import { BarChart3, RefreshCw } from 'lucide-react'

export function DashboardPage() {
  const { sessionId, isComplete, input } = useConferenceStore()
  const navigate = useNavigate()

  useWebSocket(sessionId)
  useAgentStatus(sessionId)

  useEffect(() => {
    if (!sessionId) navigate('/')
  }, [sessionId, navigate])

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Agent Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {input ? `${input.category} Conference · ${input.geography} · ${input.audience_size} attendees` : 'Waiting for input...'}
          </p>
        </div>

        {isComplete && (
          <GlowButton onClick={() => navigate('/results')} size="sm">
            <BarChart3 size={15} />
            View Results
          </GlowButton>
        )}
      </div>

      <div className="flex gap-6">
        {/* Phase timeline sidebar */}
        <div
          className="w-44 flex-shrink-0 rounded-xl p-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-dim)' }}>
            Phases
          </p>
          <ProgressTimeline />
        </div>

        {/* Agent grid */}
        <div className="flex-1 space-y-6">
          <AgentStatusGrid />

          {/* Live logs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
              Live Logs
            </p>
            <LiveLogs />
          </div>
        </div>
      </div>

      {/* Completion banner */}
      {isComplete && (
        <div
          className="rounded-xl p-5 flex items-center justify-between animate-fade-in-up"
          style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.3)' }}
        >
          <div>
            <p className="font-semibold" style={{ color: '#00E676' }}>All 7 agents completed!</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Your complete conference plan is ready to view.
            </p>
          </div>
          <GlowButton onClick={() => navigate('/results')} size="md">
            <BarChart3 size={16} />
            View Full Results
          </GlowButton>
        </div>
      )}
    </div>
  )
}
