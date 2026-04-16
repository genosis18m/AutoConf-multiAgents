import React from 'react'
import { TerminalCard } from '../shared/TerminalCard'
import { useConferenceStore } from '../../store/useConferenceStore'
import type { OpsTask } from '../../types'

// ─── Run of Show Timeline ─────────────────────────────────────────────────────
function RunOfShowTimeline({ tasks }: { tasks: OpsTask[] }) {
  if (!tasks?.length) return null

  return (
    <div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Run of Show
      </h3>

      {/* Table layout */}
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
              {['Time', 'Task', 'Owner', 'Notes'].map((h) => (
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr
                key={i}
                className="stagger-child"
                style={{
                  borderBottom: i < tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,229,255,0.03)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                }}
              >
                {/* Time */}
                <td
                  style={{
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--accent-cyan)',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'top',
                    width: 110,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-cyan)',
                        boxShadow: '0 0 6px var(--accent-cyan)',
                        flexShrink: 0,
                      }}
                    />
                    {task.time}
                  </div>
                </td>
                {/* Task */}
                <td
                  style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    verticalAlign: 'top',
                  }}
                >
                  {task.task}
                </td>
                {/* Owner */}
                <td
                  style={{
                    padding: '12px 16px',
                    verticalAlign: 'top',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: 'rgba(179,136,255,0.1)',
                      color: 'var(--accent-purple)',
                      border: '1px solid rgba(179,136,255,0.2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {task.owner}
                  </span>
                </td>
                {/* Notes */}
                <td
                  style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    verticalAlign: 'top',
                  }}
                >
                  {task.notes || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Vendor Checklist ─────────────────────────────────────────────────────────
function VendorChecklist({ items }: { items: string[] }) {
  if (!items?.length) return null

  return (
    <div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        Vendor Checklist
      </h3>
      <TerminalCard title="Vendor Checklist" command="run-vendor-checks">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 8,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="stagger-child"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: 'rgba(0,230,118,0.04)',
                border: '1px solid rgba(0,230,118,0.12)',
                transition: 'background 150ms ease',
              }}
            >
              {/* Pre-checked checkbox */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 8px rgba(0,230,118,0.3)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </TerminalCard>
    </div>
  )
}

// ─── Contingency Plans ────────────────────────────────────────────────────────
function ContingencyPlans({ plans }: { plans: string[] }) {
  if (!plans?.length) return null

  return (
    <div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Contingency Plans
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            className="stagger-child"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 10,
              background: 'rgba(255,167,38,0.06)',
              border: '1px solid rgba(255,167,38,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Warning icon */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(255,167,38,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#FFD180',
                margin: 0,
              }}
            >
              {plan}
            </p>
          </div>
        ))}
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      <span style={{ fontSize: 14 }}>Operations plan will appear here once the agent completes.</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OpsPanel() {
  const opsResult = useConferenceStore((s) => s.results.ops)

  if (!opsResult) {
    return <EmptyState />
  }

  const { run_of_show, vendor_checklist, contingency_plans } = opsResult

  const hasContent =
    run_of_show?.length || vendor_checklist?.length || contingency_plans?.length

  if (!hasContent) {
    return <EmptyState />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Operations Plan
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Run-of-show schedule, vendor checklist, and contingency planning
        </p>
      </div>

      {/* Run of Show */}
      {run_of_show?.length > 0 && <RunOfShowTimeline tasks={run_of_show} />}

      {/* Divider */}
      {run_of_show?.length > 0 && (vendor_checklist?.length > 0 || contingency_plans?.length > 0) && (
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      )}

      {/* Vendor Checklist */}
      {vendor_checklist?.length > 0 && <VendorChecklist items={vendor_checklist} />}

      {/* Divider */}
      {vendor_checklist?.length > 0 && contingency_plans?.length > 0 && (
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      )}

      {/* Contingency Plans */}
      {contingency_plans?.length > 0 && <ContingencyPlans plans={contingency_plans} />}
    </div>
  )
}
