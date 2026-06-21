import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useConferenceStore } from '../../store/useConferenceStore'
import { startGeneration } from '../../lib/api'
import { CONFERENCE_CATEGORIES } from '../../lib/constants'
import { OrbitLoader } from '../shared/OrbitLoader'

const StyledForm = styled.div`
  width: 100%;

  .pass {
    position: relative;
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%),
      var(--ink-raise);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  /* perforated stub header */
  .stub {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 22px;
    border-bottom: 1px dashed var(--line);
    background: rgba(255, 106, 61, 0.05);
  }
  .stub-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.06rem;
    letter-spacing: -0.01em;
    color: var(--chalk);
  }
  .stub-tag {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ember);
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ember) 35%, transparent);
    background: color-mix(in srgb, var(--ember) 10%, transparent);
  }

  .body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

  .field label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--faint);
    margin-bottom: 7px;
  }

  .field input,
  .field select {
    width: 100%;
    background: var(--ink);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--chalk);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    appearance: none;
  }
  .field input::placeholder { color: var(--faint); }

  .field select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6A3D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }
  .field select option { background: var(--ink-high); color: var(--chalk); }

  .field input:focus,
  .field select:focus {
    border-color: var(--ember);
    box-shadow: 0 0 0 3px rgba(255, 106, 61, 0.16);
  }

  .field .hint { margin-top: 6px; font-size: 0.74rem; color: var(--faint); }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .error-msg {
    font-size: 0.8rem;
    color: var(--accent-red);
    border-left: 2px solid var(--accent-red);
    padding-left: 10px;
  }
`

export function ConferenceForm() {
  const navigate = useNavigate()
  const { setInput, setSessionId, reset } = useConferenceStore()

  const [category, setCategory] = useState(CONFERENCE_CATEGORIES[0].id)
  const [geography, setGeography] = useState('')
  const [audienceSize, setAudienceSize] = useState<number>(0)
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCat = CONFERENCE_CATEGORIES.find((c) => c.id === category) ?? CONFERENCE_CATEGORIES[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!geography.trim()) { setError('Add a host city or region to brief the agents.'); return }

    setError('')
    setLoading(true)
    reset()

    try {
      const input = {
        category,
        geography: geography.trim(),
        audience_size: Number(audienceSize),
        budget: budget ? parseFloat(budget) : undefined,
      }
      setInput(input)
      const session = await startGeneration(input)
      setSessionId(session.session_id)
      setLoading(false)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed'
      setError(msg)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <StyledForm>
        <div className="pass" style={{ minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
          <OrbitLoader size={84} label="Dispatching agents" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--chalk)' }}>
              Dispatching the crew
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--faint)', marginTop: 8, textTransform: 'uppercase' }}>
              Briefing 7 agents · opening the floor
            </p>
          </div>
        </div>
      </StyledForm>
    )
  }

  return (
    <StyledForm>
      <form className="pass" onSubmit={handleSubmit}>
        <div className="stub">
          <span className="stub-title">The Brief</span>
          <span className="stub-tag">Entry Pass</span>
        </div>

        <div className="body">
          <div className="field">
            <label htmlFor="cat">Category</label>
            <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CONFERENCE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon}  {cat.label}</option>
              ))}
            </select>
            <p className="hint">{selectedCat.desc}</p>
          </div>

          <div className="field">
            <label htmlFor="geo">Host city or region</label>
            <input
              id="geo"
              type="text"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              placeholder="e.g. Berlin, Bay Area, Singapore"
            />
          </div>

          <div className="two-col">
            <div className="field">
              <label htmlFor="aud">Attendees</label>
              <input id="aud" type="number" value={audienceSize || ''} onChange={(e) => setAudienceSize(Number(e.target.value))} min={50} max={50000} placeholder="2,000" />
            </div>
            <div className="field">
              <label htmlFor="bgt">Budget (USD)</label>
              <input id="bgt" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min={0} placeholder="optional" />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="generate-button" style={{ width: '100%', marginTop: 2 }}>
            <span className="generate-button__text">Open the floor</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </StyledForm>
  )
}
