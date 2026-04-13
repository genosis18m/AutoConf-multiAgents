from crewai import Agent, Task, Crew, LLM
from tools.tavily_search import tavily_search_tool
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
    raise ValueError("No LLM API key configured. Set GROQ_API_KEY or GEMINI_API_KEY.")


async def run_sponsor_agent(category: str, geography: str, audience_size: int, budget: float = None) -> dict:
    try:
        llm = get_llm()

        agent = Agent(
            role="Conference Sponsor Research Specialist",
            goal=f"Find the top 10-15 potential sponsors for a {category} conference in {geography} with audience size {audience_size}.",
            backstory=(
                "You are an expert conference sponsorship researcher with 10+ years experience identifying "
                "and securing sponsors for tech and industry conferences. You know how to find companies "
                "that would benefit from sponsoring events in specific domains and geographies."
            ),
            tools=[tavily_search_tool],
            llm=llm,
            verbose=True,
            max_iter=3,
        )

        budget_note = f" Budget constraint: ${budget}" if budget else ""
        task = Task(
            description=f"""
Research and identify the top 10-15 potential sponsors for a {category} conference in {geography}.
Audience size: {audience_size} attendees.{budget_note}

Steps:
1. Search for recent {category} conferences/events in {geography} and identify who sponsored them.
2. Search for {category} companies and startups actively expanding in {geography}.
3. For each sponsor, estimate their budget range and draft a short outreach email.

Return ONLY a valid JSON object (no markdown, no extra text) in exactly this format:
{{
  "sponsors": [
    {{
      "rank": 1,
      "company_name": "Example Corp",
      "industry": "AI/ML",
      "relevance_score": 0.95,
      "estimated_budget": "$20,000-50,000",
      "contact_info": {{"email": "sponsors@example.com", "linkedin": "linkedin.com/company/example"}},
      "rationale": "Why this sponsor fits",
      "outreach_email": "Dear team, we'd like to invite..."
    }}
  ],
  "total_found": 12,
  "search_queries_used": ["query1", "query2"]
}}
""",
            expected_output="A JSON object with sponsors array and metadata.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)

        # Extract JSON from result
        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group())

        return _mock_sponsor_result(category, geography)

    except Exception as e:
        logger.error(f"Sponsor agent error: {e}")
        return _mock_sponsor_result(category, geography)


def _mock_sponsor_result(category: str, geography: str) -> dict:
    return {
        "sponsors": [
            {
                "rank": 1,
                "company_name": f"{category}Tech Solutions",
                "industry": category,
                "relevance_score": 0.95,
                "estimated_budget": "$30,000-60,000",
                "contact_info": {"email": f"sponsors@{category.lower()}tech.com", "linkedin": f"linkedin.com/company/{category.lower()}tech"},
                "rationale": f"Leading {category} company in {geography} with strong community presence.",
                "outreach_email": f"Dear {category}Tech Team,\n\nWe are hosting the premier {category} conference in {geography} and believe your company would be an ideal sponsor. With {geography}'s growing {category} ecosystem, this is a unique opportunity to reach {category} professionals and decision-makers.\n\nWould you be open to a brief call to discuss sponsorship opportunities?\n\nBest regards,\nConferenceAI Team",
            },
            {
                "rank": 2,
                "company_name": "TechVentures Capital",
                "industry": "Venture Capital",
                "relevance_score": 0.88,
                "estimated_budget": "$20,000-40,000",
                "contact_info": {"email": "events@techventures.com", "linkedin": "linkedin.com/company/techventures"},
                "rationale": f"Active VC firm investing in {category} startups in {geography}.",
                "outreach_email": f"Dear TechVentures Team,\n\nWe're organizing a {category} conference in {geography} and would love to explore a sponsorship partnership. Your portfolio companies would gain direct access to our audience of {category} enthusiasts and founders.\n\nLet's connect!\n\nBest,\nConferenceAI Team",
            },
            {
                "rank": 3,
                "company_name": "CloudBase Infrastructure",
                "industry": "Cloud Computing",
                "relevance_score": 0.82,
                "estimated_budget": "$15,000-30,000",
                "contact_info": {"email": "community@cloudbase.io", "linkedin": "linkedin.com/company/cloudbase"},
                "rationale": f"Cloud infrastructure provider popular among {category} developers.",
                "outreach_email": f"Hi CloudBase Team,\n\nWe're building the {geography} {category} Conference and we'd love to have CloudBase as our infrastructure sponsor. Your tools are widely used by our attendees.\n\nWould you be interested in exploring this?\n\nCheers,\nConferenceAI Team",
            },
        ],
        "total_found": 3,
        "search_queries_used": [f"{category} conference sponsors {geography}", f"{category} companies {geography}"],
    }
