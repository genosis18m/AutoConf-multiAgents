import { useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useConferenceStore } from '../../store/useConferenceStore'
import { StatusBadge } from '../shared/StatusBadge'
import { AGENT_LABELS } from '../../lib/constants'
import type { AgentName } from '../../types'

const glowPulse = keyframes`
  0%   { transform: scale(1); opacity: 0.4; }
  50%  { transform: scale(1.3); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.4; }
`

const StyledNav = styled.nav`
  .radio-input {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #24292e, #1c2128);
    padding: 16px 12px;
    border-radius: 10px;
    box-shadow:
      inset 0 0 16px rgba(0,0,0,0.5),
      0 0 20px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .switch-panel {
    z-index: 1;
    height: 160px;
    width: 52px;
    margin-right: 20px;
    background: linear-gradient(to bottom, #3d444d, #2d333b);
    border-radius: 8px;
    box-shadow:
      inset 0 4px 12px rgba(0,0,0,0.6),
      inset 0 -4px 12px rgba(100,100,100,0.15);
    position: relative;
    border: 2px solid #444c56;
    flex-shrink: 0;
  }

  .track-groove {
    position: absolute;
    inset: 8px;
    background: linear-gradient(90deg, #161b22, #1c2128);
    border-radius: 4px;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.8);
  }

  .selector {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 150px;
    flex: 1;
  }

  .choice {
    display: flex;
    align-items: center;
    position: relative;
    transition: transform 0.2s cubic-bezier(0.6,-0.3,0.4,1.3);
    cursor: pointer;
  }

  .choice:hover { transform: scale(1.02); }

  .input-container {
    position: relative;
    width: 28px;
    height: 28px;
    margin-right: 14px;
    z-index: 2;
    perspective: 400px;
    flex-shrink: 0;
  }

  .choice-switch {
    appearance: none;
    height: 100%;
    width: 100%;
    border-radius: 6px;
    border: 2px solid #444c56;
    cursor: pointer;
    background: linear-gradient(45deg, #3d444d, #2d333b);
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.5),
      0 2px 4px rgba(0,0,0,0.3);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .choice-switch:hover {
    border-color: #6e7681;
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.5),
      0 0 8px rgba(79,142,247,0.3);
  }

  .lever {
    z-index: 1;
    position: absolute;
    width: 22px;
    height: 22px;
    top: 50%;
    left: -55px;
    transform: translateY(-50%) rotateX(30deg);
    border-radius: 5px;
    background: linear-gradient(135deg, #4f8ef7, #3a7ee0);
    box-shadow:
      0 2px 8px rgba(0,0,0,0.5),
      inset 0 2px 3px rgba(255,255,255,0.2);
    transition:
      left 0.6s cubic-bezier(0.68,-0.55,0.27,1.55),
      transform 0.4s cubic-bezier(0.7,0,0.3,1.5),
      box-shadow 0.3s ease;
    will-change: left, transform;
  }

  .choice-switch:checked + .lever {
    left: 4px;
    transform: translateY(-50%) rotateX(0deg);
    box-shadow:
      0 4px 12px rgba(79,142,247,0.6),
      inset 0 2px 3px rgba(255,255,255,0.2);
  }

  .lever::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.3), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .choice-switch:checked + .lever::after {
    opacity: 0.4;
    animation: ${glowPulse} 1.5s infinite cubic-bezier(0.4,0,0.6,1);
  }

  .choice-plate {
    color: #8b949e;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    padding: 5px 10px;
    background: linear-gradient(to bottom, #2d333b, #22272e);
    border: 1.5px solid #444c56;
    border-radius: 5px;
    box-shadow:
      inset 0 2px 3px rgba(0,0,0,0.4),
      0 2px 3px rgba(0,0,0,0.2);
    transition: all 0.3s cubic-bezier(0.68,-0.55,0.27,1.55);
    letter-spacing: 0.04em;
  }

  .choice-plate:hover {
    color: #e6edf3;
    border-color: #6e7681;
  }

  .choice-switch:checked ~ .choice-plate {
    color: #4f8ef7;
    border-color: #4f8ef7;
    box-shadow:
      inset 0 2px 3px rgba(0,0,0,0.4),
      0 0 10px rgba(79,142,247,0.4);
  }
`

const AGENTS: AgentName[] = ['sponsor', 'speaker', 'ticketing', 'venue', 'pricing', 'gtm', 'ops']

const STATUS_COLORS: Record<string, string> = {
  completed: '#57cc99',
  running: '#4f8ef7',
  pending: '#484f58',
  error: '#e07a5f',
}

const NAV_ITEMS = [
  { to: '/', label: 'New Plan', switchId: 'nav-new-plan' },
  { to: '/dashboard', label: 'Dashboard', switchId: 'nav-dashboard' },
  { to: '/results', label: 'Results', switchId: 'nav-results' },
]

export function Sidebar() {
  const { agentStatuses, sessionId } = useConferenceStore()
  const navigate = useNavigate()
  const location = useLocation()

  const activeIndex = NAV_ITEMS.findIndex(n => {
    if (n.to === '/') return location.pathname === '/'
    return location.pathname.startsWith(n.to)
  })

  return (
    <aside
      className="w-52 flex flex-col flex-shrink-0 border-r"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Mechanical radio nav */}
      <div className="p-3 mt-3">
        <StyledNav>
          <div className="radio-input">
            <div className="switch-panel">
              <div className="track-groove" />
            </div>
            <div className="selector">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  className="choice"
                  key={item.to}
                  onClick={() => navigate(item.to)}
                >
                  <div className="input-container">
                    <input
                      className="choice-switch"
                      readOnly
                      checked={activeIndex === idx}
                      name="sidebar-nav"
                      id={item.switchId}
                      type="radio"
                    />
                    <div className="lever" />
                  </div>
                  <label htmlFor={item.switchId} className="choice-plate" style={{ cursor: 'pointer' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </StyledNav>
      </div>

      {/* Agent status list */}
      {sessionId && (
        <div className="flex-1 overflow-y-auto px-3 mt-5">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5 px-1"
            style={{ color: 'var(--text-dim)' }}
          >
            Agents
          </p>
          <div className="space-y-0.5">
            {AGENTS.map((agent) => {
              const s = agentStatuses[agent]
              const dotColor = STATUS_COLORS[s?.status] ?? STATUS_COLORS.pending
              return (
                <div
                  key={agent}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                  style={{ background: s?.status === 'running' ? 'rgba(79,142,247,0.06)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: dotColor }}
                    />
                    <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
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
    </aside>
  )
}
