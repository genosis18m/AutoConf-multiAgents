export type AgentName = 'sponsor' | 'speaker' | 'ticketing' | 'venue' | 'pricing' | 'gtm' | 'ops'
export type AgentStatusType = 'queued' | 'running' | 'completed' | 'failed'

export interface AgentStatus {
  status: AgentStatusType
  progress: number
  message: string
  started_at?: string
  completed_at?: string
}

export interface ConferenceInput {
  category: string
  geography: string
  audience_size: number
  budget?: number
}

export interface Session {
  session_id: string
  status: string
}

// Sponsor
export interface SponsorContact { email?: string; linkedin?: string }
export interface Sponsor {
  rank: number
  company_name: string
  industry: string
  relevance_score: number
  estimated_budget: string
  contact_info: SponsorContact
  rationale: string
  outreach_email: string
}
export interface SponsorResult { sponsors: Sponsor[]; total_found: number; search_queries_used: string[] }

// Speaker
export interface Speaker {
  name: string; title: string; organization: string
  relevance_score: number; influence_score: number
  topics: string[]; suggested_slot: string
  bio_summary: string; source_url?: string
}
export interface AgendaSlot { time_slot: string; speaker: string; topic: string }
export interface SpeakerResult { speakers: Speaker[]; agenda_mapping: AgendaSlot[] }

// Ticketing
export interface TicketTier { tier: string; price: number; availability: string; perks: string[] }
export interface TicketingResult {
  tiers: TicketTier[]
  conversion_estimates: Record<string, number>
  recommended_platform: string
  notes: string
}

// Venue
export interface Venue {
  rank: number; name: string; address: string; city: string
  capacity: number; estimated_cost: string; rating: number
  pros: string[]; cons: string[]
  google_maps_url: string; google_place_id?: string
}
export interface VenueResult { venues: Venue[] }

// Pricing
export interface PricingTier { tier: string; price: number; availability: string }
export interface ForecastPoint { week: string; cumulative: number; weekly: number }
export interface AttendanceForecast {
  expected_total: number
  confidence_range: number[]
  chart_data: ForecastPoint[]
}
export interface RevenueEstimate { low: number; expected: number; high: number }
export interface PricingResult {
  pricing_tiers: PricingTier[]
  attendance_forecast: AttendanceForecast
  revenue_estimate: RevenueEstimate
}

// GTM
export interface GTMChannel {
  channel: string; strategy: string
  message_template: string; target_communities: string[]
}
export interface GTMResult {
  channels: GTMChannel[]
  timeline: Array<{ week: string; action: string }>
  key_messages: string[]
}

// Ops
export interface OpsTask { time: string; task: string; owner: string; notes: string }
export interface OpsResult {
  run_of_show: OpsTask[]
  vendor_checklist: string[]
  contingency_plans: string[]
}

// Aggregated results
export interface AllResults {
  sponsor?: SponsorResult
  speaker?: SpeakerResult
  ticketing?: TicketingResult
  venue?: VenueResult
  pricing?: PricingResult
  gtm?: GTMResult
  ops?: OpsResult
}

// WebSocket messages
export interface WSMessage {
  type: 'agent_status' | 'agent_result' | 'phase_change' | 'error' | 'complete'
  agent?: AgentName
  status?: AgentStatusType
  progress?: number
  message?: string
  data?: unknown
  phase?: number
  session_id?: string
}
