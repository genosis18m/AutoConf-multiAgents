import { useEffect, useRef } from 'react'
import { useConferenceStore } from '../../store/useConferenceStore'
import { AGENT_ICONS } from '../../lib/constants'

export function LiveLogs() {
  const { logs } = useConferenceStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  if (logs.length === 0) {
    return (
      <div
        className="rounded-lg p-4 text-center h-32 flex items-center justify-center"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Logs will appear here when agents start...
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg p-3 h-48 overflow-y-auto space-y-1"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
    >
      {logs.map((log, i) => (
        <div key={i} className="log-entry flex gap-3 font-mono text-[11px]" style={{ animationDelay: `0ms` }}>
          <span style={{ color: 'var(--text-dim)', minWidth: '70px' }}>
            {new Date(log.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="font-bold uppercase tracking-widest" style={{ color: '#00ffaa', minWidth: '80px' }}>
            {log.agent === 'system' ? 'SYSTEM' : log.agent}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{log.message}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
