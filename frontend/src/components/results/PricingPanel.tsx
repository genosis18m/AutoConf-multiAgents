import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TerminalCard } from '../shared/TerminalCard'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { PricingTier } from '../../types'

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_STYLES: Record<
  string,
  { accent: string; bg: string; border: string; icon: string; label: string }
> = {
  'early bird': {
    accent: 'var(--accent-green)',
    bg: 'rgba(0,230,118,0.06)',
    border: 'rgba(0,230,118,0.25)',
    icon: '🐦',
    label: 'Early Bird',
  },
  standard: {
    accent: 'var(--accent-cyan)',
    bg: 'rgba(0,229,255,0.06)',
    border: 'rgba(0,229,255,0.25)',
    icon: '🎟️',
    label: 'Standard',
  },
  vip: {
    accent: 'var(--accent-purple)',
    bg: 'rgba(179,136,255,0.06)',
    border: 'rgba(179,136,255,0.25)',
    icon: '⭐',
    label: 'VIP',
  },
}

function getTierStyle(tier: string) {
  const key = tier.toLowerCase().trim()
  return (
    TIER_STYLES[key] ??
    TIER_STYLES[
      Object.keys(TIER_STYLES).find((k) => key.includes(k)) ?? 'standard'
    ] ??
    TIER_STYLES['standard']
  )
}

// ─── Pricing Tier Card ────────────────────────────────────────────────────────
function PricingTierCard({ tier, index }: { tier: PricingTier; index: number }) {
  const style = getTierStyle(tier.tier)
  const isMiddle = index === 1

  return (
    <TerminalCard
      className="stagger-child"
      title={`${style.label} Tier`}
      command={`init-tier ${tier.tier.toLowerCase()}`}
      minWidth={220}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
        }}
      >
      {/* Glow orb */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: style.accent,
          opacity: 0.06,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Tier label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: style.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {style.label}
        </span>
        <span style={{ fontSize: 18 }}>{style.icon}</span>
      </div>

      {/* Price */}
      <div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: style.accent,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          ${tier.price.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>per attendee</div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: style.border }} />

      {/* Availability */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: style.accent,
            flexShrink: 0,
            boxShadow: `0 0 8px ${style.accent}`,
          }}
        />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tier.availability}</span>
      </div>
      </div>
    </TerminalCard>
  )
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>Week {label}</div>
      <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
        {payload[0].value.toLocaleString()} attendees
      </div>
    </div>
  )
}

// ─── Revenue Stat Box ─────────────────────────────────────────────────────────
function RevenueStatBox({
  label,
  value,
  accent,
  prefix = '$',
}: {
  label: string
  value: number
  accent: string
  prefix?: string
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 140,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 40,
          borderRadius: '50%',
          background: accent,
          opacity: 0.08,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>
        <AnimatedCounter target={value} prefix={prefix} duration={1200} />
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
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
      <span style={{ fontSize: 14 }}>Pricing results will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PricingPanel() {
  const pricingResult = useConferenceStore((s) => s.results.pricing)

  if (!pricingResult) {
    return <EmptyState />
  }

  const { pricing_tiers, attendance_forecast, revenue_estimate } = pricingResult

  const chartData = attendance_forecast?.chart_data ?? []
  const revEstimate = revenue_estimate ?? { low: 0, expected: 0, high: 0 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Pricing Strategy
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Tiered pricing model with attendance forecast and revenue projections
        </p>
      </div>

      {/* Pricing tier cards */}
      {pricing_tiers?.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11 }}>
            Ticket Tiers
          </h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'stretch' }}>
            {pricing_tiers.map((tier, i) => (
              <PricingTierCard key={tier.tier} tier={tier} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Attendance Forecast Chart */}
      {chartData.length > 0 && (
        <TerminalCard title="Attendance Forecast" command="analyze-forecast">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Attendance Forecast
            </h3>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>
                Expected Total:{' '}
                <strong style={{ color: 'var(--accent-cyan)' }}>
                  {attendance_forecast?.expected_total?.toLocaleString() ?? '—'}
                </strong>
              </span>
              {attendance_forecast?.confidence_range?.length === 2 && (
                <span>
                  Confidence Range:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {attendance_forecast.confidence_range[0].toLocaleString()}–
                    {attendance_forecast.confidence_range[1].toLocaleString()}
                  </strong>
                </span>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#00E5FF"
                strokeWidth={2}
                fill="url(#cyanGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#00E5FF', stroke: '#0A0A0F', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TerminalCard>
      )}

      {/* Revenue Estimate */}
      <div>
        <h3
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          Revenue Projections
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <RevenueStatBox label="Conservative" value={revEstimate.low} accent="var(--accent-orange)" prefix="$" />
          <RevenueStatBox label="Expected" value={revEstimate.expected} accent="var(--accent-cyan)" prefix="$" />
          <RevenueStatBox label="Optimistic" value={revEstimate.high} accent="var(--accent-green)" prefix="$" />
        </div>
      </div>
    </div>
  )
}
