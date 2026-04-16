import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { AgentStatusGrid } from '../components/dashboard/AgentStatusGrid'
import { ProgressTimeline } from '../components/dashboard/ProgressTimeline'
import { LiveLogs } from '../components/dashboard/LiveLogs'
import { GlowButton } from '../components/shared/GlowButton'

export function DashboardPage() {
  const { sessionId, isComplete, isRunning, agentStatuses, input } = useConferenceStore()
  const navigate = useNavigate()

  useWebSocket(sessionId)
  useAgentStatus(sessionId)

  useEffect(() => {
    if (!sessionId) navigate('/')
  }, [sessionId, navigate])

  // Auto-navigate to results when all agents complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => navigate('/results'), 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, navigate])

  const agents = Object.values(agentStatuses)
  const completedCount = agents.filter(a => a.status === 'completed').length
  const runningCount = agents.filter(a => a.status === 'running').length
  const totalProgress = agents.reduce((sum, a) => sum + (a.progress || 0), 0) / Math.max(agents.length, 1)

  return (
    <div className="p-6 space-y-6 animate-page-in">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Agent Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {input
              ? `${input.category} · ${input.geography} · ${input.audience_size.toLocaleString()} attendees`
              : 'Waiting for input…'}
          </p>
        </div>

        {isComplete && (
          <GlowButton onClick={() => navigate('/results')} size="sm">
            View Results
          </GlowButton>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Completed',
            value: `${completedCount} / 7`,
            color: 'var(--accent-green)',
          },
          {
            label: 'Running',
            value: runningCount,
            color: 'var(--accent-indigo)',
          },
          {
            label: 'Progress',
            value: `${Math.round(totalProgress)}%`,
            color: 'var(--accent-purple)',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-dim)' }}
            >
              {stat.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Phase timeline sidebar */}
        <div
          className="w-44 flex-shrink-0 rounded-xl p-4"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-4"
            style={{ color: 'var(--text-dim)' }}
          >
            Phases
          </p>
          <ProgressTimeline />
        </div>

        {/* Agent grid */}
        <div className="flex-1 space-y-6">
          <AgentStatusGrid />

          {/* Live logs */}
          <div className="mt-6">
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-dim)' }}
            >
              Live Logs
            </p>
            <LiveLogs />
          </div>
        </div>
      </div>

      {/* Completion banner */}
      {isComplete && (
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(87,204,153,0.3)',
            animation: 'fade-in-up 0.4s var(--ease-out-expo) forwards',
          }}
        >
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--accent-green)' }}>
              All 7 agents completed
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Your complete conference plan is ready to view.
            </p>
          </div>
          <GlowButton onClick={() => navigate('/results')} size="md">
            View Results
          </GlowButton>
        </div>
      )}

      {/* Idle state */}
      {!isRunning && !isComplete && (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No active session</p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            Go to <strong style={{ color: 'var(--accent-indigo)' }}>New Plan</strong> to generate a conference.
          </p>
        </div>
      )}
    </div>
  )
}
