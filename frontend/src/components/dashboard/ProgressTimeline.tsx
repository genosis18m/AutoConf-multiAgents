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
  const { currentPhase, isComplete } = useConferenceStore()

  return (
    <div className="flex flex-col gap-0">
      {PHASES.map((phase, i) => {
        const isDone = isComplete || currentPhase > phase.id
        const isActive = currentPhase === phase.id && !isComplete

        return (
          <div key={phase.id} className="flex gap-3">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-700 relative',
                )}
                style={{
                  borderColor: isDone ? '#00E676' : isActive ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                  backgroundColor: isDone ? '#00E676' : isActive ? '#00E5FF' : 'var(--bg-elevated)',
                  boxShadow: isDone ? '0 0 12px rgba(0,230,118,0.5)' : isActive ? '0 0 20px rgba(0,229,255,0.8)' : 'none',
                  animation: isActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                }}
              >
                {isActive && (
                  <span 
                    className="absolute inset-0 rounded-full bg-cyan-400 opacity-75"
                    style={{
                      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }}
                  />
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className="w-0.5 flex-1 mt-1.5 min-h-8 transition-all duration-1000"
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
                  className={clsx('text-base font-extrabold tracking-widest transition-colors duration-500 uppercase', isDone || isActive ? '' : 'opacity-40')}
                  style={{ 
                    color: isDone ? '#00E676' : isActive ? '#00ffaa' : 'var(--text-primary)',
                    textShadow: isDone ? '0 0 10px rgba(0,230,118,0.3)' : isActive ? '0 0 10px rgba(0,255,170,0.4)' : 'none'
                  }}
                >
                  {phase.label}
                  {phase.parallel && <span className="ml-2 text-xs uppercase font-extrabold opacity-70 border rounded-md px-1.5 py-0.5 border-current shadow-sm">(parallel)</span>}
                </p>
                {isActive && <OrbitLoader size={20} label="" />}
              </div>
              <p className="text-sm mt-1.5 font-medium transition-opacity duration-500" style={{ color: 'var(--text-dim)', opacity: isDone || isActive ? 1 : 0.5 }}>
                {phase.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
