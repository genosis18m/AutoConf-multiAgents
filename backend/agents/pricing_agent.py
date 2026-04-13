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


async def run_pricing_agent(category: str, geography: str, audience_size: int, budget: float = None, venue_data: dict = None) -> dict:
    venue_cost_hint = ""
    if venue_data and venue_data.get("venues"):
        top_venue = venue_data["venues"][0]
        venue_cost_hint = f"Top venue estimated cost: {top_venue.get('estimated_cost', 'unknown')}."

    try:
        llm = get_llm()

        agent = Agent(
            role="Conference Pricing & Footfall Analyst",
            goal=f"Predict optimal ticket prices and expected attendance for a {category} conference in {geography}.",
            backstory=(
                "You are a data-driven pricing strategist who has analyzed attendance patterns and "
                "revenue optimization for 300+ tech events. You use historical data patterns, market "
                "comparisons, and demand forecasting to create accurate pricing models."
            ),
            llm=llm,
            verbose=True,
            max_iter=2,
        )

        task = Task(
            description=f"""
Predict optimal ticket pricing and attendance forecast for:
- Category: {category}
- Geography: {geography}
- Target audience: {audience_size}
- Budget: {budget or 'not specified'}
- {venue_cost_hint}

Analyze the market and create a 12-week sales forecast.

Return ONLY valid JSON:
{{
  "pricing_tiers": [
    {{"tier": "Early Bird", "price": 49, "availability": "First 150 tickets"}},
    {{"tier": "Standard", "price": 99, "availability": "General sale"}},
    {{"tier": "VIP", "price": 249, "availability": "Limited to 50"}}
  ],
  "attendance_forecast": {{
    "expected_total": 420,
    "confidence_range": [350, 500],
    "chart_data": [
      {{"week": "Week 1", "cumulative": 45, "weekly": 45}},
      {{"week": "Week 2", "cumulative": 110, "weekly": 65}},
      {{"week": "Week 3", "cumulative": 160, "weekly": 50}},
      {{"week": "Week 4", "cumulative": 200, "weekly": 40}},
      {{"week": "Week 5", "cumulative": 235, "weekly": 35}},
      {{"week": "Week 6", "cumulative": 265, "weekly": 30}},
      {{"week": "Week 7", "cumulative": 295, "weekly": 30}},
      {{"week": "Week 8", "cumulative": 325, "weekly": 30}},
      {{"week": "Week 9", "cumulative": 355, "weekly": 30}},
      {{"week": "Week 10", "cumulative": 380, "weekly": 25}},
      {{"week": "Week 11", "cumulative": 405, "weekly": 25}},
      {{"week": "Week 12", "cumulative": 420, "weekly": 15}}
    ]
  }},
  "revenue_estimate": {{"low": 32000, "expected": 43000, "high": 56000}}
}}
""",
            expected_output="A JSON object with pricing tiers, attendance forecast, and revenue estimate.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)

        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group())

        return _mock_pricing_result(category, geography, audience_size)

    except Exception as e:
        logger.error(f"Pricing agent error: {e}")
        return _mock_pricing_result(category, geography, audience_size)


def _mock_pricing_result(category: str, geography: str, audience_size: int) -> dict:
    india = "india" in geography.lower()
    m = 20 if india else 1
    base_rev = audience_size * (1999 if india else 99)
    chart = []
    cum = 0
    weekly_targets = [0.08, 0.12, 0.10, 0.08, 0.07, 0.06, 0.06, 0.07, 0.08, 0.10, 0.10, 0.08]
    for i, w in enumerate(weekly_targets):
        weekly = int(audience_size * w)
        cum += weekly
        chart.append({"week": f"Week {i+1}", "cumulative": cum, "weekly": weekly})
    return {
        "pricing_tiers": [
            {"tier": "Early Bird", "price": 999 * m if india else 49, "availability": f"First {int(audience_size*0.3)} tickets"},
            {"tier": "Standard", "price": 1999 * m if india else 99, "availability": "General sale"},
            {"tier": "VIP", "price": 4999 * m if india else 249, "availability": f"Limited to {min(50, int(audience_size*0.1))}"},
        ],
        "attendance_forecast": {
            "expected_total": int(audience_size * 0.85),
            "confidence_range": [int(audience_size * 0.7), audience_size],
            "chart_data": chart,
        },
        "revenue_estimate": {
            "low": int(base_rev * 0.7),
            "expected": int(base_rev * 0.85),
            "high": int(base_rev * 1.1),
        },
    }
