import React from 'react'
import { GlassCard } from '../shared/GlassCard'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { Venue } from '../../types'

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, { label: string; bg: string; color: string; border: string }> = {
    1: { label: '#1', bg: 'rgba(255,215,0,0.12)', color: '#FFD700', border: 'rgba(255,215,0,0.3)' },
    2: { label: '#2', bg: 'rgba(192,192,192,0.12)', color: '#C0C0C0', border: 'rgba(192,192,192,0.3)' },
    3: { label: '#3', bg: 'rgba(205,127,50,0.12)', color: '#CD7F32', border: 'rgba(205,127,50,0.3)' },
  }
  const s = medals[rank] ?? { label: `#${rank}`, bg: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)', border: 'rgba(0,229,255,0.25)' }
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 10px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 800,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        letterSpacing: '0.02em',
      }}
    >
      {s.label}
    </div>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const stars = 5
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: stars }, (_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            style={{ flexShrink: 0 }}
          >
            <defs>
              <linearGradient id={`star-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset={partial ? `${(rating - Math.floor(rating)) * 100}%`  : '100%'} stopColor="#FFD700" />
                <stop offset={partial ? `${(rating - Math.floor(rating)) * 100}%` : '0%'} stopColor="#3A3A4A" stopOpacity={partial ? 1 : 0} />
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={filled ? '#FFD700' : partial ? `url(#star-grad-${i})` : '#3A3A4A'}
            />
          </svg>
        )
      })}
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginLeft: 4 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// ─── Capacity Bar ─────────────────────────────────────────────────────────────
function CapacityBar({ capacity, maxCapacity }: { capacity: number; maxCapacity: number }) {
  const pct = Math.min(100, (capacity / maxCapacity) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Capacity
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)' }}>
          {capacity.toLocaleString()}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: 'var(--border-subtle)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Bullet List ──────────────────────────────────────────────────────────────
function BulletList({ items, variant }: { items: string[]; variant: 'pro' | 'con' }) {
  const dotColor = variant === 'pro' ? 'var(--accent-green)' : 'var(--accent-orange)'
  const textColor = variant === 'pro' ? '#a3f0c4' : '#ffb09a'
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 12,
            color: textColor,
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: dotColor,
              marginTop: 5,
              flexShrink: 0,
            }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

// ─── Venue Card ───────────────────────────────────────────────────────────────
function VenueCard({ venue, maxCapacity }: { venue: Venue; maxCapacity: number }) {
  return (
    <GlassCard className="stagger-child" hover>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <RankBadge rank={venue.rank} />
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {venue.name}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {venue.address}{venue.city ? `, ${venue.city}` : ''}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {venue.estimated_cost}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>Est. Cost</div>
        </div>
      </div>

      {/* Rating */}
      <div style={{ marginBottom: 12 }}>
        <StarRating rating={venue.rating} />
      </div>

      {/* Capacity bar */}
      <div style={{ marginBottom: 16 }}>
        <CapacityBar capacity={venue.capacity} maxCapacity={maxCapacity} />
      </div>

      {/* Pros & Cons */}
      {(venue.pros?.length > 0 || venue.cons?.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            marginBottom: 14,
          }}
        >
          {venue.pros?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--accent-green)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                Pros
              </div>
              <BulletList items={venue.pros} variant="pro" />
            </div>
          )}
          {venue.cons?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--accent-orange)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                Cons
              </div>
              <BulletList items={venue.cons} variant="con" />
            </div>
          )}
        </div>
      )}

      {/* Maps link */}
      {venue.google_maps_url && (
        <a
          href={venue.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(0,229,255,0.3)',
            background: 'rgba(0,229,255,0.06)',
            textDecoration: 'none',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(0,229,255,0.12)'
            el.style.boxShadow = '0 0 12px rgba(0,229,255,0.2)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(0,229,255,0.06)'
            el.style.boxShadow = 'none'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          View on Maps
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </GlassCard>
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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span style={{ fontSize: 14 }}>Venue results will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function VenuePanel() {
  const venueResult = useConferenceStore((s) => s.results.venue)

  if (!venueResult || !venueResult.venues?.length) {
    return <EmptyState />
  }

  const { venues } = venueResult
  const maxCapacity = Math.max(...venues.map((v) => v.capacity), 1)

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
          Venue Recommendations
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Top {venues.length} venues ranked by suitability for your conference
        </p>
      </div>

      {/* 3-column grid (responsive) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {venues.map((venue, i) => (
          <VenueCard key={`${venue.name}-${i}`} venue={venue} maxCapacity={maxCapacity} />
        ))}
      </div>
    </div>
  )
}
