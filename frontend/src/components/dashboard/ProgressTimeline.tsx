import { useConferenceStore } from '../../store/useConferenceStore'
import clsx from 'clsx'

const PHASES = [
  { id: 1, label: 'Research', desc: 'Sponsors · Speakers · Venue', parallel: true },
  { id: 2, label: 'Pricing', desc: 'Pricing & footfall', parallel: false },
  { id: 3, label: 'Go-to-Market', desc: 'Comms & channels', parallel: false },
  { id: 4, label: 'Operations', desc: 'Run of show & logistics', parallel: false },
]

export function ProgressTimeline() {
  const { currentPhase } = useConferenceStore()

  return (
    <div className="flex flex-col gap-0">
      {PHASES.map((phase, i) => {
        const isDone = currentPhase > phase.id
        const isActive = currentPhase === phase.id
        const tone = isDone ? 'var(--mint)' : isActive ? 'var(--ember)' : 'var(--faint)'

        return (
          <div key={phase.id} className="flex gap-3.5">
            {/* Marker + connector */}
            <div className="flex flex-col items-center">
              <div
                className="relative flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ width: 22, height: 22 }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--ember)', opacity: 0.25, animation: 'pulse-glow 1.8s ease-in-out infinite' }}
                  />
                )}
                <span
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: isDone || isActive ? 22 : 12,
                    height: isDone || isActive ? 22 : 12,
                    border: `2px solid ${tone}`,
                    background: isDone ? 'var(--mint)' : isActive ? 'color-mix(in srgb, var(--ember) 20%, var(--ink-raise))' : 'var(--ink-high)',
                    transition: 'all 0.5s var(--ease-out-expo)',
                  }}
                >
                  {isDone && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className="w-0.5 flex-1 my-1.5 min-h-9"
                  style={{ background: isDone ? 'var(--mint)' : 'var(--line)', transition: 'all 1s var(--ease-out-expo)' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6" style={{ opacity: isDone || isActive ? 1 : 0.5 }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', color: 'var(--faint)' }}>
                  PHASE {phase.id}
                </span>
                {phase.parallel && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.12em', color: 'var(--iris)', border: '1px solid color-mix(in srgb, var(--iris) 35%, transparent)', borderRadius: 999, padding: '1px 6px' }}>
                    PARALLEL
                  </span>
                )}
              </div>
              <p
                className={clsx('mt-0.5')}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em', color: isDone ? 'var(--mint)' : isActive ? 'var(--ember)' : 'var(--chalk)' }}
              >
                {phase.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--haze)' }}>{phase.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
