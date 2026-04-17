const backendBase = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/+$/, '')

export const API_BASE = backendBase ? `${backendBase}/api` : '/api'

export const WS_BASE = (sessionId: string) => {
  if (backendBase) {
    const wsBase = backendBase.startsWith('https://')
      ? backendBase.replace('https://', 'wss://')
      : backendBase.startsWith('http://')
        ? backendBase.replace('http://', 'ws://')
        : backendBase
    return `${wsBase}/ws/${sessionId}`
  }

  if (typeof window === 'undefined') return `ws://localhost:5173/ws/${sessionId}`
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws/${sessionId}`
}

export const AGENT_LABELS: Record<string, string> = {
  sponsor: 'Sponsor Research',
  speaker: 'Speaker Curation',
  ticketing: 'Ticketing Strategy',
  venue: 'Venue Selection',
  pricing: 'Pricing & Footfall',
  gtm: 'GTM & Comms',
  ops: 'Ops & Logistics',
}

export const AGENT_ICONS: Record<string, string> = {
  sponsor: '💰',
  speaker: '🎤',
  ticketing: '🎫',
  venue: '🏛️',
  pricing: '📊',
  gtm: '📣',
  ops: '⚙️',
}

export const AGENT_PHASES: Record<string, number> = {
  sponsor: 1,
  speaker: 1,
  ticketing: 1,
  venue: 1,
  pricing: 2,
  gtm: 3,
  ops: 4,
}

export const CONFERENCE_CATEGORIES = [
  { id: 'AI', label: 'Artificial Intelligence', icon: '🤖', desc: 'ML, LLMs, AI agents' },
  { id: 'Web3', label: 'Web3 & Blockchain', icon: '⛓️', desc: 'DeFi, NFTs, crypto' },
  { id: 'SaaS', label: 'SaaS & Cloud', icon: '☁️', desc: 'B2B software, cloud' },
  { id: 'Fintech', label: 'Fintech', icon: '💳', desc: 'Payments, banking, crypto' },
  { id: 'DevTools', label: 'Developer Tools', icon: '🛠️', desc: 'Dev productivity' },
  { id: 'Design', label: 'Design & UX', icon: '🎨', desc: 'Product design, UX research' },
  { id: 'Cybersecurity', label: 'Cybersecurity', icon: '🔐', desc: 'InfoSec, privacy' },
  { id: 'Gaming', label: 'Gaming & Esports', icon: '🎮', desc: 'Game dev, esports' },
]
