import { useConferenceStore } from '../../store/useConferenceStore'
import { AgentCard } from './AgentCard'
import type { AgentName } from '../../types'

const AGENTS: AgentName[] = ['sponsor', 'speaker', 'ticketing', 'venue', 'pricing', 'gtm', 'ops']

export function AgentStatusGrid() {
  const { agentStatuses } = useConferenceStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {AGENTS.map((agent, i) => (
        <AgentCard
          key={agent}
          agent={agent}
          status={agentStatuses[agent]}
          delay={i * 80}
        />
      ))}
    </div>
  )
}
