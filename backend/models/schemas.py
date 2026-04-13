from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
import uuid


# ── Request / Input ──────────────────────────────────────────────────────────

class ConferenceInput(BaseModel):
    category: str = Field(..., example="AI")
    geography: str = Field(..., example="India")
    audience_size: int = Field(..., gt=0, example=500)
    budget: Optional[float] = Field(None, example=50000)


# ── Session ───────────────────────────────────────────────────────────────────

class SessionCreate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    geography: str
    audience_size: int
    budget: Optional[float] = None
    status: str = "pending"


class SessionResponse(BaseModel):
    session_id: str
    status: str


# ── Agent Status ──────────────────────────────────────────────────────────────

class AgentStatus(BaseModel):
    status: str = "queued"   # queued | running | completed | failed
    progress: int = 0
    message: str = ""
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class AllAgentsStatus(BaseModel):
    session_id: str
    overall_status: str
    agents: dict[str, AgentStatus]


# ── Agent Result Payloads ─────────────────────────────────────────────────────

class SponsorContact(BaseModel):
    email: Optional[str] = None
    linkedin: Optional[str] = None


class Sponsor(BaseModel):
    rank: int
    company_name: str
    industry: str
    relevance_score: float
    estimated_budget: str
    contact_info: SponsorContact
    rationale: str
    outreach_email: str


class SponsorResult(BaseModel):
    sponsors: list[Sponsor]
    total_found: int
    search_queries_used: list[str]


class Speaker(BaseModel):
    name: str
    title: str
    organization: str
    relevance_score: float
    influence_score: float
    topics: list[str]
    suggested_slot: str
    bio_summary: str
    source_url: Optional[str] = None


class AgendaSlot(BaseModel):
    time_slot: str
    speaker: str
    topic: str


class SpeakerResult(BaseModel):
    speakers: list[Speaker]
    agenda_mapping: list[AgendaSlot]


class TicketTier(BaseModel):
    tier: str
    price: float
    availability: str
    perks: list[str] = []


class TicketingResult(BaseModel):
    tiers: list[TicketTier]
    conversion_estimates: dict[str, float]
    recommended_platform: str
    notes: str


class Venue(BaseModel):
    rank: int
    name: str
    address: str
    city: str
    capacity: int
    estimated_cost: str
    rating: float
    pros: list[str]
    cons: list[str]
    google_maps_url: str
    google_place_id: Optional[str] = None


class VenueResult(BaseModel):
    venues: list[Venue]


class PricingTier(BaseModel):
    tier: str
    price: float
    availability: str


class AttendanceForecastPoint(BaseModel):
    week: str
    cumulative: int
    weekly: int


class AttendanceForecast(BaseModel):
    expected_total: int
    confidence_range: list[int]
    chart_data: list[AttendanceForecastPoint]


class RevenueEstimate(BaseModel):
    low: float
    expected: float
    high: float


class PricingResult(BaseModel):
    pricing_tiers: list[PricingTier]
    attendance_forecast: AttendanceForecast
    revenue_estimate: RevenueEstimate


class GTMChannel(BaseModel):
    channel: str
    strategy: str
    message_template: str
    target_communities: list[str]


class GTMResult(BaseModel):
    channels: list[GTMChannel]
    timeline: list[dict[str, str]]
    key_messages: list[str]


class OpsTask(BaseModel):
    time: str
    task: str
    owner: str
    notes: str = ""


class OpsResult(BaseModel):
    run_of_show: list[OpsTask]
    vendor_checklist: list[str]
    contingency_plans: list[str]


# ── WebSocket Messages ────────────────────────────────────────────────────────

class WSAgentStatus(BaseModel):
    type: str = "agent_status"
    agent: str
    status: str
    progress: int
    message: str


class WSAgentResult(BaseModel):
    type: str = "agent_result"
    agent: str
    data: Any


class WSPhaseChange(BaseModel):
    type: str = "phase_change"
    phase: int
    message: str


class WSError(BaseModel):
    type: str = "error"
    agent: str
    message: str


class WSComplete(BaseModel):
    type: str = "complete"
    session_id: str
    message: str


# ── API Responses ─────────────────────────────────────────────────────────────

class ResultsResponse(BaseModel):
    session_id: str
    results: dict[str, Any]


class AgentResultResponse(BaseModel):
    agent: str
    data: Any
