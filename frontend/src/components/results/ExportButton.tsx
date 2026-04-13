import React, { useState } from 'react'
import { GlowButton } from '../shared/GlowButton'
import { useConferenceStore } from '../../store/useConferenceStore'
import { exportPDF } from '../../lib/api'

// ─── Download icon ────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

// ─── Success icon ─────────────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── ExportButton ─────────────────────────────────────────────────────────────
interface ExportButtonProps {
  /** Optional override for the session ID (defaults to store's sessionId) */
  sessionId?: string
  /** Visual size passed to GlowButton */
  size?: 'sm' | 'md' | 'lg'
  /** Extra className forwarded to GlowButton */
  className?: string
  /** Label text (default: "Export PDF") */
  label?: string
}

type ExportState = 'idle' | 'loading' | 'success' | 'error'

export function ExportButton({
  sessionId: propSessionId,
  size = 'md',
  className,
  label = 'Export PDF',
}: ExportButtonProps) {
  const storeSessionId = useConferenceStore((s) => s.sessionId)
  const sessionId = propSessionId ?? storeSessionId

  const [exportState, setExportState] = useState<ExportState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleExport = async () => {
    if (!sessionId) {
      setErrorMessage('No active session. Please run the analysis first.')
      setExportState('error')
      return
    }

    setExportState('loading')
    setErrorMessage(null)

    try {
      const blob = await exportPDF(sessionId)

      // Build a local object URL and trigger browser download
      const url = URL.createObjectURL(blob)
      const filename = `conference-plan-${sessionId.slice(0, 8)}.pdf`

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)

      // Clean up the object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 10_000)

      setExportState('success')
      // Reset back to idle after 3 s so the button can be clicked again
      setTimeout(() => setExportState('idle'), 3000)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to export PDF. Please try again.'
      setErrorMessage(message)
      setExportState('error')
      // Reset to idle after 6 s so the user can retry
      setTimeout(() => {
        setExportState('idle')
        setErrorMessage(null)
      }, 6000)
    }
  }

  const isLoading = exportState === 'loading'
  const isSuccess = exportState === 'success'
  const isError = exportState === 'error'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <GlowButton
        onClick={handleExport}
        loading={isLoading}
        disabled={isLoading || isSuccess || !sessionId}
        size={size}
        variant={isSuccess ? 'secondary' : 'primary'}
        className={className}
      >
        {isSuccess ? (
          <>
            <SuccessIcon />
            Downloaded
          </>
        ) : isError ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Retry Export
          </>
        ) : (
          <>
            {!isLoading && <DownloadIcon />}
            {isLoading ? 'Generating PDF…' : label}
          </>
        )}
      </GlowButton>

      {/* Inline error message */}
      {isError && errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.3)',
            fontSize: 12,
            color: '#FF9A7A',
            maxWidth: 320,
            lineHeight: 1.5,
            animation: 'fade-in-up 0.2s ease forwards',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginTop: 1, flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* No session warning (idle, no session) */}
      {!sessionId && exportState === 'idle' && (
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-dim)',
            fontStyle: 'italic',
          }}
        >
          Complete an analysis to enable export.
        </div>
      )}
    </div>
  )
}
