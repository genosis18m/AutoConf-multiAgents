import { ConferenceForm } from '../components/input/ConferenceForm'
import { EventAILLogo } from '../components/branding/EventAILLogo'

export function InputPage() {
  return (
    <div className="relative min-h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle ambient orbs */}
      <div className="gradient-orb w-[500px] h-[500px] top-[-100px] left-[-120px]" style={{ background: 'var(--accent-indigo)' }} />
      <div className="gradient-orb w-[400px] h-[400px] bottom-[-80px] right-[-100px]" style={{ background: 'var(--accent-purple)' }} />

      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-8 sm:px-6">

        {/* Hero text */}
        <div className="mb-6 flex max-w-xl flex-col items-center text-center">
          <EventAILLogo variant="hero" className="mb-4 mx-auto" />

          <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your conference. Seven research agents will find
            sponsors, speakers, venues, pricing, and more — in minutes.
          </p>
        </div>

        {/* Form container */}
        <div
          className="w-full max-w-2xl rounded-xl p-5 sm:p-7"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <ConferenceForm />
        </div>

        {/* Footer */}
        <footer className="mt-6 w-full max-w-2xl">
          <div
            className="rounded-xl px-5 py-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex flex-wrap justify-center gap-2">
              {['Sponsors', 'Speakers', 'Venues', 'Pricing', 'GTM Strategy', 'Operations'].map((item) => (
                <span
                  key={item}
                  className="rounded-full px-3 py-1 text-xs font-medium"
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
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                EventAIL plans multi-day conferences using seven autonomous agents with live progress updates.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                Results export-ready in minutes
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
