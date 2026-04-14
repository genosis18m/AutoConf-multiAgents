import { ConferenceForm } from '../components/input/ConferenceForm'
import { EventAILLogo } from '../components/branding/EventAILLogo'

export function InputPage() {
  return (
    <div className="relative min-h-full overflow-hidden dot-grid" style={{ background: 'var(--bg-primary)' }}>
      {/* Gradient orbs */}
      <div className="gradient-orb w-96 h-96 top-[-80px] left-[-80px]" style={{ background: 'var(--accent-cyan)' }} />
      <div className="gradient-orb w-80 h-80 bottom-[-60px] right-[-60px]" style={{ background: 'var(--accent-purple)' }} />

      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-5 sm:px-6 sm:py-7">
        {/* Hero text */}
        <div className="mb-5 flex max-w-2xl flex-col items-center text-center sm:mb-6">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
            7 AI Agents · Phased Execution · Real-time
          </div>

          <EventAILLogo variant="hero" className="mb-3 mx-auto" />

          <p className="mx-auto max-w-xl text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Enter your conference details. 7 autonomous AI agents will research sponsors,
            speakers, venues, pricing, GTM strategy, and operations — in minutes.
          </p>
        </div>

        {/* Form container */}
        <div
          className="w-full max-w-2xl rounded-xl p-5 sm:p-6"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <ConferenceForm />
        </div>

        <footer className="mt-5 w-full max-w-4xl">
          <div
            className="rounded-2xl px-4 py-4 sm:px-5"
            style={{
              background: 'rgba(18, 18, 26, 0.7)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div className="flex flex-wrap justify-center gap-2">
              {[
                '💰 Sponsors',
                '🎤 Speakers',
                '🏛️ Venues',
                '📊 Pricing',
                '📣 GTM',
                '⚙️ Ops',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full px-3 py-1 text-[11px] sm:text-xs"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div
              className="mt-4 flex flex-col items-center justify-between gap-2 border-t pt-3 text-center sm:flex-row sm:text-left"
              style={{ borderColor: 'rgba(42, 42, 58, 0.9)' }}
            >
              <p className="text-[11px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
                EventAIL plans multi-day conferences with 7 autonomous agents and live execution updates.
              </p>
              <p className="text-[11px] sm:text-xs" style={{ color: 'var(--text-dim)' }}>
                FastAPI · React · WebSocket streaming · Export-ready outputs
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
