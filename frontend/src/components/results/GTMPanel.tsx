import React, { useState } from 'react'
import { GlassCard } from '../shared/GlassCard'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { GTMChannel } from '../../types'

// ─── Channel config ───────────────────────────────────────────────────────────
interface ChannelMeta {
  label: string
  icon: React.ReactNode
  accent: string
  bg: string
  border: string
}

function ChannelIcon({ channel }: { channel: string }) {
  const key = channel.toLowerCase()

  if (key.includes('email'))
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  if (key.includes('linkedin'))
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  if (key.includes('twitter') || key.includes('x'))
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
      </svg>
    )
  if (key.includes('whatsapp'))
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    )
  if (key.includes('reddit'))
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    )
  // fallback
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function getChannelMeta(channel: string): ChannelMeta {
  const key = channel.toLowerCase()
  if (key.includes('email'))
    return { label: 'Email', icon: <ChannelIcon channel={channel} />, accent: 'var(--accent-cyan)', bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.25)' }
  if (key.includes('linkedin'))
    return { label: 'LinkedIn', icon: <ChannelIcon channel={channel} />, accent: '#0A66C2', bg: 'rgba(10,102,194,0.1)', border: 'rgba(10,102,194,0.3)' }
  if (key.includes('twitter') || key.includes('x'))
    return { label: 'X / Twitter', icon: <ChannelIcon channel={channel} />, accent: '#E7E9EA', bg: 'rgba(231,233,234,0.06)', border: 'rgba(231,233,234,0.15)' }
  if (key.includes('whatsapp'))
    return { label: 'WhatsApp', icon: <ChannelIcon channel={channel} />, accent: '#25D366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.25)' }
  if (key.includes('reddit'))
    return { label: 'Reddit', icon: <ChannelIcon channel={channel} />, accent: '#FF4500', bg: 'rgba(255,69,0,0.08)', border: 'rgba(255,69,0,0.25)' }
  return { label: channel, icon: <ChannelIcon channel={channel} />, accent: 'var(--accent-purple)', bg: 'rgba(179,136,255,0.08)', border: 'rgba(179,136,255,0.25)' }
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '5px 12px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        border: `1px solid ${copied ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
        background: copied ? 'rgba(0,230,118,0.1)' : 'var(--bg-elevated)',
        color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
      }}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({
  channels,
  activeIndex,
  onSelect,
}: {
  channels: GTMChannel[]
  activeIndex: number
  onSelect: (i: number) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 6,
      }}
    >
      {channels.map((ch, i) => {
        const meta = getChannelMeta(ch.channel)
        const isActive = i === activeIndex
        return (
          <button
            key={ch.channel}
            onClick={() => onSelect(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              border: isActive ? `1px solid ${meta.border}` : '1px solid transparent',
              background: isActive ? meta.bg : 'transparent',
              color: isActive ? meta.accent : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: isActive ? meta.accent : 'var(--text-dim)' }}>{meta.icon}</span>
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Channel Detail ───────────────────────────────────────────────────────────
function ChannelDetail({ channel }: { channel: GTMChannel }) {
  const meta = getChannelMeta(channel.channel)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'slide-in-right 0.25s ease forwards' }}>
      {/* Strategy */}
      <GlassCard hover={false}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: meta.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          Strategy
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
          {channel.strategy}
        </p>
      </GlassCard>

      {/* Message Template */}
      <GlassCard hover={false}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: meta.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Message Template
          </div>
          <CopyButton text={channel.message_template} />
        </div>
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            lineHeight: 1.75,
            color: 'var(--text-primary)',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '14px 16px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}
        >
          {channel.message_template}
        </pre>
      </GlassCard>

      {/* Target Communities */}
      {channel.target_communities?.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            Target Communities
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {channel.target_communities.map((c, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 12px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 500,
                  background: meta.bg,
                  color: meta.accent,
                  border: `1px solid ${meta.border}`,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Timeline Table ───────────────────────────────────────────────────────────
function TimelineTable({ timeline }: { timeline: Array<{ week: string; action: string }> }) {
  if (!timeline?.length) return null

  return (
    <div style={{ marginTop: 8 }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Campaign Timeline
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
            <tr style={{ background: 'rgba(0,229,255,0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
              {['Week', 'Action'].map((h) => (
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
            {timeline.map((item, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < timeline.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,229,255,0.03)'
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
                    width: 120,
                  }}
                >
                  {item.week}
                </td>
                <td style={{ padding: '10px 16px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.action}
                </td>
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8a16 16 0 0 0 6 6l.27-.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16h1l.92.92z" />
      </svg>
      <span style={{ fontSize: 14 }}>GTM strategy will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function GTMPanel() {
  const gtmResult = useConferenceStore((s) => s.results.gtm)
  const [activeTab, setActiveTab] = useState(0)

  if (!gtmResult || !gtmResult.channels?.length) {
    return <EmptyState />
  }

  const { channels, timeline, key_messages } = gtmResult
  const activeChannel = channels[activeTab] ?? channels[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Go-to-Market Strategy
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Multi-channel outreach templates and campaign timeline
        </p>
      </div>

      {/* Key messages */}
      {key_messages?.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            padding: '12px 16px',
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.15)',
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center', flexShrink: 0 }}>
            Key Messages:
          </span>
          {key_messages.map((msg, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                padding: '3px 10px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 6,
                border: '1px solid var(--border-subtle)',
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <TabBar channels={channels} activeIndex={activeTab} onSelect={setActiveTab} />

      {/* Active channel content */}
      {activeChannel && <ChannelDetail channel={activeChannel} />}

      {/* Timeline */}
      <TimelineTable timeline={timeline} />
    </div>
  )
}
