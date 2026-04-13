import { create } from 'zustand'
import type { AgentName, AgentStatus, AllResults, ConferenceInput } from '../types'

interface ConferenceStore {
  // Input
  input: ConferenceInput | null
  setInput: (input: ConferenceInput) => void

  // Session
  sessionId: string | null
  setSessionId: (id: string) => void

  // Agent statuses
  agentStatuses: Record<AgentName, AgentStatus>
  setAgentStatus: (agent: AgentName, status: AgentStatus) => void
  updateAgentStatus: (agent: AgentName, patch: Partial<AgentStatus>) => void

  // Phase
  currentPhase: number
  setPhase: (phase: number) => void

  // Results
  results: AllResults
  setAgentResult: (agent: AgentName, data: unknown) => void
  setAllResults: (results: AllResults) => void

  // Logs
  logs: Array<{ agent: string; message: string; ts: number }>
  addLog: (agent: string, message: string) => void

  // Overall
  isRunning: boolean
  isComplete: boolean
  setRunning: (v: boolean) => void
  setComplete: (v: boolean) => void

  reset: () => void
}

const defaultStatuses = (): Record<AgentName, AgentStatus> => ({
  sponsor: { status: 'queued', progress: 0, message: '' },
  speaker: { status: 'queued', progress: 0, message: '' },
  ticketing: { status: 'queued', progress: 0, message: '' },
  venue: { status: 'queued', progress: 0, message: '' },
  pricing: { status: 'queued', progress: 0, message: '' },
  gtm: { status: 'queued', progress: 0, message: '' },
  ops: { status: 'queued', progress: 0, message: '' },
})

export const useConferenceStore = create<ConferenceStore>((set, get) => ({
  input: null,
  setInput: (input) => set({ input }),

  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),

  agentStatuses: defaultStatuses(),
  setAgentStatus: (agent, status) =>
    set((s) => ({ agentStatuses: { ...s.agentStatuses, [agent]: status } })),
  updateAgentStatus: (agent, patch) =>
    set((s) => ({
      agentStatuses: {
        ...s.agentStatuses,
        [agent]: { ...s.agentStatuses[agent], ...patch },
      },
    })),

  currentPhase: 0,
  setPhase: (phase) => set({ currentPhase: phase }),

  results: {},
  setAgentResult: (agent, data) =>
    set((s) => ({ results: { ...s.results, [agent]: data } })),
  setAllResults: (results) => set({ results }),

  logs: [],
  addLog: (agent, message) =>
    set((s) => ({
      logs: [...s.logs.slice(-200), { agent, message, ts: Date.now() }],
    })),

  isRunning: false,
  isComplete: false,
  setRunning: (v) => set({ isRunning: v }),
  setComplete: (v) => set({ isComplete: v }),

  reset: () =>
    set({
      input: null,
      sessionId: null,
      agentStatuses: defaultStatuses(),
      currentPhase: 0,
      results: {},
      logs: [],
      isRunning: false,
      isComplete: false,
    }),
}))
