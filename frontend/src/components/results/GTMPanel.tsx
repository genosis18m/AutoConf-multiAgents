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
        gap: 8,
        flexWrap: 'wrap',
        background: 'rgba(10, 10, 15, 0.4)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 8,
        position: 'relative',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
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
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? meta.bg : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: isActive ? `1px solid ${meta.border}` : '1px solid transparent',
              boxShadow: isActive ? `0 4px 12px ${meta.bg.replace('0.08', '0.15').replace('0.1', '0.2')}` : 'none',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                color: isActive ? meta.accent : 'var(--text-dim)',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                filter: isActive ? `drop-shadow(0 0 8px ${meta.accent})` : 'none',
              }}
            >
              {meta.icon}
            </span>
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
    <div 
      key={channel.channel} /* helps with animation when switching */
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 20, 
        animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Strategy */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(30, 35, 45, 0.4) 0%, rgba(20, 25, 30, 0.6) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
            opacity: 0.5
          }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: meta.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Strategy
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
            {channel.strategy}
          </p>
        </div>

        {/* Target Communities */}
        {channel.target_communities?.length > 0 && (
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 35, 45, 0.4) 0%, rgba(20, 25, 30, 0.6) 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              Target Communities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {channel.target_communities.map((c, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 500,
                    background: meta.bg,
                    color: meta.accent,
                    border: `1px solid ${meta.border}`,
                    boxShadow: `0 2px 8px ${meta.bg}`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Template */}
      <GlassCard hover={false} style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: meta.bg, border: `1px solid ${meta.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.accent
            }}>
              {meta.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Message Template</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Ready to copy & paste</div>
            </div>
          </div>
          <CopyButton text={channel.message_template} />
        </div>
        <div style={{ padding: 24, background: 'rgba(0, 0, 0, 0.2)' }}>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
            }}
          >
            {channel.message_template}
          </pre>
        </div>
      </GlassCard>
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
        padding: '100px 24px',
        color: 'var(--text-dim)',
        gap: 20,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 24,
      }}
    >
      <div style={{
        width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 69, 0, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255, 69, 0, 0.1)'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8a16 16 0 0 0 6 6l.27-.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16h1l.92.92z" />
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          Awaiting GTM Strategy
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 300 }}>
          The GTM agent is formulating the perfect outreach channels and message templates...
        </div>
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
          Go-to-Market Strategy
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8, maxWidth: 600, lineHeight: 1.5 }}>
          Your master plan for audience generation. This multi-channel approach is tailored to capture target attendees across all relevant platforms.
        </p>
      </div>

      {/* Key messages */}
      {key_messages?.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 24,
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(0, 150, 255, 0.02) 100%)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: 16,
            boxShadow: 'inset 0 0 20px rgba(0, 229, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
            Core Campaign Messaging
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {key_messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  padding: '10px 16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                {msg}
              </div>
            ))}
          </div>
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
