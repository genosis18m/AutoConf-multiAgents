import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { useDemoSimulation } from '../hooks/useDemoSimulation'
import { AgentStatusGrid } from '../components/dashboard/AgentStatusGrid'
import { ProgressTimeline } from '../components/dashboard/ProgressTimeline'
import { LiveLogs } from '../components/dashboard/LiveLogs'
import { GlowButton } from '../components/shared/GlowButton'
import { SparkleButton } from '../components/shared/SparkleButton'
import { CreditCardWidget } from '../components/shared/CreditCardWidget'

export function DashboardPage() {
  const { sessionId, isComplete, isRunning, agentStatuses, input } = useConferenceStore()
  const navigate = useNavigate()

  const isDemo = sessionId?.startsWith('demo_') ?? false

  // For real sessions, connect WebSocket and poll status
  useWebSocket(isDemo ? null : sessionId)
  useAgentStatus(isDemo ? null : sessionId)
  // For demo sessions, simulate agent-by-agent animation
  useDemoSimulation(isDemo ? sessionId : null)

  useEffect(() => {
    if (!sessionId) navigate('/')
  }, [sessionId, navigate])

  // Auto-redirect to results when all agents finish
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
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 animate-page-in">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Agent Dashboard
          </h1>
          <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {input
              ? `${input.category} · ${input.geography} · ${input.audience_size.toLocaleString()} attendees`
              : 'Waiting for input…'}
          </p>
        </div>

        {isComplete && (
          <SparkleButton onClick={() => navigate('/results')} label="View Results" />
        )}
      </div>

      {/* Credit Card Stats bar — horizontal scroll on mobile */}
      <div className="flex gap-4 md:gap-6 justify-start md:justify-between items-center overflow-x-auto pb-1 -mx-3 px-3 md:mx-0 md:px-0">
        {[
          {
            label: 'COMPLETED',
            value: `${completedCount} / 7`,
            title: 'AGENTS',
            footerLogo: 'status: online',
          },
          {
            label: 'RUNNING',
            value: `${runningCount}`,
            title: 'ACTIVE',
            footerLogo: 'processing',
          },
          {
            label: 'PROGRESS',
            value: `${Math.round(totalProgress)}%`,
            title: 'COMPLETION',
            footerLogo: 'v7 engine',
          },
        ].map(stat => (
          <div key={stat.title} className="flex-shrink-0 flex justify-center" style={{ minWidth: '260px', maxWidth: '360px' }}>
            <CreditCardWidget 
              title={stat.title}
              subtitle={stat.label}
              value={stat.value}
              footerLogo={stat.footerLogo}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Phase timeline sidebar — collapses to horizontal strip on mobile */}
        <div
          className="md:w-64 flex-shrink-0 rounded-xl p-4 md:p-5"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 md:mb-6"
            style={{ color: 'var(--text-dim)' }}
          >
            Phases
          </p>
          <ProgressTimeline /></div>

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
          <SparkleButton onClick={() => navigate('/results')} label="View Results" />
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
