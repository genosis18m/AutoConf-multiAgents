import { useEffect } from 'react'
import { useConferenceStore } from '../store/useConferenceStore'
import { getStatus, getResults } from '../lib/api'

export function useAgentStatus(sessionId: string | null) {
  const { setAllResults, isComplete, agentStatuses } = useConferenceStore()

  useEffect(() => {
    if (!sessionId || isComplete) return
    const allDone = Object.values(agentStatuses).every((s) => s.status === 'completed' || s.status === 'failed')
    if (allDone) {
      getResults(sessionId).then((r) => setAllResults(r.results)).catch(console.error)
    }
  }, [sessionId, isComplete, agentStatuses, setAllResults])
}
