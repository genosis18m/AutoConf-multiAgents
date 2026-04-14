import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategorySelector } from './CategorySelector'
import { SpeederLoader } from '../shared/SpeederLoader'
import { useConferenceStore } from '../../store/useConferenceStore'
import { startGeneration } from '../../lib/api'
import { MapPin, Users, DollarSign } from 'lucide-react'

export function ConferenceForm() {
  const navigate = useNavigate()
  const { setInput, setSessionId, reset } = useConferenceStore()

  const [category, setCategory] = useState('AI')
  const [geography, setGeography] = useState('')
  const [audienceSize, setAudienceSize] = useState(500)
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!geography.trim()) { setError('Please enter a geography / city.'); return }

    setError('')
    setLoading(true)
    reset()

    try {
      const input = {
        category,
        geography: geography.trim(),
        audience_size: audienceSize,
        budget: budget ? parseFloat(budget) : undefined,
      }
      setInput(input)
      const session = await startGeneration(input)
      setSessionId(session.session_id)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to start generation'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="generation-loader-panel">
          <div className="generation-loader-stage">
            <div className="generation-loader-rails">
              <span />
              <span />
              <span />
              <span />
            </div>
            <SpeederLoader label="Generating conference plan" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Launching your conference agents
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We&apos;re starting the workflow and opening the live dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6">
      {/* Category */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Conference Category
        </label>
        <CategorySelector value={category} onChange={setCategory} />
      </div>

      {/* Geography */}
      <div className="space-y-2.5">
        <label className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Geography / City
        </label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--accent-cyan)' }} />
          <input
            type="text"
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
            placeholder="e.g. Bengaluru, India or New York, USA"
            className="w-full rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              caretColor: 'var(--accent-cyan)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00E5FF')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>
      </div>

      {/* Audience Size + Budget */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Target Audience Size
          </label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--accent-cyan)' }} />
            <input
              type="number"
              value={audienceSize}
              onChange={(e) => setAudienceSize(Number(e.target.value))}
              min={50}
              max={50000}
              className="w-full rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00E5FF')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Budget (optional)
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--accent-cyan)' }} />
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 50000"
              min={0}
              className="w-full rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00E5FF')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#FF5252', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)' }}>
          {error}
        </p>
      )}

      <button type="submit" className="generate-button w-full">
        <span className="generate-button__text">Create Plan</span>
        <span className="generate-button__icon" aria-hidden="true">
          <svg viewBox="0 0 72 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 21H48"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M38 9L56 21L38 33"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M58 14L64 21L58 28"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          </svg>
        </span>
      </button>
    </form>
  )
}
