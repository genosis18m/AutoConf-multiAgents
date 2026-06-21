import { ConferenceForm } from '../components/input/ConferenceForm'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { DEMO_DATA } from '../lib/demoData'

const DEPARTMENTS = ['Sponsors', 'Speakers', 'Venues', 'Ticketing', 'Pricing', 'Go-to-Market', 'Operations']

export function InputPage() {
  const navigate = useNavigate()
  const { setSessionId, setAllResults, reset } = useConferenceStore()

  const handleDemoClick = (city: string) => {
    const data = DEMO_DATA[city]
    if (!data) return
    reset()
    setAllResults(data)
    setSessionId(`demo_${city}_local`)
    navigate('/dashboard')
  }

  // Headline words rise in sequence on load (the "marquee").
  const line1 = ['Brief', 'the', 'agents.']
  const line2 = ['Get', 'the', 'whole', 'conference.']

  return (
    <div className="relative h-full flex flex-col overflow-x-hidden overflow-y-auto" style={{ background: 'var(--ink)' }}>
      {/* Ambient orbs */}
      <div className="gradient-orb w-[460px] h-[460px] top-[-150px] left-[-160px]" style={{ background: 'var(--ember)' }} />
      <div className="gradient-orb w-[400px] h-[400px] bottom-[-140px] right-[-120px]" style={{ background: 'var(--iris)' }} />

      {/* ── Demo bar (pinned at the top) ── */}
      <div
        className="relative z-10 flex-shrink-0 border-b"
        style={{ borderColor: 'var(--line-soft)', background: 'rgba(255,106,61,0.045)' }}
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="kicker" style={{ fontSize: '0.62rem' }}>
            Explore a finished plan — no keys needed
          </span>
          <div className="flex flex-wrap gap-2.5">
            <DemoPass flag="🇮🇳" name="AI Summit" place="New Delhi" onClick={() => handleDemoClick('delhi')} />
            <DemoPass flag="🇺🇸" name="SaaS Growth" place="New York" onClick={() => handleDemoClick('new_york')} />
          </div>
        </div>
      </div>

      {/* ── Hero + brief (vertically centered, fits the viewport) ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-7 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">

            {/* Marquee hero */}
            <div>
              <p className="kicker mb-4">Autonomous conference production</p>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  lineHeight: 0.97,
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(2.15rem, 4.8vw, 3.9rem)',
                  color: 'var(--chalk)',
                }}
              >
                <span className="block">
                  {line1.map((w, i) => (
                    <span key={i} className="marquee-word" style={{ animationDelay: `${i * 90}ms`, marginRight: '0.28em' }}>{w}</span>
                  ))}
                </span>
                <span className="block">
                  {line2.map((w, i) => (
                    <span
                      key={i}
                      className="marquee-word"
                      style={{ animationDelay: `${(line1.length + i) * 90}ms`, marginRight: '0.28em', color: i === 3 ? 'var(--ember)' : undefined }}
                    >
                      {w}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="mt-4 max-w-md" style={{ color: 'var(--haze)', fontSize: '1rem', lineHeight: 1.55 }}>
                Seven specialist agents research sponsors, speakers, venues, pricing,
                go-to-market and operations in parallel — then hand you one
                export-ready plan.
              </p>

              {/* Department index */}
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
                {DEPARTMENTS.map((d, i) => (
                  <span key={d} className="inline-flex items-baseline gap-1.5" style={{ fontSize: '0.8rem', color: 'var(--haze)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--faint)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* The brief (entry pass) */}
            <div>
              <ConferenceForm />
              <p className="mt-3 text-xs text-center lg:text-left" style={{ color: 'var(--faint)', lineHeight: 1.5 }}>
                Live runs use your own Groq · Gemini · Tavily keys (plus Google Maps).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoPass({ flag, name, place, onClick }: { flag: string; name: string; place: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-full pl-2.5 pr-3.5 py-1.5 transition-all"
      style={{ background: 'var(--ink-raise)', border: '1px solid var(--line)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'var(--ember)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'var(--line)'
      }}
    >
      <span className="text-base leading-none">{flag}</span>
      <span className="leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--chalk)' }}>
        {name}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.06em', color: 'var(--faint)', textTransform: 'uppercase', marginLeft: 6 }}>
          {place}
        </span>
      </span>
      <span style={{ color: 'var(--ember)', fontSize: '1rem', transition: 'transform 200ms' }} className="group-hover:translate-x-0.5">→</span>
    </button>
  )
}
