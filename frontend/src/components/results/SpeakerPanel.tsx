import React from 'react'
import { TerminalCard } from '../shared/TerminalCard'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { Speaker, AgendaSlot } from '../../types'

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({
  value,
  max = 10,
  label,
  color = 'var(--accent-cyan)',
}: {
  value: number
  max?: number
  label: string
  color?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value.toFixed(1)}</span>
      </div>
      <div
        style={{
          height: 5,
          borderRadius: 99,
          background: 'var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: color,
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Slot Badge ───────────────────────────────────────────────────────────────
function SlotBadge({ slot }: { slot: string }) {
  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(0,229,255,0.12)',
        color: 'var(--accent-cyan)',
        border: '1px solid rgba(0,229,255,0.25)',
        whiteSpace: 'nowrap',
      }}
    >
      {slot}
    </span>
  )
}

// ─── Topic Pill ───────────────────────────────────────────────────────────────
function TopicPill({ topic }: { topic: string }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        background: 'rgba(179,136,255,0.1)',
        color: 'var(--accent-purple)',
        border: '1px solid rgba(179,136,255,0.2)',
      }}
    >
      {topic}
    </span>
  )
}

// ─── Avatar Placeholder ───────────────────────────────────────────────────────
function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 25%)`,
        border: `2px solid hsl(${hue}, 60%, 45%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 700,
        color: `hsl(${hue}, 70%, 80%)`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Speaker Card ─────────────────────────────────────────────────────────────
function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <TerminalCard className="stagger-child" title={speaker.name} command={`fetch-speaker ${speaker.name.replace(/\\s+/g, '-').toLowerCase()}`}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <AvatarPlaceholder name={speaker.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              {speaker.name}
            </span>
            <SlotBadge slot={speaker.suggested_slot} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {speaker.title}
            {speaker.organization && (
              <span style={{ color: 'var(--text-dim)' }}> · {speaker.organization}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {speaker.bio_summary && (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: 14,
            borderLeft: '2px solid var(--border-subtle)',
            paddingLeft: 10,
          }}
        >
          {speaker.bio_summary}
        </p>
      )}

      {/* Score bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <ScoreBar value={speaker.relevance_score} max={10} label="Relevance" color="var(--accent-cyan)" />
        <ScoreBar value={speaker.influence_score} max={10} label="Influence" color="var(--accent-purple)" />
      </div>

      {/* Topics */}
      {speaker.topics?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {speaker.topics.map((t, i) => (
            <TopicPill key={i} topic={t} />
          ))}
        </div>
      )}

      {/* Source link */}
      {speaker.source_url && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <a
            href={speaker.source_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            View Profile
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </TerminalCard>
  )
}

// ─── Agenda Table ─────────────────────────────────────────────────────────────
function AgendaTable({ slots }: { slots: AgendaSlot[] }) {
  if (!slots?.length) return null

  return (
    <div style={{ marginTop: 32 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Agenda Mapping
      </h3>
      <div
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr
              style={{
                background: 'rgba(0,229,255,0.05)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {['Time Slot', 'Speaker', 'Topic'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < slots.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,229,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                }}
              >
                <td
                  style={{
                    padding: '10px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent-cyan)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {slot.time_slot}
                </td>
                <td
                  style={{
                    padding: '10px 16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {slot.speaker}
                </td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)' }}>{slot.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        color: 'var(--text-dim)',
        gap: 12,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span style={{ fontSize: 14 }}>Speaker results will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SpeakerPanel() {
  const speakerResult = useConferenceStore((s) => s.results.speaker)

  if (!speakerResult || !speakerResult.speakers?.length) {
    return <EmptyState />
  }

  const { speakers, agenda_mapping } = speakerResult

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Speakers
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          {speakers.length} curated speakers matched to your conference profile
        </p>
      </div>

      {/* Speaker grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {speakers.map((speaker, i) => (
          <SpeakerCard key={`${speaker.name}-${i}`} speaker={speaker} />
        ))}
      </div>

      {/* Agenda timeline */}
      <AgendaTable slots={agenda_mapping} />
    </div>
  )
}
