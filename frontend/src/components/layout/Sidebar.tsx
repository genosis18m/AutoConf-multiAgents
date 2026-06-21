import { useNavigate, useLocation } from 'react-router-dom'
import { useConferenceStore } from '../../store/useConferenceStore'
import { StatusBadge } from '../shared/StatusBadge'
import { AGENT_LABELS } from '../../lib/constants'
import type { AgentName } from '../../types'

const AGENTS: AgentName[] = ['sponsor', 'speaker', 'ticketing', 'venue', 'pricing', 'gtm', 'ops']

const STATUS_COLORS: Record<string, string> = {
  completed: 'var(--mint)',
  running: 'var(--ember)',
  queued: 'var(--faint)',
  failed: 'var(--accent-red)',
}

// The nav is a real sequence — brief → watch live → read the plan —
// so the step numbers carry order, not decoration.
const NAV_ITEMS = [
  { to: '/', n: '01', label: 'The Brief', sub: 'Set the parameters' },
  { to: '/dashboard', n: '02', label: 'The Floor', sub: 'Agents at work' },
  { to: '/results', n: '03', label: 'The Plan', sub: 'Export-ready' },
]

export function Sidebar() {
  const { agentStatuses, sessionId } = useConferenceStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <aside
      className="w-64 lg:w-72 flex flex-col flex-shrink-0 border-r"
      style={{ background: 'var(--ink-deep)', borderColor: 'var(--line)' }}
    >
      {/* Call sheet header */}
      <div className="px-5 pt-6 pb-3">
        <p className="kicker">Call Sheet</p>
      </div>

      {/* Sequenced nav */}
      <nav className="px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to)
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
              style={{
                background: active ? 'var(--ink-high)' : 'transparent',
                border: `1px solid ${active ? 'var(--line)' : 'transparent'}`,
                boxShadow: active ? 'inset 2px 0 0 var(--ember)' : 'none',
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: active ? 'var(--ember)' : 'var(--faint)',
                  width: 22,
                  flexShrink: 0,
                }}
              >
                {item.n}
              </span>
              <span className="min-w-0">
                <span
                  className="block truncate"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.98rem',
                    letterSpacing: '-0.01em',
                    color: active ? 'var(--chalk)' : 'var(--haze)',
                  }}
                >
                  {item.label}
                </span>
                <span className="block truncate" style={{ fontSize: '0.72rem', color: 'var(--faint)' }}>
                  {item.sub}
                </span>
              </span>
            </button>
          )
        })}
      </nav>

      {/* Departments (agents) */}
      {sessionId && (
        <div className="flex-1 overflow-y-auto px-5 mt-7">
          <p className="kicker mb-3">Departments</p>
          <div className="space-y-0.5">
            {AGENTS.map((agent) => {
              const s = agentStatuses[agent]
              const dotColor = STATUS_COLORS[s?.status] ?? STATUS_COLORS.queued
              const running = s?.status === 'running'
              return (
                <div
                  key={agent}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors"
                  style={{ background: running ? 'rgba(255,106,61,0.07)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: dotColor, boxShadow: running ? `0 0 8px ${dotColor}` : 'none' }}
                    />
                    <span className="text-sm truncate" style={{ color: 'var(--haze)' }}>
                      {AGENT_LABELS[agent]}
                    </span>
                  </div>
                  <StatusBadge status={s?.status} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-auto px-5 py-4 border-t" style={{ borderColor: 'var(--line-soft)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--faint)' }}>
          7 AGENTS · 4 PHASES
        </p>
      </div>
    </aside>
  )
}
