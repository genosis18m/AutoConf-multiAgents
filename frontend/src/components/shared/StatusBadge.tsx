import type { AgentStatusType } from '../../types'

const config: Record<string, { label: string; tone: string; pulse?: boolean }> = {
  queued:    { label: 'Queued', tone: 'var(--faint)' },
  running:   { label: 'Live',   tone: 'var(--ember)', pulse: true },
  completed: { label: 'Done',   tone: 'var(--mint)' },
  failed:    { label: 'Failed', tone: 'var(--accent-red)' },
}

export function StatusBadge({ status }: { status?: AgentStatusType }) {
  const { label, tone, pulse } = config[status ?? 'queued'] ?? config.queued

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: tone,
        background: `color-mix(in srgb, ${tone} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${tone} 30%, transparent)`,
        opacity: (status ?? 'queued') === 'queued' ? 0.75 : 1,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: tone,
          boxShadow: `0 0 6px ${tone}`,
          animation: pulse ? 'pulse-glow 1.6s ease-in-out infinite' : 'none',
        }}
      />
      {label}
    </span>
  )
}
