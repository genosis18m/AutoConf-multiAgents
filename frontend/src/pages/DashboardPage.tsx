import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { AgentStatusGrid } from '../components/dashboard/AgentStatusGrid'
import { ProgressTimeline } from '../components/dashboard/ProgressTimeline'
import { LiveLogs } from '../components/dashboard/LiveLogs'
import { GlowButton } from '../components/shared/GlowButton'
import { BarChart3, Cpu, Clock, CheckCircle2, Zap } from 'lucide-react'

export function DashboardPage() {
  const { sessionId, isComplete, isRunning, agentStatuses, input } = useConferenceStore()
  const navigate = useNavigate()

  useWebSocket(sessionId)
  useAgentStatus(sessionId)

  useEffect(() => {
    if (!sessionId) navigate('/')
  }, [sessionId, navigate])

  const agents = Object.values(agentStatuses)
  const completedCount = agents.filter(a => a.status === 'completed').length
  const runningCount = agents.filter(a => a.status === 'running').length
  const totalProgress = agents.reduce((sum, a) => sum + (a.progress || 0), 0) / Math.max(agents.length, 1)

  return (
    <div className="p-6 space-y-6 animate-page-in">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.12)' }}>
              <Cpu size={15} color="#00E5FF" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Agent Dashboard
            </h1>
          </div>
          <p className="text-sm pl-10" style={{ color: 'var(--text-secondary)' }}>
            {input
              ? `${input.category} · ${input.geography} · ${input.audience_size.toLocaleString()} attendees`
              : 'Waiting for input...'}
          </p>
        </div>

        {isComplete && (
          <GlowButton onClick={() => navigate('/results')} size="sm">
            <BarChart3 size={15} />
            View Results
          </GlowButton>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: <CheckCircle2 size={16} color="#00E676" />,
            label: 'Completed',
            value: `${completedCount} / 7`,
            color: '#00E676',
            bg: 'rgba(0,230,118,0.07)',
          },
          {
            icon: <Zap size={16} color="#00E5FF" />,
            label: 'Running',
            value: runningCount,
            color: '#00E5FF',
            bg: 'rgba(0,229,255,0.07)',
          },
          {
            icon: <Clock size={16} color="#B388FF" />,
            label: 'Overall Progress',
            value: `${Math.round(totalProgress)}%`,
            color: '#B388FF',
            bg: 'rgba(179,136,255,0.07)',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: stat.bg, border: `1px solid ${stat.color}22` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Phase timeline sidebar */}
        <div
          className="w-44 flex-shrink-0 rounded-xl p-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
            Phases
          </p>
          <ProgressTimeline />
        </div>

        {/* Agent grid */}
        <div className="flex-1 space-y-6">
          <AgentStatusGrid />

          {/* Live logs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              Live Logs
            </p>
            <LiveLogs />
          </div>
        </div>
      </div>

      {/* Completion banner */}
      {isComplete && (
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(0,230,118,0.10) 0%, rgba(0,229,255,0.06) 100%)',
            border: '1px solid rgba(0,230,118,0.35)',
            animation: 'fade-in-up 0.5s var(--ease-out-expo) forwards',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,230,118,0.15)' }}>
              <CheckCircle2 size={20} color="#00E676" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: '#00E676' }}>All 7 agents completed!</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Your complete conference plan is ready to view.
              </p>
            </div>
          </div>
          <GlowButton onClick={() => navigate('/results')} size="md">
            <BarChart3 size={16} />
            View Full Results
          </GlowButton>
        </div>
      )}

      {/* Idle state — no session running yet */}
      {!isRunning && !isComplete && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)' }}
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.08)' }}>
            <Cpu size={22} color="var(--text-dim)" />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No active session</p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            Go to <strong style={{ color: 'var(--accent-cyan)' }}>New Plan</strong> to generate a conference.
          </p>
        </div>
      )}
    </div>
  )
}
