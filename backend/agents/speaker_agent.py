try:
    from crewai import Agent, Task, Crew, LLM
    CREWAI_AVAILABLE = True
except Exception:
    Agent = Task = Crew = LLM = None
    CREWAI_AVAILABLE = False
from tools.tavily_search import tavily_search_tool
from config import settings
import json
import logging
import re

logger = logging.getLogger(__name__)


def get_llm():
    if not CREWAI_AVAILABLE:
        raise RuntimeError("CrewAI is not available in this environment.")
    if settings.groq_api_key:
        return LLM(model="groq/llama-3.3-70b-versatile", api_key=settings.groq_api_key)
    if settings.gemini_api_key:
        return LLM(model="gemini/gemini-2.5-flash", api_key=settings.gemini_api_key)
    raise ValueError("No LLM API key configured.")


async def run_speaker_agent(category: str, geography: str, audience_size: int) -> dict:
    try:
        llm = get_llm()

        agent = Agent(
            role="Conference Speaker Curator",
            goal=f"Discover and curate the best 5-8 speakers for a {category} conference in {geography}.",
            backstory=(
                "You are a world-class conference curator who has organized TEDx, PyCon, and major industry "
                "summits. You know how to find speakers who are both knowledgeable and engaging, "
                "and how to build a balanced agenda that keeps audiences captivated."
            ),
            tools=[tavily_search_tool],
            llm=llm,
            verbose=True,
            max_iter=3,
        )

        task = Task(
            description=f"""
Discover the top 5-8 speakers for a {category} conference in {geography} for ~{audience_size} attendees.

Steps:
1. Search for prominent {category} experts and thought leaders active in {geography} or globally.
2. Find recent conference speakers from {category} events in {geography}.
3. Score each speaker on relevance and influence.
4. Map each speaker to an agenda time slot.

Return ONLY valid JSON (no markdown):
{{
  "speakers": [
    {{
      "name": "Dr. Jane Smith",
      "title": "Chief AI Officer",
      "organization": "TechCorp India",
      "relevance_score": 0.95,
      "influence_score": 0.90,
      "topics": ["LLMs in Production", "AI Ethics"],
      "suggested_slot": "Keynote Day 1 — 10:00 AM",
      "bio_summary": "Dr. Smith leads AI research at TechCorp...",
      "source_url": "https://linkedin.com/in/janesmith"
    }}
  ],
  "agenda_mapping": [
    {{"time_slot": "10:00 AM", "speaker": "Dr. Jane Smith", "topic": "LLMs in Production"}}
  ]
}}
""",
            expected_output="A JSON object with speakers array and agenda mapping.",
            agent=agent,
        )

        crew = Crew(agents=[agent], tasks=[task], verbose=False)
        result = crew.kickoff()
        raw = str(result)
        # Extract JSON from result
        raw = raw.strip()
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0]
        
        start = raw.find('{')
        end = raw.rfind('}')
        if start != -1 and end != -1:
            return json.loads(raw[start:end+1])

        return _mock_speaker_result(category, geography)

    except Exception as e:
        logger.error(f"Speaker agent error: {e}")
        return _mock_speaker_result(category, geography)


def _mock_speaker_result(category: str, geography: str) -> dict:
    speakers = [
        {"name": f"Dr. Ananya Sharma", "title": f"Head of {category} Research", "organization": f"{category} Institute {geography}", "relevance_score": 0.96, "influence_score": 0.93, "topics": [f"Future of {category}", "Innovation Trends"], "suggested_slot": "Keynote Day 1 — 10:00 AM", "bio_summary": f"Dr. Sharma is a leading researcher in {category} with 15 years of experience.", "source_url": "https://linkedin.com"},
        {"name": "Rohan Mehta", "title": "CTO & Co-Founder", "organization": "StartupAI", "relevance_score": 0.91, "influence_score": 0.88, "topics": [f"{category} for Startups", "Scaling AI Products"], "suggested_slot": "Talk Day 1 — 11:30 AM", "bio_summary": f"Rohan built StartupAI from 0 to 50M users using {category} at its core.", "source_url": "https://linkedin.com"},
        {"name": "Priya Kapoor", "title": "Principal Engineer", "organization": "GlobalTech", "relevance_score": 0.88, "influence_score": 0.85, "topics": [f"{category} Infrastructure", "MLOps"], "suggested_slot": "Talk Day 1 — 2:00 PM", "bio_summary": f"Priya leads {category} infrastructure at GlobalTech serving 100M+ users.", "source_url": "https://linkedin.com"},
        {"name": "Vikram Singh", "title": "VP of Product", "organization": "InnovateCo", "relevance_score": 0.85, "influence_score": 0.82, "topics": ["Product-Led Growth", f"{category} Product Strategy"], "suggested_slot": "Panel Day 1 — 3:30 PM", "bio_summary": f"Vikram has shipped 20+ {category} products across multiple industries.", "source_url": "https://linkedin.com"},
        {"name": "Neha Joshi", "title": "Founder", "organization": f"{category}Labs", "relevance_score": 0.90, "influence_score": 0.87, "topics": [f"{category} Ethics", "Responsible Innovation"], "suggested_slot": "Keynote Day 2 — 10:00 AM", "bio_summary": f"Neha founded {category}Labs focused on ethical and responsible {category} development.", "source_url": "https://linkedin.com"},
    ]
    agenda = [
        {"time_slot": "10:00 AM", "speaker": "Dr. Ananya Sharma", "topic": f"Future of {category}"},
        {"time_slot": "11:30 AM", "speaker": "Rohan Mehta", "topic": f"{category} for Startups"},
        {"time_slot": "02:00 PM", "speaker": "Priya Kapoor", "topic": f"{category} Infrastructure"},
        {"time_slot": "03:30 PM", "speaker": "Vikram Singh", "topic": f"{category} Product Strategy"},
        {"time_slot": "10:00 AM D2", "speaker": "Neha Joshi", "topic": f"{category} Ethics"},
    ]
    return {"speakers": speakers, "agenda_mapping": agenda}
