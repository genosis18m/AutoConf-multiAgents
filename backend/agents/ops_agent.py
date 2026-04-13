from crewai import Agent, Task, Crew, LLM
from config import settings
import json
import logging
import re

logger = logging.getLogger(__name__)


def get_llm():
    if settings.groq_api_key:
        return LLM(model="groq/llama-3.3-70b-versatile", api_key=settings.groq_api_key)
    if settings.gemini_api_key:
        return LLM(model="gemini/gemini-2.0-flash", api_key=settings.gemini_api_key)
    raise ValueError("No LLM API key configured.")


async def run_ops_agent(category: str, geography: str, audience_size: int, all_data: dict = None) -> dict:
    try:
        llm = get_llm()

        agent = Agent(
            role="Event Operations & Logistics Manager",
            goal=f"Build a complete day-of run-of-show, vendor checklist, and contingency plan for the {category} conference.",
            backstory=(
                "You are a seasoned event operations director who has run flawless 500+ person conferences "
                "for 15 years. From AV setup at 5 AM to post-event teardown, you know every moving part. "
                "You write run-of-show documents that event staff can follow blindly."
            ),
            llm=llm,
            verbose=True,
            max_iter=2,
        )

        task = Task(
            description=f"""
Create a complete operational plan for:
- {category} Conference in {geography}
- {audience_size} attendees, 2-day event

Build:
1. Minute-by-minute run-of-show for both days
2. Complete vendor/equipment checklist
3. Contingency plans for 5 common failure scenarios

Return ONLY valid JSON:
{{
  "run_of_show": [
    {{"time": "Day 1 - 07:00 AM", "task": "Venue setup begins — AV team arrives", "owner": "Ops Lead", "notes": "Check mic, projector, WiFi"}},
    {{"time": "Day 1 - 08:00 AM", "task": "Registration desk opens", "owner": "Volunteer Team", "notes": "Have badge printer + extra badges ready"}},
    {{"time": "Day 1 - 09:00 AM", "task": "Doors open for attendees", "owner": "All Hands", "notes": "Post volunteers at entrance"}},
    {{"time": "Day 1 - 10:00 AM", "task": "Opening keynote begins", "owner": "Emcee", "notes": "Speaker on stage 5 min early for soundcheck"}},
    {{"time": "Day 1 - 01:00 PM", "task": "Networking lunch", "owner": "Catering Team", "notes": "Ensure vegetarian options labeled clearly"}},
    {{"time": "Day 1 - 06:00 PM", "task": "Day 1 wrap-up and networking mixer", "owner": "Emcee", "notes": "Announce Day 2 highlights"}},
    {{"time": "Day 2 - 10:00 AM", "task": "Day 2 keynote begins", "owner": "Emcee", "notes": ""}},
    {{"time": "Day 2 - 05:00 PM", "task": "Closing ceremony and awards", "owner": "Event Director", "notes": "Prepare certificates and trophies"}}
  ],
  "vendor_checklist": [
    "AV vendor: microphones (1 per speaker + 2 backup), projector, HDMI cables, clicker",
    "Catering: morning snacks, lunch x2, evening refreshments, water stations",
    "Photography/Videography: event photographer + videographer for both days",
    "Registration: badge printer, lanyards, name badge stock, registration software",
    "Signage: directional signs, sponsor banners, stage backdrop, social wall",
    "WiFi: dedicated conference WiFi with 500+ device capacity",
    "Security: 2 security personnel for both days",
    "First Aid: first aid kit, EMT on-call",
    "Power: extension cords, power strips, generator backup"
  ],
  "contingency_plans": [
    "Speaker no-show: Have backup speaker from attendee list + pre-recorded session ready",
    "AV failure: Backup laptop pre-loaded with all presentations, handheld mic as fallback",
    "Venue issue: Identify alternate venue within 2km radius as backup",
    "Low ticket sales: Activate emergency GTM push 3 weeks before, offer group discounts",
    "Sponsor pullout: Have 2 backup sponsors at 80% commitment for each tier"
  ]
}}
""",
            expected_output="A JSON object with run_of_show, vendor_checklist, and contingency_plans.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)

        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group())

        return _mock_ops_result(category, geography, audience_size)

    except Exception as e:
        logger.error(f"Ops agent error: {e}")
        return _mock_ops_result(category, geography, audience_size)


def _mock_ops_result(category: str, geography: str, audience_size: int) -> dict:
    return {
        "run_of_show": [
            {"time": "Day 1 — 07:00 AM", "task": "Venue access, AV team setup begins", "owner": "Ops Lead", "notes": "Confirm WiFi credentials, check HDMI adapters"},
            {"time": "Day 1 — 08:00 AM", "task": "Registration desk opens, volunteer briefing", "owner": "Registration Lead", "notes": "Badge printer warmed up, QR scanner tested"},
            {"time": "Day 1 — 09:00 AM", "task": "Doors open, welcome music plays", "owner": "All Hands", "notes": "Volunteers at entrance and info desk"},
            {"time": "Day 1 — 09:45 AM", "task": "Opening keynote speaker soundcheck", "owner": "AV Team", "notes": "5-minute test run on stage"},
            {"time": "Day 1 — 10:00 AM", "task": f"Opening keynote: Future of {category}", "owner": "Emcee", "notes": "Live stream starts"},
            {"time": "Day 1 — 11:30 AM", "task": "Speaker session 2", "owner": "Emcee", "notes": ""},
            {"time": "Day 1 — 01:00 PM", "task": "Networking lunch", "owner": "Catering Team", "notes": "Vegetarian options clearly labeled"},
            {"time": "Day 1 — 02:00 PM", "task": "Workshop / breakout sessions begin", "owner": "Session Leads", "notes": "3 parallel tracks"},
            {"time": "Day 1 — 04:00 PM", "task": "Panel discussion", "owner": "Emcee", "notes": "Q&A moderated"},
            {"time": "Day 1 — 05:30 PM", "task": "Day 1 wrap + networking mixer", "owner": "Event Director", "notes": "Announce Day 2 schedule"},
            {"time": "Day 2 — 09:30 AM", "task": "Day 2 registration, coffee & networking", "owner": "Registration Lead", "notes": ""},
            {"time": "Day 2 — 10:00 AM", "task": "Day 2 keynote", "owner": "Emcee", "notes": ""},
            {"time": "Day 2 — 01:00 PM", "task": "Lunch and sponsor exhibition", "owner": "Catering + Sponsors", "notes": "Sponsor booths open all day"},
            {"time": "Day 2 — 02:30 PM", "task": "Workshop sessions", "owner": "Session Leads", "notes": ""},
            {"time": "Day 2 — 04:30 PM", "task": "Closing keynote and awards ceremony", "owner": "Event Director", "notes": "Prepare certificates"},
            {"time": "Day 2 — 06:00 PM", "task": "Event closes, teardown begins", "owner": "Ops Lead", "notes": "Post-event feedback forms sent"},
        ],
        "vendor_checklist": [
            f"AV: {max(2, audience_size//100)} wireless mics, 2 projectors, HDMI cables, clickers, backup laptop",
            f"Catering: Breakfast snacks, lunch x2 days for {audience_size} pax, evening refreshments, water stations",
            "Photography: Event photographer + videographer for both days, drone for aerial shots",
            f"Registration: Badge printer, {audience_size + 50} lanyards, badge stock, QR scanner app",
            "Signage: Stage backdrop, directional signs, sponsor pull-up banners, social media wall",
            f"WiFi: Dedicated conference WiFi supporting {audience_size + 100}+ devices simultaneously",
            "Security: 2-4 security staff, ID verification at registration",
            "First Aid: First aid kit, EMT on-call throughout event",
            "Power: Extension cords, power strips, UPS backup for critical AV",
            "Swag: Tote bags, stickers, notebooks, sponsor merchandise for all attendees",
            "Stage: Podium, backdrop, step-and-repeat for photo wall",
        ],
        "contingency_plans": [
            "Speaker cancels last-minute: Pre-record backup session, have standby speaker from attendee list",
            "AV system failure: Backup laptop with all slides preloaded, handheld mic, projector bulb spare",
            "Venue emergency: Identify alternative venue within 2 km, keep venue manager on speed dial",
            "Low attendance: Emergency social push 2 weeks before, activate group discount code, reach out to companies directly",
            "Key sponsor pulls out: Keep 2 backup sponsors at 80% commitment for each major tier",
        ],
    }
