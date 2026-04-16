import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { CategorySelector } from './CategorySelector'
import { MatrixLoader } from '../shared/MatrixLoader'
import { NuclearButton } from '../shared/NuclearButton'
import { useConferenceStore } from '../../store/useConferenceStore'
import { startGeneration } from '../../lib/api'

/* ── Glitch animation ── */
const glitchAnim = keyframes`
  0%   { transform: translate(0);       clip-path: inset(0 0 0 0); }
  20%  { transform: translate(-5px,3px); clip-path: inset(50% 0 20% 0); }
  40%  { transform: translate(3px,-2px); clip-path: inset(20% 0 60% 0); }
  60%  { transform: translate(-4px,2px); clip-path: inset(80% 0 5% 0); }
  80%  { transform: translate(4px,-3px); clip-path: inset(30% 0 45% 0); }
  100% { transform: translate(0);       clip-path: inset(0 0 0 0); }
`

const StyledForm = styled.div`
  --bg-color:      #0d1117;
  --primary-color: #4f8ef7;
  --secondary-color: #9b8fdb;
  --text-color:    #e6edf3;
  --font-family:   'JetBrains Mono', 'Fira Code', Consolas, monospace;

  font-family: var(--font-family);

  .glitch-card {
    background-color: var(--bg-color);
    width: 100%;
    border: 1px solid rgba(79,142,247,0.2);
    box-shadow:
      0 0 20px rgba(79,142,247,0.08),
      inset 0 0 10px rgba(0,0,0,0.5);
    overflow: hidden;
    border-radius: 4px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0,0,0,0.3);
    padding: 0.5em 1em;
    border-bottom: 1px solid rgba(79,142,247,0.2);
  }

  .card-title {
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .card-dots span {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #30363d;
    margin-left: 5px;
  }

  .card-body { padding: 1.4rem; }

  /* ── form group ── */
  .form-group {
    position: relative;
    margin-bottom: 1.6rem;
  }

  .form-label {
    position: absolute;
    top: 0.7em; left: 0;
    font-size: 0.9rem;
    color: var(--primary-color);
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(79,142,247,0.3);
    padding: 0.7em 0;
    font-size: 0.95rem;
    color: var(--text-color);
    font-family: inherit;
    outline: none;
    transition: border-color 0.3s ease;
    appearance: none;
  }

  .form-group select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234f8ef7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 4px center;
    padding-right: 28px;
  }

  .form-group select option { background: #161b22; color: #e6edf3; }

  .form-group input:focus,
  .form-group select:focus { border-color: var(--primary-color); }

  .form-group input:focus + .form-label,
  .form-group input:not(:placeholder-shown) + .form-label {
    top: -1.2em;
    font-size: 0.72rem;
    opacity: 1;
  }

  /* select always shows label at top */
  .form-label.always-up {
    top: -1.2em;
    font-size: 0.72rem;
    opacity: 1;
  }

  .form-group input:focus + .form-label::before,
  .form-group input:focus + .form-label::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: var(--bg-color);
  }

  .form-group input:focus + .form-label::before {
    color: var(--secondary-color);
    animation: ${glitchAnim} 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both;
  }

  .form-group input:focus + .form-label::after {
    color: var(--primary-color);
    animation: ${glitchAnim} 0.5s cubic-bezier(0.25,0.46,0.45,0.94) reverse both;
  }

  .two-col {
    display: grid;
    padding: 2rem;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .error-msg {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #e07a5f;
    letter-spacing: 0.04em;
    border-left: 2px solid #e07a5f;
    padding-left: 0.5rem;
  }
`

export function ConferenceForm() {
  const navigate = useNavigate()
  const { setInput, setSessionId, reset } = useConferenceStore()

  const [category, setCategory] = useState('')
  const [geography, setGeography] = useState('')
  const [audienceSize, setAudienceSize] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!geography.trim()) { setError('ERR: geography cannot be empty'); return }

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
      const msg = err instanceof Error ? err.message : 'Connection failed'
      setError(`ERR: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <MatrixLoader label="Launching conference agents" />
        <div className="text-center" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4f8ef7', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
          INITIALISING_WORKFLOW… PLEASE_WAIT
        </div>
      </div>
    )
  }

  return (
    <StyledForm>
      <form className="glitch-card" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="card-header">
          <div className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              <path d="M12 11.5a3 3 0 0 0 -3 2.824v1.176a3 3 0 0 0 6 0v-1.176a3 3 0 0 0 -3 -2.824z" />
            </svg>
            <span>CONFERENCE MASTERMIND</span>
          </div>
          <div className="card-dots"><span /><span /><span /></div>
        </div>

        {/* Body */}
        <div className="card-body space-y-2">
          {/* Category */}
          <div className="form-group">
            <label className="form-label always-up" data-text="CATEGORY">CATEGORY</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ marginTop: '1.6rem' }}
            >
              <CategoryOptions />
            </select>
          </div>

          {/* Geography */}
          <div className="form-group">
            <input
              type="text"
              value={geography}
              onChange={e => setGeography(e.target.value)}
              placeholder=" "
              id="geo"
            />
            <label htmlFor="geo" className="form-label" data-text="LOCATION">LOCATION</label>
          </div>
          {/* Audience + Budget */}
          <div className="two-col">
            <div className="form-group">
              <input
                type="number"
                value={audienceSize}
                onChange={e => setAudienceSize(Number(e.target.value))}
                min={50}
                max={50000}
                placeholder=" "
                id="aud"
              />
              <label htmlFor="aud" className="form-label" data-text="ATTENDEES">ATTENDEES</label>
            </div>
            <div className="form-group">
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder=" "
                id="bgt"
                min={0}
              />
              <label htmlFor="bgt" className="form-label" data-text="BUDGET_USD">BUDGET</label>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div style={{ marginBlockEnd: '1rem' }}>
            <NuclearButton type="submit" />
          </div>
        </div>
      </form>
    </StyledForm>
  )
}

/* Inline options helper so CategorySelector's select can be reused */
import { CONFERENCE_CATEGORIES } from '../../lib/constants'
function CategoryOptions() {
  return (
    <>
      {CONFERENCE_CATEGORIES.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.label}</option>
      ))}
    </>
  )
}
