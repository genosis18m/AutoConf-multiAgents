import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConferenceStore } from '../store/useConferenceStore'
import { getResults } from '../lib/api'
import { SponsorPanel } from '../components/results/SponsorPanel'
import { SpeakerPanel } from '../components/results/SpeakerPanel'
import { VenuePanel } from '../components/results/VenuePanel'
import { PricingPanel } from '../components/results/PricingPanel'
import { GTMPanel } from '../components/results/GTMPanel'
import { OpsPanel } from '../components/results/OpsPanel'
import { ExportButton } from '../components/results/ExportButton'
import type { AllResults, TicketTier } from '../types'
import clsx from 'clsx'
import { OrbitLoader } from '../components/shared/OrbitLoader'
import { TerminalCard } from '../components/shared/TerminalCard'

const TABS = [
  { id: 'sponsor',   label: 'Sponsors'  },
  { id: 'speaker',   label: 'Speakers'  },
  { id: 'ticketing', label: 'Ticketing' },
  { id: 'venue',     label: 'Venues'    },
  { id: 'pricing',   label: 'Pricing'   },
  { id: 'gtm',       label: 'GTM'       },
  { id: 'ops',       label: 'Operations'},
]

export function ResultsPage() {
  const { sessionId, results, setAllResults, isComplete } = useConferenceStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('sponsor')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!sessionId) { navigate('/'); return }
    if (!isComplete && Object.keys(results).length === 0) {
      setLoading(true)
      getResults(sessionId)
        .then((r) => setAllResults(r.results))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [sessionId, isComplete])

  if (!sessionId) return null

  const activeTabData = TABS.find(t => t.id === activeTab)

  return (
    <div className="p-4 md:p-7 space-y-5 md:space-y-6 animate-page-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="kicker">Step 03 — The Plan</p>
            {sessionId.startsWith('demo_') && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.16em', color: 'var(--iris)', background: 'color-mix(in srgb, var(--iris) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--iris) 35%, transparent)' }}
              >
                DEMO
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', letterSpacing: '-0.03em', color: 'var(--chalk)', marginTop: '0.35rem' }}>
            The conference plan
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--haze)' }}>
            One export-ready brief, assembled by all seven agents.
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Program nav */}
      <div
        className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto"
        style={{ background: 'var(--ink-raise)', border: '1px solid var(--line)' }}
      >
        {TABS.map((tab, i) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-150"
              style={{
                background: isActive ? 'var(--ink-high)' : 'transparent',
                color: isActive ? 'var(--chalk)' : 'var(--haze)',
                border: isActive ? '1px solid var(--line)' : '1px solid transparent',
                boxShadow: isActive ? 'inset 0 2px 0 var(--ember)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--chalk)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'var(--haze)' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: isActive ? 'var(--ember)' : 'var(--faint)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active tab heading */}
      <div className="flex items-center gap-4">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--chalk)' }}>
          {activeTabData?.label}
        </h2>
        <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
      </div>

      {/* Panel content */}
      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <OrbitLoader size={96} label="Loading conference results" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading results…</p>
          </div>
        )}
        {!loading && (
          <>
            {activeTab === 'sponsor'   && <SponsorPanel />}
            {activeTab === 'speaker'   && <SpeakerPanel />}
            {activeTab === 'ticketing' && <TicketingFallback results={results} />}
            {activeTab === 'venue'     && <VenuePanel />}
            {activeTab === 'pricing'   && <PricingPanel />}
            {activeTab === 'gtm'       && <GTMPanel />}
            {activeTab === 'ops'       && <OpsPanel />}
          </>
        )}
      </div>
    </div>
  )
}

// Simple ticketing display (inline, no separate panel file needed)
function TicketingFallback({ results }: { results: AllResults }) {
  const data = results.ticketing
  if (!data) return <EmptyState label="Ticketing" />
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.tiers?.map((tier: TicketTier) => (
          <TerminalCard key={tier.tier} title={tier.tier} command={`init-tier ${tier.tier.toLowerCase()}`} minWidth="auto">
            <div className="space-y-3 stagger-child h-full">
              <p className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                <span className="text-xl font-semibold" style={{ color: 'var(--text-dim)' }}>$</span>
                {tier.price.toLocaleString()}
              </p>
              <p className="text-xs px-2 py-1 rounded-full inline-block" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                {tier.availability}
              </p>
              <ul className="space-y-1.5 pt-1">
                {tier.perks?.map((p: string) => (
                  <li key={p} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </TerminalCard>
        ))}
      </div>
      <div className="glass-card p-5">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Recommended Platform</p>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-indigo)' }}>{data.recommended_platform}</p>
        {data.notes && <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.notes}</p>}
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 rounded-xl gap-3"
      style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)' }}
    >
      <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{label} data not available yet</p>
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Run the agents first from the New Plan page.</p>
    </div>
  )
}
