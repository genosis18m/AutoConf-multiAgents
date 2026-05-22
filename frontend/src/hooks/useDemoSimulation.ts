import { useEffect } from 'react'
import { useConferenceStore } from '../store/useConferenceStore'
import type { AgentName } from '../types'

const AGENT_SEQUENCE: AgentName[] = ['sponsor', 'speaker', 'ticketing', 'venue', 'pricing', 'gtm', 'ops']

const DEMO_LOGS: Record<AgentName, string[]> = {
  sponsor: ['Searching sponsor databases…', 'Scoring companies by relevance…', 'Found 15 potential sponsors.'],
  speaker: ['Querying speaker networks…', 'Ranking by influence score…', 'Curated 2 keynote speakers.'],
  ticketing: ['Analysing market pricing…', 'Modelling conversion rates…', 'Ticket tiers finalised.'],
  venue: ['Fetching Google Places data…', 'Comparing capacity & cost…', 'Top 2 venues selected.'],
  pricing: ['Running attendance forecast…', 'Calculating revenue estimates…', 'Pricing model complete.'],
  gtm: ['Mapping target communities…', 'Building GTM channels…', 'Launch strategy ready.'],
  ops: ['Building run-of-show…', 'Creating vendor checklist…', 'Operations plan complete.'],
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

/**
 * Simulates agent-by-agent execution for a demo session.
 * Runs 7 agents one by one (~1s each), totalling ~7s before marking complete.
 */
export function useDemoSimulation(sessionId: string | null) {
  useEffect(() => {
    if (!sessionId || !sessionId.startsWith('demo_')) return

    // Results were pre-loaded into store before navigation
    const storeResults = useConferenceStore.getState().results
    if (Object.keys(storeResults).length === 0) return

    let cancelled = false

    const simulate = async () => {
      const { updateAgentStatus, setPhase, setComplete, setRunning, addLog } =
        useConferenceStore.getState()

      setRunning(true)
      addLog('system', '▶ Demo mode — simulating agent execution…')
      setPhase(1)

      for (let i = 0; i < AGENT_SEQUENCE.length; i++) {
        if (cancelled) return
        const agent = AGENT_SEQUENCE[i]

        // Phase transitions
        if (agent === 'pricing') setPhase(2)
        if (agent === 'gtm') setPhase(3)
        if (agent === 'ops') setPhase(4)

        // Step 1: running at 10%
        useConferenceStore.getState().updateAgentStatus(agent, { status: 'running', progress: 10, message: DEMO_LOGS[agent][0] })
        useConferenceStore.getState().addLog(agent, DEMO_LOGS[agent][0])
        await delay(450)
        if (cancelled) return

        // Step 2: running at 60%
        useConferenceStore.getState().updateAgentStatus(agent, { status: 'running', progress: 60, message: DEMO_LOGS[agent][1] })
        useConferenceStore.getState().addLog(agent, DEMO_LOGS[agent][1])
        await delay(450)
        if (cancelled) return

        // Step 3: completed 100%
        useConferenceStore.getState().updateAgentStatus(agent, { status: 'completed', progress: 100, message: DEMO_LOGS[agent][2] })
        useConferenceStore.getState().addLog(agent, DEMO_LOGS[agent][2])
        await delay(300)
      }

      if (cancelled) return
      useConferenceStore.getState().addLog('system', '✅ All 7 agents completed!')
      useConferenceStore.getState().setRunning(false)
      useConferenceStore.getState().setComplete(true)
    }

    simulate()
    return () => { cancelled = true }
  }, [sessionId])
}
