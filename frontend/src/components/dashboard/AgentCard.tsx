import { AgentStatus } from '../../types'
import { AGENT_LABELS } from '../../lib/constants'
import { CyberCard } from '../shared/CyberCard'

interface AgentCardProps {
  agent: string
  status: AgentStatus
  delay?: number
}

export function AgentCard({ agent, status, delay = 0 }: AgentCardProps) {
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="stagger-child">
      <CyberCard
        agentId={String(['sponsor','speaker','ticketing','venue','pricing','gtm','ops'].indexOf(agent) + 1)}
        name={AGENT_LABELS[agent as keyof typeof AGENT_LABELS]}
        status={status.status}
        logs={[status.message || '']}
      />
    </div>
  )
}
