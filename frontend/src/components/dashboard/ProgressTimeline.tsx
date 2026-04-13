import { useConferenceStore } from '../../store/useConferenceStore'
import clsx from 'clsx'

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
                  'w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-500',
                  isDone && 'border-accent-green bg-accent-green',
                  isActive && 'border-accent-cyan bg-accent-cyan animate-pulse',
                  !isDone && !isActive && 'border-border-subtle bg-bg-elevated',
                )}
                style={{
                  borderColor: isDone ? '#00E676' : isActive ? '#00E5FF' : undefined,
                  backgroundColor: isDone ? '#00E676' : isActive ? '#00E5FF' : undefined,
                }}
              />
              {i < PHASES.length - 1 && (
                <div
                  className="w-0.5 flex-1 mt-1 min-h-8 transition-all duration-700"
                  style={{ background: isDone ? '#00E676' : 'var(--border-subtle)' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-5">
              <p
                className={clsx('text-sm font-semibold', isDone || isActive ? '' : 'opacity-50')}
                style={{ color: isDone ? '#00E676' : isActive ? '#00E5FF' : 'var(--text-secondary)' }}
              >
                {phase.label}
                {phase.parallel && <span className="ml-1 text-xs opacity-70">(parallel)</span>}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {phase.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
