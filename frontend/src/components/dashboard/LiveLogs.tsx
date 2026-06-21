import { useEffect, useRef } from 'react'
import { useConferenceStore } from '../../store/useConferenceStore'

export function LiveLogs() {
  const { logs } = useConferenceStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  if (logs.length === 0) {
    return (
      <div
        className="rounded-xl p-4 text-center h-32 flex items-center justify-center"
        style={{ background: 'var(--ink-deep)', border: '1px solid var(--line)' }}
      >
        <p style={{ color: 'var(--faint)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
          The feed opens when the first agent goes live.
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-3.5 h-52 overflow-y-auto space-y-1"
      style={{ background: 'var(--ink-deep)', border: '1px solid var(--line)' }}
    >
      {logs.map((log, i) => (
        <div key={i} className="log-entry flex gap-3 items-baseline" style={{ animationDelay: '0ms' }}>
          <span style={{ color: 'var(--faint)', minWidth: 62, fontSize: '0.68rem' }}>
            {new Date(log.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span
            style={{
              color: log.agent === 'system' ? 'var(--iris)' : 'var(--ember)',
              minWidth: 76,
              fontSize: '0.66rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {log.agent === 'system' ? 'system' : log.agent}
          </span>
          <span style={{ color: 'var(--haze)', fontSize: '0.72rem' }}>{log.message}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
