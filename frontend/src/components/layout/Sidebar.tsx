import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, BarChart3 } from 'lucide-react'
import { useConferenceStore } from '../../store/useConferenceStore'
import { StatusBadge } from '../shared/StatusBadge'
import { AGENT_ICONS, AGENT_LABELS } from '../../lib/constants'
import type { AgentName } from '../../types'
import clsx from 'clsx'

const AGENTS: AgentName[] = ['sponsor', 'speaker', 'ticketing', 'venue', 'pricing', 'gtm', 'ops']

export function Sidebar() {
  const { agentStatuses, sessionId } = useConferenceStore()

  return (
    <aside
      className="w-56 flex flex-col flex-shrink-0 border-r"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Navigation */}
      <nav className="p-3 space-y-1 mt-2">
        {[
          { to: '/', icon: <Home size={15} />, label: 'New Plan' },
          { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
          { to: '/results', icon: <BarChart3 size={15} />, label: 'Results' },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
              )
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Agent status list */}
      {sessionId && (
        <div className="flex-1 overflow-y-auto px-3 mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--text-dim)' }}>
            Agents
          </p>
          <div className="space-y-1">
            {AGENTS.map((agent) => {
              const s = agentStatuses[agent]
              return (
                <div
                  key={agent}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                  style={{ background: s.status === 'running' ? 'rgba(0,229,255,0.05)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{AGENT_ICONS[agent]}</span>
                    <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {AGENT_LABELS[agent]}
                    </span>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
