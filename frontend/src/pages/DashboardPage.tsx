import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { useDemoSimulation } from '../hooks/useDemoSimulation'
import { AgentStatusGrid } from '../components/dashboard/AgentStatusGrid'
import { ProgressTimeline } from '../components/dashboard/ProgressTimeline'
import { LiveLogs } from '../components/dashboard/LiveLogs'
import { SparkleButton } from '../components/shared/SparkleButton'

function StatTile({ label, value, unit, tone }: { label: string; value: string; unit?: string; tone: string }) {
  return (
    <div
      className="flex-1 rounded-2xl px-5 py-4"
      style={{ background: 'var(--ink-raise)', border: '1px solid var(--line)', minWidth: 0 }}
    >
      <p className="kicker" style={{ fontSize: '0.6rem' }}>{label}</p>
      <p className="mt-1.5 flex items-baseline gap-1.5">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.03em', color: tone }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--faint)' }}>{unit}</span>}
      </p>
    </div>
  )
}

export function DashboardPage() {
  const { sessionId, isComplete, isRunning, agentStatuses, input } = useConferenceStore()
  const navigate = useNavigate()

  const isDemo = sessionId?.startsWith('demo_') ?? false

  useWebSocket(isDemo ? null : sessionId)
  useAgentStatus(isDemo ? null : sessionId)
  useDemoSimulation(isDemo ? sessionId : null)

  useEffect(() => {
    if (!sessionId) navigate('/')
  }, [sessionId, navigate])

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
    <div className="p-4 md:p-7 space-y-5 md:space-y-6 animate-page-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker">Step 02 — The Floor</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', letterSpacing: '-0.03em', color: 'var(--chalk)', marginTop: '0.35rem' }}>
            Agents at work
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--haze)' }}>
            {input
              ? <>{input.category} · {input.geography} · {input.audience_size.toLocaleString()} attendees</>
              : isDemo
                ? 'Pre-generated demo · seven agents replaying a finished run'
                : 'Waiting for a brief…'}
          </p>
        </div>

        {isComplete && <SparkleButton onClick={() => navigate('/results')} label="View the plan" />}
      </div>

      {/* Stat strip */}
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        <StatTile label="Wrapped" value={`${completedCount}/7`} unit="agents" tone="var(--mint)" />
        <StatTile label="On air" value={`${runningCount}`} unit="now" tone="var(--ember)" />
        <StatTile label="Completion" value={`${Math.round(totalProgress)}`} unit="%" tone="var(--iris)" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Run of show — phases */}
        <div
          className="md:w-64 flex-shrink-0 rounded-2xl p-5"
          style={{ background: 'var(--ink-raise)', border: '1px solid var(--line)' }}
        >
          <p className="kicker mb-5">Run of show</p>
          <ProgressTimeline />
        </div>

        {/* Agent board */}
        <div className="flex-1 space-y-6 min-w-0">
          <AgentStatusGrid />

          {/* Live logs */}
          <div>
            <p className="kicker mb-3">Live feed</p>
            <LiveLogs />
          </div>
        </div>
      </div>

      {/* Completion banner */}
      {isComplete && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            background: 'color-mix(in srgb, var(--mint) 8%, var(--ink-raise))',
            border: '1px solid color-mix(in srgb, var(--mint) 35%, transparent)',
            animation: 'fade-in-up 0.4s var(--ease-out-expo) forwards',
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--mint)' }}>
              That's a wrap — all 7 agents done
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--haze)' }}>
              Your complete conference plan is ready to read and export.
            </p>
          </div>
          <SparkleButton onClick={() => navigate('/results')} label="View the plan" />
        </div>
      )}

      {/* Idle state */}
      {!isRunning && !isComplete && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ background: 'var(--ink-raise)', border: '1px dashed var(--line)' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--haze)', marginBottom: 4 }}>No active session</p>
          <p className="text-sm" style={{ color: 'var(--faint)' }}>
            Head to <strong style={{ color: 'var(--ember)' }}>The Brief</strong> to open the floor.
          </p>
        </div>
      )}
    </div>
  )
}
