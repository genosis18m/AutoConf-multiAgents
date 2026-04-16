import React, { useState } from 'react'
import { TerminalCard } from '../shared/TerminalCard'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { Sponsor } from '../../types'

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 10, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{value.toFixed(1)}</span>
        </div>
      )}
      <div
        style={{
          height: 6,
          borderRadius: 99,
          background: 'var(--border-subtle)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, height: '100%', borderRadius: 99 }}
        />
      </div>
    </div>
  )
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for non-secure contexts
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
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        border: `1px solid ${copied ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
        background: copied ? 'rgba(0,230,118,0.1)' : 'var(--bg-elevated)',
        color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, { bg: string; color: string }> = {
    1: { bg: 'rgba(255,215,0,0.15)', color: '#FFD700' },
    2: { bg: 'rgba(192,192,192,0.15)', color: '#C0C0C0' },
    3: { bg: 'rgba(205,127,50,0.15)', color: '#CD7F32' },
  }
  const style = colors[rank] ?? { bg: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)' }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: style.bg,
        color: style.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 13,
        flexShrink: 0,
        border: `1px solid ${style.color}40`,
      }}
    >
      #{rank}
    </div>
  )
}

// ─── Sponsor Card ─────────────────────────────────────────────────────────────
function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <TerminalCard
      className="stagger-child"
      title={sponsor.company_name}
      command={`analyze-sponsor --name "${sponsor.company_name}"`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <RankBadge rank={sponsor.rank} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {sponsor.company_name}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                background: 'rgba(179,136,255,0.15)',
                color: 'var(--accent-purple)',
                border: '1px solid rgba(179,136,255,0.25)',
              }}
            >
              {sponsor.industry}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginTop: 3,
              fontStyle: 'italic',
            }}
          >
            {sponsor.rationale}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {sponsor.estimated_budget}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>Est. Budget</div>
        </div>
      </div>

      {/* Relevance score bar */}
      <ScoreBar value={sponsor.relevance_score} max={10} label="Relevance Score" />

      {/* Expand toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          {expanded ? 'Hide' : 'Show'} outreach email
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-dim)"
          strokeWidth="2"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 200ms ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expandable email section */}
      {expanded && (
        <div
          style={{
            marginTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 12,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Outreach Email Template
            </span>
            <CopyButton text={sponsor.outreach_email} />
          </div>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '12px 14px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
            }}
          >
            {sponsor.outreach_email}
          </pre>
          {sponsor.contact_info?.email && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-dim)' }}>Contact: </span>
              <a
                href={`mailto:${sponsor.contact_info.email}`}
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >
                {sponsor.contact_info.email}
              </a>
              {sponsor.contact_info.linkedin && (
                <>
                  <span style={{ margin: '0 8px', color: 'var(--text-dim)' }}>·</span>
                  <a
                    href={sponsor.contact_info.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
                  >
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </TerminalCard>
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
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
      <span style={{ fontSize: 14 }}>Sponsor results will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SponsorPanel() {
  const sponsorResult = useConferenceStore((s) => s.results.sponsor)

  if (!sponsorResult || !sponsorResult.sponsors?.length) {
    return <EmptyState />
  }

  const { sponsors, total_found, search_queries_used } = sponsorResult

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Sponsor Matches
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {total_found} potential sponsors found · Showing top {sponsors.length}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {search_queries_used?.slice(0, 3).map((q, i) => (
            <span
              key={i}
              style={{
                padding: '3px 10px',
                borderRadius: 99,
                fontSize: 11,
                background: 'rgba(0,229,255,0.08)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,229,255,0.2)',
              }}
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Sponsor cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sponsors.map((sponsor, i) => (
          <SponsorCard key={`${sponsor.company_name}-${i}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  )
}
