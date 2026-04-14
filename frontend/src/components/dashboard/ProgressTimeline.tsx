import { useConferenceStore } from '../../store/useConferenceStore'
import clsx from 'clsx'
import { OrbitLoader } from '../shared/OrbitLoader'

const PHASES = [
  { id: 1, label: 'Phase 1', desc: 'Sponsor + Speaker + Venue', parallel: true },
  { id: 2, label: 'Phase 2', desc: 'Pricing & Footfall', parallel: false },
  { id: 3, label: 'Phase 3', desc: 'GTM & Communications', parallel: false },
  { id: 4, label: 'Phase 4', desc: 'Ops & Logistics', parallel: false },
]

export function ProgressTimeline() {
  const { currentPhase } = useConferenceStore()

  return (
    <div className="flex flex-col gap-0">
      {PHASES.map((phase, i) => {
        const isDone = currentPhase > phase.id
        const isActive = currentPhase === phase.id

        return (
          <div key={phase.id} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-[800ms] ease-out-expo relative',
                )}
                style={{
                  borderColor: isDone ? '#00E676' : isActive ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                  backgroundColor: isDone ? '#00E676' : isActive ? '#00E5FF' : 'var(--bg-elevated)',
                  boxShadow: isDone ? '0 0 12px rgba(0,230,118,0.5)' : isActive ? '0 0 15px rgba(0,229,255,0.6)' : 'none',
                }}
              >
                {isActive && (
                  <span className="animate-ping absolute inset-0 rounded-full bg-cyan-400 opacity-60"></span>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className="w-0.5 flex-1 mt-1.5 min-h-8 transition-all duration-[1200ms] ease-out-expo"
                  style={{ 
                    background: isDone ? 'linear-gradient(180deg, #00E676, rgba(0,230,118,0.2))' : 'var(--border-subtle)',
                    boxShadow: isDone ? '0 0 8px rgba(0,230,118,0.3)' : 'none'
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <div className="flex items-center gap-2.5">
                <p
                  className={clsx('text-sm font-bold tracking-wide transition-colors duration-500', isDone || isActive ? '' : 'opacity-40')}
                  style={{ 
                    color: isDone ? '#00E676' : isActive ? '#00E5FF' : 'var(--text-primary)',
                    textShadow: isDone ? '0 0 10px rgba(0,230,118,0.2)' : isActive ? '0 0 10px rgba(0,229,255,0.2)' : 'none'
                  }}
                >
                  {phase.label}
                  {phase.parallel && <span className="ml-1.5 text-[10px] uppercase font-semibold opacity-70 border rounded-sm px-1 py-0.5 border-current">(parallel)</span>}
                </p>
                {isActive && <OrbitLoader size={16} label="" />}
              </div>
              <p className="text-xs mt-1.5 font-medium transition-opacity duration-500" style={{ color: 'var(--text-dim)', opacity: isDone || isActive ? 0.9 : 0.4 }}>
                {phase.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
