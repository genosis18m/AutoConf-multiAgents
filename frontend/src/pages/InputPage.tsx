import { ConferenceForm } from '../components/input/ConferenceForm'

export function InputPage() {
  return (
    <div className="relative min-h-full overflow-hidden dot-grid" style={{ background: 'var(--bg-primary)' }}>
      {/* Gradient orbs */}
      <div className="gradient-orb w-96 h-96 top-[-80px] left-[-80px]" style={{ background: 'var(--accent-cyan)' }} />
      <div className="gradient-orb w-80 h-80 bottom-[-60px] right-[-60px]" style={{ background: 'var(--accent-purple)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-16">
        {/* Hero text */}
        <div className="text-center mb-12 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
            7 AI Agents · Phased Execution · Real-time
          </div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
            style={{
              color: 'var(--text-primary)',
              background: 'linear-gradient(135deg, #E8E8EC, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ConferenceAI
          </h1>

          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Enter your conference details. 7 autonomous AI agents will research sponsors,
            speakers, venues, pricing, GTM strategy, and operations — in minutes.
          </p>
        </div>

        {/* Form container */}
        <div
          className="w-full max-w-2xl rounded-xl p-8"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <ConferenceForm />
        </div>

        {/* Feature badges */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {[
            '💰 Sponsor Outreach',
            '🎤 Speaker Lineup',
            '🏛️ Venue Recommendations',
            '📊 Pricing Forecast',
            '📣 GTM Strategy',
            '⚙️ Ops Runbook',
          ].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
