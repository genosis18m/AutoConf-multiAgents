import { ConferenceForm } from '../components/input/ConferenceForm'
import { EventAILLogo } from '../components/branding/EventAILLogo'

export function InputPage() {
  return (
    <div className="relative h-full overflow-x-hidden overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle ambient orbs */}
      <div className="gradient-orb w-[500px] h-[500px] top-[-100px] left-[-120px]" style={{ background: 'var(--accent-indigo)' }} />
      <div className="gradient-orb w-[400px] h-[400px] bottom-[-80px] right-[-100px]" style={{ background: 'var(--accent-purple)' }} />

      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-start px-4 py-3 sm:px-6 sm:py-4 lg:justify-center">

        {/* Hero text */}
        <div className="mb-3 flex max-w-xl flex-col items-center text-center">
          <EventAILLogo variant="hero" className="mb-2 mx-auto" />

          <p className="mx-auto max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your conference. Seven research agents will find
            sponsors, speakers, venues, pricing, and more — in minutes.
          </p>
        </div>

        {/* Form container */}
        <div
          className="w-full max-w-2xl rounded-xl p-4 sm:p-5"
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
        <footer className="mt-3 w-full max-w-2xl">
          <div
            className="rounded-xl px-4 py-3"
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
              className="mt-3 flex flex-col items-center justify-between gap-2 border-t pt-3 text-center sm:flex-row sm:text-left"
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
