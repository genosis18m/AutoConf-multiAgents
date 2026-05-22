import { useNavigate, useLocation } from 'react-router-dom'
import { useConferenceStore } from '../../store/useConferenceStore'

const NAV_ITEMS = [
  {
    to: '/',
    label: 'New Plan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/results',
    label: 'Results',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agentStatuses } = useConferenceStore()

  const runningCount = Object.values(agentStatuses).filter(a => a?.status === 'running').length

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(22, 27, 34, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', height: '60px' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.to)
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: active ? 'var(--accent-indigo)' : 'var(--text-dim)',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '6px 0',
              }}
            >
              {/* Active indicator line */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    borderRadius: '0 0 4px 4px',
                    background: 'var(--accent-indigo)',
                    boxShadow: '0 2px 8px rgba(79,142,247,0.6)',
                  }}
                />
              )}

              {/* Running pulse badge on Dashboard */}
              <span style={{ position: 'relative', lineHeight: 0 }}>
                {item.to === '/dashboard' && runningCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -6,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--accent-indigo)',
                      boxShadow: '0 0 6px rgba(79,142,247,0.8)',
                      animation: 'pulse-glow 1.5s ease-in-out infinite',
                    }}
                  />
                )}
                {item.icon}
              </span>

              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>
                {item.label.toUpperCase()}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
