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


async def run_ticketing_agent(category: str, geography: str, audience_size: int, budget: float = None) -> dict:
    try:
        llm = get_llm()

        agent = Agent(
            role="Conference Ticketing & Registration Strategist",
            goal=f"Design the optimal ticketing structure for a {category} conference in {geography}.",
            backstory=(
                "You are an expert event registration strategist who has managed ticket sales for 200+ "
                "tech conferences. You know what pricing tiers work in different geographies, how to "
                "maximize early bird conversions, and which registration platforms work best."
            ),
            llm=llm,
            verbose=True,
            max_iter=2,
        )

        task = Task(
            description=f"""
Design a ticketing and registration strategy for a {category} conference in {geography}.
Expected audience: {audience_size}. Budget context: {budget or 'not specified'}.

Suggest 3-4 ticket tiers with pricing appropriate for {geography}'s market.
Estimate conversion rates for each tier.
Recommend a registration platform.

Return ONLY valid JSON:
{{
  "tiers": [
    {{
      "tier": "Early Bird",
      "price": 49,
      "availability": "First 100 tickets (ends 6 weeks before event)",
      "perks": ["Full conference access", "Networking dinner invite", "Recording access"]
    }},
    {{
      "tier": "Standard",
      "price": 99,
      "availability": "General sale",
      "perks": ["Full conference access", "Recording access"]
    }},
    {{
      "tier": "VIP",
      "price": 249,
      "availability": "Limited to 30",
      "perks": ["All Standard perks", "Speaker dinner", "1:1 mentoring session", "VIP lounge"]
    }}
  ],
  "conversion_estimates": {{
    "Early Bird": 0.45,
    "Standard": 0.40,
    "VIP": 0.15
  }},
  "recommended_platform": "Konfhub / Townscript / Eventbrite",
  "notes": "Early bird pricing should be aggressive for {geography} market..."
}}
""",
            expected_output="A JSON object with ticketing tiers, conversion estimates, platform recommendation.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)

        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group())

        return _mock_ticketing_result(category, geography, audience_size)

    except Exception as e:
        logger.error(f"Ticketing agent error: {e}")
        return _mock_ticketing_result(category, geography, audience_size)


def _mock_ticketing_result(category: str, geography: str, audience_size: int) -> dict:
    india_mode = "india" in geography.lower()
    prices = {"early": 999 if india_mode else 49, "standard": 1999 if india_mode else 99, "vip": 4999 if india_mode else 249}
    currency = "INR" if india_mode else "USD"
    return {
        "tiers": [
            {"tier": "Early Bird", "price": prices["early"], "availability": f"First {int(audience_size * 0.3)} tickets", "perks": ["Full conference access", "Lunch & networking", "Digital recordings", "Goodie bag"]},
            {"tier": "Standard", "price": prices["standard"], "availability": "General sale", "perks": ["Full conference access", "Lunch", "Digital recordings"]},
            {"tier": "VIP", "price": prices["vip"], "availability": f"Limited to {min(50, int(audience_size * 0.1))}", "perks": ["All Standard perks", "Speaker dinner access", "1:1 mentoring slot", "VIP lounge", "Premium swag bag"]},
            {"tier": "Student", "price": round(prices["early"] * 0.5), "availability": "With valid student ID", "perks": ["Full conference access", "Student networking session"]},
        ],
        "conversion_estimates": {"Early Bird": 0.45, "Standard": 0.38, "VIP": 0.10, "Student": 0.07},
        "recommended_platform": "Konfhub" if india_mode else "Eventbrite",
        "notes": f"For {geography}, early bird discount should be 40-50% off standard to drive urgency. Student tier helps build community. VIP tier improves per-attendee revenue significantly.",
    }
